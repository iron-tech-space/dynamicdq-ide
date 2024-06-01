package com.mobinspect.dynamicdq.configuration.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.irontechspace.dynamicdq.annotations.ExecDuration;
import com.irontechspace.dynamicdq.configurator.flow.FlowConfigService;
import com.irontechspace.dynamicdq.configurator.flow.model.FlowConfig;
import com.irontechspace.dynamicdq.configurator.query.model.QueryConfig;
import com.irontechspace.dynamicdq.configurator.save.model.SaveConfig;
import com.irontechspace.dynamicdq.configurator.query.QueryConfigService;
import com.irontechspace.dynamicdq.configurator.save.SaveConfigService;
import com.irontechspace.dynamicdq.exceptions.ForbiddenException;
import com.mobinspect.dynamicdq.configuration.DataSourceService;
import com.mobinspect.dynamicdq.configuration.model.MigrateParams;
import com.mobinspect.dynamicdq.utils.Auth;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Log4j2
@RestController
@RequestMapping("/api")
public class ConfigurationController {

    @Autowired
    QueryConfigService queryConfigService;
    @Autowired
    SaveConfigService saveConfigService;
    @Autowired
    FlowConfigService flowConfigService;
    @Autowired
    DataSourceService dataSources;

    @ExecDuration
    @PostMapping("/migrate-configs")
    public void migrateConfigs(@RequestBody MigrateParams migrateParams, Authentication authentication) {
        UUID userId = Auth.getUserId(authentication);
        List<String> userRoles = Auth.getListUserRoles(authentication);
        switch (migrateParams.getType()){
            case FULL:
                migrateQueryConfigs(migrateParams, userId, userRoles);
                migrateSaveConfigs(migrateParams, userId, userRoles);
                migrateFlowConfigs(migrateParams, userId, userRoles);
                break;
            case QUERY:
                migrateQueryConfigs(migrateParams, userId, userRoles);
                break;
            case SAVE:
                migrateSaveConfigs(migrateParams, userId, userRoles);
                break;
            case FLOW:
                migrateFlowConfigs(migrateParams, userId, userRoles);
                break;
        }
    }

    private void migrateQueryConfigs(MigrateParams migrateParams, UUID userId, List<String> userRoles){
        List<QueryConfig> configs = queryConfigService.getAll(dataSources.getDataSource(migrateParams.getDataBaseSource()), userId, userRoles);
        for(QueryConfig config : configs)
            queryConfigService.save(dataSources.getDataSource(migrateParams.getDataBaseTarget()), config);
    }

    private void migrateSaveConfigs(MigrateParams migrateParams, UUID userId, List<String> userRoles){
        List<SaveConfig> configs = saveConfigService.getAll(dataSources.getDataSource(migrateParams.getDataBaseSource()), userId, userRoles);
        for(SaveConfig config : configs)
            saveConfigService.save(dataSources.getDataSource(migrateParams.getDataBaseTarget()), config);
    }

    private void migrateFlowConfigs(MigrateParams migrateParams, UUID userId, List<String> userRoles){
        List<FlowConfig> configs = flowConfigService.getAll(dataSources.getDataSource(migrateParams.getDataBaseSource()), userId, userRoles);
        for(FlowConfig config : configs)
            flowConfigService.save(dataSources.getDataSource(migrateParams.getDataBaseTarget()), config);
    }


    /** ===================== QUERY ====================== */

