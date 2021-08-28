package com.mobinspect.dynamicdq.configuration.model;

import lombok.Getter;
import lombok.Setter;

/** Описание парамметров подключения к базе данных */

@Getter
@Setter
public class DatabaseSettings {
    private String name;
    private String url;
    private String username;
    private String password;
    private Boolean readOnly;
    private Integer position;
}
