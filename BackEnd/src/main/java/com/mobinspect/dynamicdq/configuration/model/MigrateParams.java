package com.mobinspect.dynamicdq.configuration.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MigrateParams {
    private String dataBaseSource;
    private String dataBaseTarget;
    private MigrateTypes type;
}