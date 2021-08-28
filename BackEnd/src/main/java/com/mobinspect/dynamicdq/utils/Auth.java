package com.mobinspect.dynamicdq.utils;

import com.mobinspect.dynamicdq.auth.user.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class Auth {

    public final static UUID DEFAULT_USER_ID = UUID.fromString("0be7f31d-3320-43db-91a5-3c44c99329ab");
    public final static List<String> DEFAULT_USER_ROLE = Collections.singletonList("ROLE_ADMIN");

    public static UUID getUserId (Authentication authentication){
        if(authentication == null)
            throw new AccessDeniedException("Не авторизованный запрос");
        User user = (User) authentication.getPrincipal();
        return user.getId();
    }

    public static List<String> getListUserRoles (Authentication authentication){
        if(authentication == null)
            throw new AccessDeniedException("Не авторизованный запрос");
        User user = (User) authentication.getPrincipal();
        return user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
    }
}
