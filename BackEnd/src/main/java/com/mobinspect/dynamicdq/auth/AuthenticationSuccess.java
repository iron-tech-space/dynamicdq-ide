package com.mobinspect.dynamicdq.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobinspect.dynamicdq.auth.user.User;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Log4j2
public class AuthenticationSuccess implements org.springframework.security.web.authentication.AuthenticationSuccessHandler {

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException{

        HttpSession session = request.getSession();
        User authUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        session.setAttribute("username", authUser.getUsername());
        session.setAttribute("authorities", authentication.getAuthorities());

        //set our response to OK status
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("username", authUser.getUsername());
        responseData.put("roles", authentication.getAuthorities());
        responseData.put("redirect", "/");

        log.info("AuthenticationSuccess: [{}]", authUser.getUsername());

        response.setStatus(HttpServletResponse.SC_OK);
        response.getOutputStream().println(OBJECT_MAPPER.writeValueAsString(responseData));
    }
}
