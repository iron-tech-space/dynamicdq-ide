package com.mobinspect.dynamicdq.configuration.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.irontechspace.dynamicdq.annotations.ExecDuration;
import com.irontechspace.dynamicdq.executor.query.QueryService;
import com.irontechspace.dynamicdq.executor.save.SaveService;
import com.irontechspace.dynamicdq.executor.file.FileService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mobinspect.dynamicdq.configuration.DataSourceService;
import com.mobinspect.dynamicdq.utils.Auth;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static com.mobinspect.dynamicdq.utils.Auth.DEFAULT_USER_ID;
import static com.mobinspect.dynamicdq.utils.Auth.DEFAULT_USER_ROLE;

@Log4j2
@RestController
@RequestMapping("/api")
public class DataController {

    @Autowired
    DataSourceService dataSources;
    @Autowired
    QueryService queryService;
    @Autowired
    SaveService saveService;
    @Autowired
    FileService fileService;

    public enum QueryMode { flat, hierarchical, count, object, sql, sqlCount, save }

//    @ExecDuration(param = "configName")
    @PostMapping("/{dataSourceName}/data/{mode}/{configName}")
//    @ApiOperation(value = "Получить данные по параметрам")
    public <T> T getFlatData(
            Authentication authentication,
            @PathVariable String dataSourceName,
            @PathVariable QueryMode mode,
            @PathVariable String configName,
            @RequestBody JsonNode filter, Pageable pageable){
        UUID userId = Auth.getUserId(authentication);
        List<String> userRoles = Auth.getListUserRoles(authentication);
        switch (mode){
            case flat:
                return (T) queryService.getFlatData(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case hierarchical:
                return (T) queryService.getHierarchicalData(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case count:
                return (T) queryService.getFlatDataCount(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case object:
                return (T) queryService.getObject(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case sql:
                return (T) queryService.getSql(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case sqlCount:
                return (T) queryService.getSqlCount(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter, pageable);
            case save:
                return (T) saveService.saveData(dataSources.getDataSource(dataSourceName), configName, userId, userRoles, filter);
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ошибка запроса. Указан не существующий mode");
        }
        // log.info("Mode: [{}] Config: [{}] Result.size: [{} rows]", mode.toString(), configName, result.size());
    }

//    @ExecDuration(param = "configName")
    @GetMapping("/{dataSourceName}/data/file/{configName}/{id}")
//    @ApiOperation("Получить файл")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String configName,
            @PathVariable String id) {
        ObjectNode filter = new ObjectMapper().createObjectNode();
        filter.put("id", id);
        return fileService.getFileResponse(configName, DEFAULT_USER_ID, DEFAULT_USER_ROLE, filter);
    }

//    @ApiOperation("Загрузить новый файл")
//    @ExecDuration(param = "configName")
    @PostMapping(value = "/{dataSourceName}/data/save/file/{configName}", consumes = {"multipart/form-data"})
    public Object uploadFile(
            Authentication authentication,
            @PathVariable String configName,
            @RequestPart MultipartFile file,
            @RequestPart JsonNode dataObject) {
        return fileService.saveFile(configName, Auth.getUserId(authentication), Auth.getListUserRoles(authentication), file, dataObject);
    }
}
