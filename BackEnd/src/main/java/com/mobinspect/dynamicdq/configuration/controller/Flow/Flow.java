package com.mobinspect.dynamicdq.configuration.controller.Flow;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.irontechspace.dynamicdq.executor.query.QueryService;
import com.irontechspace.dynamicdq.utils.Auth;
import com.mobinspect.dynamicdq.configuration.DataSourceService;
import lombok.extern.log4j.Log4j2;
import org.eclipse.core.runtime.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.FileInputStream;
import java.lang.reflect.Method;
import java.util.*;

//class FlowObject <T> extends Object {
//
//    private T value;
//
//    public FlowObject() {
//        this.value = null;
//    }
//
//    public FlowObject(T value) {
//        this.value = value;
//    }
//
//    public boolean isNull () {
//        return (value == null);
//    }
//    public boolean isNotNull () {
//        return !(value == null);
//    }
//    public T orValue(T value) {
//        return (T) (isNotNull() ? value : value);
//    }
//}

@Log4j2
@Service
public class Flow {

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private List<FlowVariableModel> flowVariables = new LinkedList<>();
    private List<FlowNodeModel> flowNodes = new LinkedList<>();

    @Value("${dataBases.path}")
    String flowPath;
    String flowFile;

    @Autowired
    DataSourceService dataSources;

    @Autowired
    QueryService queryService;

    @PostConstruct
    void init() {
        flowFile = flowPath + "FlowWithVar.json";
        readFlows();
    }

    private static boolean isNull (Object obj) {
        return (obj == null);
    }
    private static boolean isNotNull (Object obj) {
        return !(obj == null);
    }
    private static <T> T objectOrValue (Object obj, Object value) {
        return (T) (isNotNull(obj) ? obj : value);
    }


    /** ===================== Private Utilities ====================== */
    public void readFlows() {
        try {
            // List<FlowNodeModal> fileFlowNodes = OBJECT_MAPPER.readValue(new FileInputStream(flowFile), new TypeReference<List<FlowNodeModal>>() {});
            FlowDiagramModel fileFlowDiagram = OBJECT_MAPPER.readValue(new FileInputStream(flowFile), FlowDiagramModel.class);
            flowVariables = fileFlowDiagram.getVariables();
            flowNodes = fileFlowDiagram.getFlows();
            log.info("Config param flow.vars: [{}] flow.nodes: [{}]", flowVariables.size(), flowNodes.size());
        } catch (Exception ex){
            log.error("Ошибка чтения файла с flows [{}]", flowFile);
        }
//        Integer a = 0;
//        a.toString()
    }

