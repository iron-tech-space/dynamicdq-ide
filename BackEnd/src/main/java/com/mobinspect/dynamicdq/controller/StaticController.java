package com.mobinspect.dynamicdq.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Log4j2
@Controller
public class StaticController {

    @Value("${react.project.path}")
    String reactProjectPath;

    @GetMapping("/**")
    public ResponseEntity<Resource> login(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        String requestUrl = request.getRequestURI();
        String requestPath;
        String reactProjectDir;
        Path filePath;

        if (requestUrl.startsWith("/advanced-management")) {
            reactProjectDir = reactProjectPath;
            requestPath = requestUrl.replace("/advanced-management", "");
        } else {
            reactProjectDir = reactProjectPath;
            requestPath = requestUrl;
        }

//        if(authentication == null) { //&& requestUrl.startsWith("/login")
//            log.info("Redirect to main");
//            response.sendRedirect("/login");
//        }

        if (requestPath.startsWith("/static")) {
            filePath = Paths.get(reactProjectDir, requestPath);
//            log.info("GET STATIC FILE [{}] => [{}]", requestUrl, requestPath);
        } else {
            filePath = Paths.get(reactProjectDir, "/index.html");
//            log.info("GET STATIC FILE [{}] => [{}]", requestUrl, "/index.html");
        }

        try {
            FileSystemResource resource = new FileSystemResource(filePath);
            resource.contentLength();
            MediaType mediaType = MediaTypeFactory
                    .getMediaType(resource)
                    .orElse(MediaType.APPLICATION_OCTET_STREAM);
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(resource);
        } catch (FileNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Файл не найден");
        }
    }
}
