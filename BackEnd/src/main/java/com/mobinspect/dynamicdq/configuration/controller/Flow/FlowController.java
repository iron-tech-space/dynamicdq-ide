package com.mobinspect.dynamicdq.configuration.controller.Flow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/api")
public class FlowController {

    @Autowired
    Flow flow;

    @GetMapping("/flow/start")
    public ResponseEntity startFlow() {
        String flowName = "routeControlPoints";
        Map<String, String> headers = new HashMap<>();
        headers.put("userid", "0be7f31d-3320-43db-91a5-3c44c99329ab");
        headers.put("userRoles", "[ROLE_ADMIN, ROLE_README]");
        ObjectNode requestData = new ObjectMapper().createObjectNode();
        Pageable pageable = PageRequest.of(0, 50);
        return flow.start(flowName, headers, requestData, pageable);
    }

    @GetMapping("/flow/read")
    public void readFlows() {
        flow.readFlows();
    }
}