    public ResponseEntity start (String flowName, Map<String, String> headers, JsonNode requestData, Pageable pageable) {
        FlowNodeModel flow = findStartFlow();
        Assert.isNotNull(flow, "Not found first flow node");

        FlowNodeModel execFlow = flow;
        while(execFlow != null){
            try {
                String methodName = execFlow.getType() + "Exec";
                if(execFlow.getType().equals("request")) {
                    Method method = getClass().getDeclaredMethod(methodName, FlowNodeModel.class, String.class, Map.class, JsonNode.class, Pageable.class);
                    method.invoke(this, execFlow, flowName, headers, requestData, pageable);
                } else if(execFlow.getType().startsWith("response")) {
                    Method method = getClass().getDeclaredMethod(methodName, FlowNodeModel.class);
                    return (ResponseEntity) method.invoke(this, execFlow);
                } else {
                    Method method = getClass().getDeclaredMethod(methodName, FlowNodeModel.class);
                    method.invoke(this, execFlow);
                }
                Optional<FlowPortModel> outExecPort = execFlow.getOutPorts().stream().filter(f -> f.getName().equals("OutExec")).findFirst();
                if(outExecPort.isPresent() && outExecPort.get().getLinks().size() == 1){
                    FlowLinkModel link = outExecPort.get().getLinks().get(0);
                    FlowNodeModel node = findFlowNodeById(link.getNode());
                    if(isNotNull(node)){
                        execFlow = node;
                    } else {
                        String msg = String.format("Не найдена следующая нода выполнения. Current node id: [%s], type: [%s], link to node [%s]", execFlow.getId(), execFlow.getType(), link.getNode());
                        log.error(msg);
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
                    }
                } else {
                    if(execFlow.getType().startsWith("response")){
                        execFlow = null;
                    } else {
                        String msg = String.format("Не найдена порт выхода или на нем нет ссылок. Current node id: [%s], type: [%s]", execFlow.getId(), execFlow.getType());
                        log.error(msg);
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
                    }
                }
            } catch (Exception e) {
//                e.printStackTrace();
                String msg = String.format("Ошибка выполнения Flow. Current node id: [%s], type: [%s]", execFlow.getId(), execFlow.getType());
                log.error(msg);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
            }
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка выполнения Flow");
    }

    private FlowNodeModel findStartFlow () {
        return flowNodes.stream().filter(f -> f.getType().equals("request")).findFirst().orElse(null);
    }
    private FlowNodeModel findFlowNodeById (String id) {
        return flowNodes.stream().filter(f -> f.getId().equals(id)).findFirst().orElse(null);
    }
    private FlowPortModel findFlowInPortById (FlowNodeModel node, String id) {
        return node.getInPorts().stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null);
    }
    private FlowPortModel findFlowOutPortById (FlowNodeModel node, String id) {
        return node.getOutPorts().stream().filter(p -> p.getId().equals(id)).findFirst().orElse(null);
    }
    private FlowPortModel findFlowInPortByName (FlowNodeModel node, String name) {
        return node.getInPorts().stream().filter(p -> p.getName().equals(name)).findFirst().orElse(null);
    }
    private FlowPortModel findFlowOutPortByName (FlowNodeModel node, String name) {
        return node.getOutPorts().stream().filter(p -> p.getName().equals(name)).findFirst().orElse(null);
    }

