package com.mobinspect.dynamicdq.jira;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
public class JiraController {
    @Autowired
    JiraService jiraService;

    @RequestMapping("/api/jira/**")
    public void jira (HttpServletRequest request, HttpServletResponse response){
        jiraService.request(request, response);
    }
}
