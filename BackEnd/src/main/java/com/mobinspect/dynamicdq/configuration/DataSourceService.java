package com.mobinspect.dynamicdq.configuration;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.irontechspace.dynamicdq.exceptions.NotFoundException;
import com.mobinspect.dynamicdq.configuration.model.DatabaseSettings;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.util.*;

/**
 * DataSourceManager.java
 * Date: 10 сент. 2018 г.
 * Users: amatveev
 * Description: Менеджер конфигураций баз данных
 */
@Log4j2
@Service
public class DataSourceService
{
    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final Map<String, DatabaseSettings> dataBases = new TreeMap<>();
    private final Map<String, DataSource> dataSources = new HashMap<>();

    @Value("${dataBases.path}")
    String dataBasesPath;
    String dataBasesFile;

    @PostConstruct
    void init() {
        dataBasesFile = dataBasesPath + "DataBases.json";
        readDataBases();
    }

    public DataSource getDataSource(String name)
    {
        return Optional.ofNullable(dataSources.get(name)).orElseThrow(() -> new NotFoundException("DataSource [" + name + "] не найден"));
    }

    public DatabaseSettings getDatabase(String name){
        return Optional.ofNullable(dataBases.get(name)).orElseThrow(() -> new NotFoundException("DataBases [" + name + "] не найдена"));
    }

    public List<DatabaseSettings> getDataBases(){
        List<DatabaseSettings> result = new ArrayList<>(dataBases.keySet().size());
        for (String key : dataBases.keySet()) {
            DatabaseSettings ds = dataBases.get(key);
            ds.setName(key);
            result.add(ds);
        }
        result.sort(Comparator.comparingInt(DatabaseSettings::getPosition));
        return result;
    }

    public void setDataBase(String name, DatabaseSettings settings){
        setDataSource(name, settings);
        dataBases.put(name, settings);
        writeDataBases();
    }

    public void testConnectDataBase(DatabaseSettings settings) {
        createDataSource(settings);
    }

    private void readDataBases() {
        try {
            Map<String, DatabaseSettings> readDataBases = OBJECT_MAPPER.readValue(new FileInputStream(dataBasesFile), new TypeReference<TreeMap<String, DatabaseSettings>>() {});
            for(Map.Entry<String, DatabaseSettings> database : readDataBases.entrySet()){
                String key = database.getKey();
                DatabaseSettings ds = database.getValue();
                setDataSource(key, ds);
                dataBases.put(key, ds);
                log.info("Config param [databases.{}]: [{}]", key, ds.getUrl());
            }
        } catch (Exception ex){
            log.error("Ошибка чтения файла с настройками БД [{}]", dataBasesFile);
        }
    }

    private void writeDataBases() {
        try {
            String dbs = OBJECT_MAPPER.writeValueAsString(dataBases);
            OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValue(new File(dataBasesFile), dataBases);
            log.info("Write dataBases: [{}]", dbs);
        } catch (Exception ex){
            log.error("Ошибка записи файла с настройками БД [{}]", dataBasesFile);
        }
    }

    private void setDataSource(String name, DatabaseSettings settings){
        dataSources.put(name, createDataSource(settings));
    }

    private DataSource createDataSource(DatabaseSettings settings)
    {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDriverClassName("org.postgresql.Driver");
        hikariConfig.setJdbcUrl(settings.getUrl());
        hikariConfig.setUsername(settings.getUsername());
        hikariConfig.setPassword(settings.getPassword());
        hikariConfig.setMaximumPoolSize(1);
//        hikariConfig.setPoolName(key);
        return new HikariDataSource(hikariConfig);
    }
}