    /** Получить конфигурации запросов */
    @ExecDuration
    @GetMapping("/{dataSourceName}/configurations/query")
    public List<QueryConfig> getQueryConfigs(@PathVariable String dataSourceName, Authentication authentication) {
        return queryConfigService.getAll(dataSources.getDataSource(dataSourceName), Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Получить конфигурацию запросов по именю */
//    @ExecDuration(param = "configName")
    @GetMapping("/{dataSourceName}/configurations/query/{configName}")
    public QueryConfig getQueryConfigByName(@PathVariable String dataSourceName, @PathVariable String configName, Authentication authentication) {
        return queryConfigService.getByName(dataSources.getDataSource(dataSourceName), configName, Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Сохранить позицию конфигурации запросов */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/query/position")
    public void setQueryConfigPosition(@PathVariable String dataSourceName, @RequestBody QueryConfig saveConfig){
        checkReadOnly(dataSourceName);
        queryConfigService.savePosition(dataSources.getDataSource(dataSourceName), saveConfig);
    }
    /** Сохранить конфигурацию запросов */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/query")
    public QueryConfig setQueryConfig(@PathVariable String dataSourceName, @RequestBody QueryConfig queryConfig){
        checkReadOnly(dataSourceName);
//        return queryConfigService.save(dataSources.getDataSource(dataSourceName), queryConfig);
        return queryConfigService.save(dataSources.getDataSource(dataSourceName), queryConfig);
    }
    /** Удалить конфигурацию запросов */
    @ExecDuration
    @DeleteMapping("/{dataSourceName}/configurations/query/{configId}")
    public void deleteQueryConfigById(@PathVariable String dataSourceName, @PathVariable UUID configId){
        checkReadOnly(dataSourceName);
        queryConfigService.delete(dataSources.getDataSource(dataSourceName), configId);
    }

    /** ===================== SAVE ====================== */

    /** Получить конфигурации сохранения */
    @ExecDuration
    @GetMapping("/{dataSourceName}/configurations/save")
    public List<SaveConfig> getSaveConfig(@PathVariable String dataSourceName, Authentication authentication){
        return saveConfigService.getAll(dataSources.getDataSource(dataSourceName), Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Получить конфигурацию сохранения по именю */
    @ExecDuration
    @GetMapping("/{dataSourceName}/configurations/save/{configName}")
    public SaveConfig getSaveConfigByName(@PathVariable String dataSourceName, @PathVariable String configName, Authentication authentication){
        return saveConfigService.getByName(dataSources.getDataSource(dataSourceName), configName, Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Сохранить позицию конфигурации сохранения */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/save/position")
    public void setSaveConfigPosition(@PathVariable String dataSourceName, @RequestBody SaveConfig saveConfig){
        checkReadOnly(dataSourceName);
        saveConfigService.savePosition(dataSources.getDataSource(dataSourceName), saveConfig);
    }

    /** Сохранить конфигурацию сохранения */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/save")
    public void setSaveConfigs(@PathVariable String dataSourceName, @RequestBody SaveConfig saveConfig){
        checkReadOnly(dataSourceName);
        saveConfigService.save(dataSources.getDataSource(dataSourceName), saveConfig);
    }

    /** Удалить конфигурацию сохранения */
    @ExecDuration
    @DeleteMapping("/{dataSourceName}/configurations/save/{configId}")
    public void deleteSaveConfigs(@PathVariable String dataSourceName, @PathVariable UUID configId){
        checkReadOnly(dataSourceName);
        saveConfigService.delete(dataSources.getDataSource(dataSourceName), configId);
    }

    @GetMapping("/{dataSourceName}/configurations/save/tables")
    public List<String> getDbTables(@PathVariable String dataSourceName) {
        return saveConfigService.getDbTables(dataSources.getDataSource(dataSourceName));
    }

    @GetMapping("/{dataSourceName}/configurations/save/fields/{tableName}")
    public List<ObjectNode> getDbFieldsByTable(@PathVariable String dataSourceName, @PathVariable String tableName) {
        return saveConfigService.getDbFieldsByTable(dataSources.getDataSource(dataSourceName), tableName);
    }

    /** ===================== FLOW ====================== */

    /** Получить конфигурации потоков */
    @ExecDuration
    @GetMapping("/{dataSourceName}/configurations/flow")
    public List<FlowConfig> getFlowConfig(@PathVariable String dataSourceName, Authentication authentication){
        return flowConfigService.getAll(dataSources.getDataSource(dataSourceName), Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Получить конфигурацию потоков по именю */
    @ExecDuration
    @GetMapping("/{dataSourceName}/configurations/flow/{configName}")
    public FlowConfig getFlowConfigByName(@PathVariable String dataSourceName, @PathVariable String configName, Authentication authentication){
        return flowConfigService.getByName(dataSources.getDataSource(dataSourceName), configName, Auth.getUserId(authentication), Auth.getListUserRoles(authentication));
    }
    /** Сохранить позицию конфигурации сохранения */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/flow/position")
    public void setFlowConfigPosition(@PathVariable String dataSourceName, @RequestBody FlowConfig config){
        checkReadOnly(dataSourceName);
        flowConfigService.savePosition(dataSources.getDataSource(dataSourceName), config);
    }

    /** Сохранить конфигурацию сохранения */
    @ExecDuration
    @PostMapping("/{dataSourceName}/configurations/flow")
    public void setFlowConfigs(@PathVariable String dataSourceName, @RequestBody FlowConfig config){
        checkReadOnly(dataSourceName);
        flowConfigService.save(dataSources.getDataSource(dataSourceName), config);
    }

    /** Удалить конфигурацию сохранения */
    @ExecDuration
    @DeleteMapping("/{dataSourceName}/configurations/flow/{configId}")
    public void deleteFlowConfigs(@PathVariable String dataSourceName, @PathVariable UUID configId){
        checkReadOnly(dataSourceName);
        flowConfigService.delete(dataSources.getDataSource(dataSourceName), configId);
    }

    private void checkReadOnly (String dataSourceName){
        if(dataSources.getDatabase(dataSourceName).getReadOnly())
            throw new ForbiddenException(String.format("Не доступа на редактирование БД [%s]", dataSourceName));
    }
}
