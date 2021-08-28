package com.mobinspect.dynamicdq.users;

import com.mobinspect.dynamicdq.auth.user.User;
import com.mobinspect.dynamicdq.auth.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UsersController {

    @Autowired
    UserService userService;

    @GetMapping("/users")
    public List<User> getUsers () {
        return userService.getUsers();
    }

    @GetMapping("/users/{username}")
    public User getUser(@PathVariable String username){
        return userService.getUserByUsername(username);
    }

    @PostMapping("/users")
    public void createUser(@RequestBody User user){
        userService.createUser(user);
    }

    @PutMapping("/users")
    public void updateUser(@RequestBody User user){
        userService.updateUser(user);
    }

    @DeleteMapping("/users/{username}")
    public void deleteUser(@PathVariable String username){
        userService.deleteUser(username);
    }

    @PostMapping("/users/password/reset")
    public void resetPassword(@RequestBody Map<String, String> data){
        if(!data.containsKey("username") || !data.containsKey("newPassword"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не задан [username] или [newPassword]");
        userService.resetPassword(data.get("username"), data.get("newPassword"));
    }

    @PostMapping("/users/password/change")
    public void changePassword(@RequestBody Map<String, String> passwords){
        if(!passwords.containsKey("oldPassword") || !passwords.containsKey("newPassword"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не задан старый или новый пароль");
        userService.changePassword(passwords.get("oldPassword"), passwords.get("newPassword"));
    }
}
