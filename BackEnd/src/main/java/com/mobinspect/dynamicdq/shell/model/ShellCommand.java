package com.mobinspect.dynamicdq.shell.model;

import lombok.Getter;
import lombok.Setter;

/** Описание парамметров SSH команд */

@Getter
@Setter
public class ShellCommand {

    private String name;
    private String command;
}
