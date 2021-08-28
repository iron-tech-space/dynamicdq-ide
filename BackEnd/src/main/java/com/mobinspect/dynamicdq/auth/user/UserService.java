package com.mobinspect.dynamicdq.auth.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
@Service
public class UserService implements UserDetailsService {

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final Map<String, User> users = new HashMap<String, User>();

    @Value("${users.path}")
    String usersPath;
    String usersFile;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostConstruct
    void init () {
        usersFile = usersPath + "Users.json";
        readUsersFromDisk();
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUserByUsername(username);
    }

    public List<User> getUsers() {
        return new ArrayList<>(users.values());
    }

    public User getUserByUsername(String username) {
        User user = users.get(username.toLowerCase());
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        log.info("getUserByUsername => [{}] [{}]", user.getUsername(), user.getPassword());
        return new User(user);
    }

    public void createUser(User user) {
        Assert.isTrue(!userExists(user.getUsername()), "User не должен существовать");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        users.put(user.getUsername().toLowerCase(), user);
        writeUsersToDisk();
    }

    public void updateUser(User user) {
        Assert.isTrue(userExists(user.getUsername()), "User должен существовать");
        User mutableUser = users.get(user.getUsername().toLowerCase());
        user.setPassword(mutableUser.getPassword());
        users.put(user.getUsername().toLowerCase(), user);
        writeUsersToDisk();
    }

    public void deleteUser(String username) {
        Assert.isTrue(userExists(username), "User должен существовать");
        users.remove(username.toLowerCase());
    }

    public void resetPassword(String username, String newPassword) {
        Assert.isTrue(userExists(username), "User должен существовать");
        User mutableUser = users.get(username.toLowerCase());
        mutableUser.setPassword(passwordEncoder.encode(newPassword));
        writeUsersToDisk();
    }

    public void changePassword(String oldPassword, String newPassword) {
        Authentication currentUser = SecurityContextHolder.getContext().getAuthentication();

        if (currentUser == null) {
            // This would indicate bad coding somewhere
            throw new AccessDeniedException("Can't change password as no Authentication object found in context for current user.");
        }

        String username = currentUser.getName();

        log.debug("Changing password for user [{}]", username);

        // If an authentication manager has been set, re-authenticate the user with the
        // supplied password.
        if (authenticationManager != null) {
            log.debug("Reauthenticating user [{}] for password change request.", username);
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, oldPassword));
        }
        else
            log.debug("No authentication manager set. Password won't be re-checked.");

        User user = users.get(username);

        if (user == null)
            throw new IllegalStateException("Current user doesn't exist in database.");

        user.setPassword(passwordEncoder.encode(newPassword));
        writeUsersToDisk();
    }

    private boolean userExists(String username) {
        return users.containsKey(username.toLowerCase());
    }

    private void readUsersFromDisk(){
        try {
            Map<String, User> readUsers = OBJECT_MAPPER.readValue(new FileInputStream(usersFile), new TypeReference<Map<String, User>>() {});
            for(Map.Entry<String, User> userEntry : readUsers.entrySet()){
                String key = userEntry.getKey();
                User user = userEntry.getValue();
                users.put(key, user);
                log.info("Config param [user.{}]: {}", key, user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
            }
        } catch (Exception ex){
            log.error("Ошибка чтения файла с пользователями [{}]", usersFile);
        }
    }

    private void writeUsersToDisk(){
        try {
            OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValue(new File(usersFile), users);
            log.info("Write users to disk");
        } catch (Exception ex){
            log.error("Ошибка записи файла с пользователями [{}]", usersFile);
        }
    }
}
