package com.mobinspect.dynamicdq.configuration.controller;

import com.irontechspace.dynamicdq.annotations.ExecDuration;
import com.mobinspect.dynamicdq.configuration.DataSourceService;
import com.mobinspect.dynamicdq.configuration.model.DatabaseSettings;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api")
public class DataSourceController {

    @Autowired
    DataSourceService dataSources;

    @ExecDuration
    @GetMapping("/databases")
    public List<DatabaseSettings> getDataBases() {
        return dataSources.getDataBases();
    }

    @ExecDuration
    @PostMapping("/databases/{name}")
    public void setDataBase(
            @PathVariable String name,
            @RequestBody DatabaseSettings settings) {
        dataSources.setDataBase(name, settings);
    }


    @ExecDuration
    @PostMapping("/databases/test-connect")
    public void testConnectDataBase(
            @RequestBody DatabaseSettings settings) {
        dataSources.testConnectDataBase(settings);
    }
}