    private <T> T findValueByPortName(FlowNodeModel flow, String portName) {
        return findValueByPortName(flow, portName, null);
    }
    private <T> T findValueByPortName(FlowNodeModel flow, String portName, T defaultValue) {
        // Ищим входной порт в ноде
        FlowPortModel port = findFlowInPortByName(flow, portName);
        // Если входной порт существует && не имеет значения && имеет 1 ссылку
        if(isNotNull(port) && port.getValue() == null && port.getLinks().size() == 1) {
            // Ищем значение по ссылке
            Object value = findValueByLinks(port.getLinks().get(0));
            if(isNull(value) && isNotNull(defaultValue)) {
                return defaultValue;
            } else {
                return (T) value;
            }
        }
        return isNotNull(defaultValue) ? defaultValue : null;
    }
    private Object findValueByLinks (FlowLinkModel link) {
        // Ищем ноду по ссылке
        FlowNodeModel node = findFlowNodeById(link.getNode());
        // Если нода существует
        if(isNotNull(node)){
            // Ищем выходной порт
            FlowPortModel port = findFlowOutPortById(node, link.getPort());
            // Если выходной порт существует
            if(isNotNull(port)){
                // Если значение пусто
                if(port.getValue() == null) {
                    // Пытаемся выполнить ноду
                    try {
                        Method method = getClass().getDeclaredMethod(node.getType(), FlowNodeModel.class);
                        return method.invoke(this, node);
                    } catch (Exception e) {
                        e.printStackTrace();
                        String msg = String.format("Ошибка выполнения метода с данными. Current node id: [%s], type: [%s]", node.getId(), node.getType());
                        log.error(msg);
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
                    }
                } else {
                    // Вернем значение
                    return port.getValue();
                }
            }
        } else {
            String msg = "FindValueByLinks - not found value";
            log.error(msg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
        }
        return null;
    }

    /** ===================== Variables ====================== */
    private Object getVariable(FlowNodeModel flow) {
        Optional<FlowVariableModel> var = flowVariables.stream().filter(f -> f.getId().equals(flow.getVariable())).findFirst();
        if(var.isPresent())
            return var.get().getValue();
        else {
            String msg = String.format("Ошибка получения переменной. Переменная НЕ найдена. Current node id: [%s], var id: [%s]", flow.getId(), flow.getVariable());
            log.error(msg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
        }
    }

    private void setVariableExec(FlowNodeModel flow) {
        Object value = findValueByPortName(flow, "SetData");
        Optional<FlowVariableModel> var = flowVariables.stream().filter(f -> f.getId().equals(flow.getVariable())).findFirst();
        if(var.isPresent())
            var.get().setValue(value);
        else {
            String msg = String.format("Ошибка получения переменной. Переменная НЕ найдена. Current node id: [%s], var id: [%s]", flow.getId(), flow.getVariable());
            log.error(msg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
        }
    }

    /** ===================== Network ====================== */
    private void requestExec(FlowNodeModel flow, String flowName, Map<String, String> headers, JsonNode requestData, Pageable pageable) {
        for(FlowPortModel port : flow.getOutPorts()){
            switch (port.getName()){
                case "FlowName": port.setValue(flowName); break;
                case "Headers": port.setValue(headers); break;
                case "UserId": port.setValue(Auth.getUserId(headers)); break;
                case "UserRoles": port.setValue(Auth.getListUserRoles(headers)); break;
                case "RequestData": port.setValue(requestData); break;
                case "PageNum": port.setValue(pageable.getPageNumber()); break;
                case "PageSize": port.setValue(pageable.getPageSize()); break;
            }
        }
    }
    private ResponseEntity<Boolean> responseBoolExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((Boolean) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<Integer> responseIntExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((Integer) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<Float> responseFloatExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((Float) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<String> responseStringExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((String) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<List<String>> responseStringListExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((List<String>) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<ObjectNode> responseJsonExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((ObjectNode) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<List<ObjectNode>> responseJsonListExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((List<ObjectNode>) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }
    private ResponseEntity<Object> responseObjectExec(FlowNodeModel flow){
//        return ResponseEntity.ok().body((Object) findValueByPortName(flow, "Body"));
        return ResponseEntity.ok().body(findValueByPortName(flow, "Body"));
    }

    /** ===================== Flow control ====================== */



    /** ===================== Data ====================== */
    private void getFlatDataExec(FlowNodeModel flow) {
        FlowPortModel port = findFlowOutPortByName(flow, "ReturnData");
        if(isNotNull(port))
            port.setValue( (List<ObjectNode>) getDataExec(flow, "getFlatData"));
    }

    private void getHierarchicalDataExec(FlowNodeModel flow) {
        FlowPortModel port = findFlowOutPortByName(flow, "ReturnData");
        if(isNotNull(port))
            port.setValue( (List<ObjectNode>) getDataExec(flow, "getHierarchicalData"));
    }

    private <T> T getDataExec(FlowNodeModel flow, String methodName){
        String configName = findValueByPortName(flow, "ConfigName");
        UUID userId = findValueByPortName(flow, "UserId");
        List<String> userRoles = findValueByPortName(flow, "UserRoles");
        ObjectNode requestData = findValueByPortName(flow, "Data");
        Pageable pageable = PageRequest.of(
                findValueByPortName(flow, "PageNum",0),
                findValueByPortName(flow, "PageSize", 50));

        try {
            Method method = queryService.getClass().getDeclaredMethod(methodName, DataSource.class, String.class, UUID.class, List.class, JsonNode.class, Pageable.class);
            return (T) method.invoke(queryService, dataSources.getDataSource("10.5.121.117"), configName, userId, userRoles, requestData, pageable);
        } catch (Exception e) {
            e.printStackTrace();
            String msg = String.format("Ошибка выполнения метода получения данных. Current node id: [%s], type: [%s]", flow.getId(), flow.getType());
            log.error(msg);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
        }
    }

    /** ===================== Utilities.List ====================== */
    private int stringListLength(FlowNodeModel flow) {
        return ((List<String>) findValueByPortName(flow, "List", new LinkedList<String>())).size();
    }
    private int jsonListLength(FlowNodeModel flow) {
        return ((List<ObjectNode>) findValueByPortName(flow, "List", new LinkedList<ObjectNode>())).size();
    }

    /** ===================== Utilities.Auth ====================== */
    private UUID authGetUserId(FlowNodeModel flow) {
        return Auth.getUserId(findValueByPortName(flow, "Headers", new HashMap<String, String>()));
    }
    private List<String> authGetListUserRoles(FlowNodeModel flow) {
        return Auth.getListUserRoles(findValueByPortName(flow, "Headers", new HashMap<String, String>()));
    }
}
