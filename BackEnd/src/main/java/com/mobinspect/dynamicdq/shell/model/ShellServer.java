package com.mobinspect.dynamicdq.shell.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/** Описание парамметров подключения к серверу */

@Getter
@Setter
public class ShellServer {

    private String name;
    private String ip;
    private Integer port;
    private String username;
    private String password;
    private Boolean readOnly;
    private Integer position;
    private List<ShellCommand> commands;
}
