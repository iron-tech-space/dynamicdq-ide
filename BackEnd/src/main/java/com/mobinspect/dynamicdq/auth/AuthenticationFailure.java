package com.mobinspect.dynamicdq.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Log4j2
public class AuthenticationFailure implements org.springframework.security.web.authentication.AuthenticationFailureHandler {

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private final static SimpleDateFormat DATE_FORMATTER = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");


    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception)
            throws IOException, ServletException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        Map<String, Object> data = new HashMap<>();
        data.put("timestamp", DATE_FORMATTER.format(Calendar.getInstance().getTime()));
        data.put("exception", exception.getMessage());

        log.info("AuthenticationFailure: [{}]", request.getParameter("username"));

        response.getOutputStream().println(OBJECT_MAPPER.writeValueAsString(data));
    }
}
