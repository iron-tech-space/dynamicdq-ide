package com.mobinspect.dynamicdq.configuration.controller.Flow;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
class FlowDiagramModel {
    private List<FlowVariableModel> variables;
    private List<FlowNodeModel> flows;
}
@Getter
@Setter
class FlowVariableModel {
    private String id;
    private String name;
    private String type;
    private Object value;
}

@Getter
@Setter
class FlowNodeModel {
    private String id;
    private String type;
    private String variable;
    private List<FlowPortModel> inPorts;
    private List<FlowPortModel> outPorts;
}

@Getter
@Setter
class FlowPortModel {
    private String id;
    private Boolean in;
    private String type;
    private String name;
    private List<FlowLinkModel> links;
    private Object value;
}

@Getter
@Setter
class FlowLinkModel {
    private String node;
    private String port;
}
