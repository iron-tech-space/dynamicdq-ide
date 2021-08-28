package com.mobinspect.dynamicdq.jira;

import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.core.util.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.LinkedList;
import java.util.Objects;
import java.util.Optional;

@Log4j2
@Service
public class JiraService {

    private final RestTemplate restTemplate = new RestTemplate();

    public void request(HttpServletRequest request, HttpServletResponse response) {

        StringBuilder url = new StringBuilder();
        url.append("https://atlassian.dias-dev.ru");
        url.append(request.getRequestURI().substring(4));
        if(request.getQueryString() != null) url.append("?").append(request.getQueryString());
        // Формирование заголовков
        HttpHeaders headers = new HttpHeaders();

        // Заполнение заголовков
        headers.add("Authorization", request.getHeader("jiraAuth"));
        if(!request.getMethod().equals("GET"))
            headers.add("Content-Type", "application/json");

        restTemplate.execute(
                url.toString(),
                Optional.ofNullable(HttpMethod.resolve(request.getMethod())).orElse(HttpMethod.GET),
                clientRequest -> {
                    HttpHeaders clientHeaders = clientRequest.getHeaders();
                    headers.forEach((key, values) -> clientHeaders.put(key, new LinkedList<>(values)));
//                    log.info(getS(request.getInputStream()));
                    FileCopyUtils.copy(request.getInputStream(), clientRequest.getBody());
                },
                clientResponse -> {
                    clientResponse.getHeaders().forEach((key, values) -> {
                        // if(!key.equals("Set-Cookie"))
                            //values.forEach(e -> response.setHeader(key, e));
                    });
//                    log.info(getS(clientResponse.getBody()));
                    FileCopyUtils.copy(clientResponse.getBody(), response.getOutputStream());
                    response.setStatus(clientResponse.getRawStatusCode());
                    return null;
                });
    }

    private String getS (InputStream inputStream){
        final int bufferSize = 1024;
        final char[] buffer = new char[bufferSize];
        final StringBuilder out = new StringBuilder();
        try(Reader in = new InputStreamReader(inputStream, StandardCharsets.UTF_8)) {
            for (; ; ) {
                int rsz = in.read(buffer, 0, buffer.length);
                if (rsz < 0)
                    break;
                out.append(buffer, 0, rsz);
            }
            return out.toString();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
