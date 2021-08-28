package com.mobinspect.dynamicdq.shell;

import com.irontechspace.dynamicdq.annotations.ExecDuration;
import com.irontechspace.dynamicdq.exceptions.NotFoundException;
import com.mobinspect.dynamicdq.shell.model.ShellRequestParams;
import com.mobinspect.dynamicdq.shell.model.ShellServer;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api")
public class ShellController {

    @Autowired
    ShellService shellService;

    @ExecDuration
    @GetMapping("/servers")
    public List<ShellServer> getServers() {
        return shellService.getServers();
    }

    @ExecDuration
    @PostMapping("/execute")
    public String executeCmd(@RequestBody ShellRequestParams requestParams) {
        ShellServer srv = shellService.getServers()
                .stream().filter(server -> server.getName().equals(requestParams.getServerName())).findFirst()
                .orElseThrow(() -> new NotFoundException("Server [" + requestParams.getServerName() + "] не найден"));
        return shellService.executeCmd(srv, requestParams.getCmd());
    }
}
