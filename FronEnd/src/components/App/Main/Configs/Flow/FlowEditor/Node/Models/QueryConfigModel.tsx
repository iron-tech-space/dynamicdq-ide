import {BaseNodeModel} from "../BaseNodeModel";
import {FlowPortModel} from "../../Port/FlowPortModel";
import * as React from "react";
import {InputPort, InputVariable, isExistLinks, PortWrapper} from "../../Port/FlowPortWidget";
import {PortsProps} from "../FlowNodeWidget";
import {DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {SetVariableModel} from "./VariableModels";

// flat, hierarchical, count, object, sql, sqlCount, save
// List<ObjectNode>
// List<ObjectNode>
// Long
// ObjectNode
// ObjectNode
// ObjectNode
// Object
// configName, userId, userRoles, filter, pageable


class ConfigModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions, ports: FlowPortModel[] = []) {
        super(options, [
            new FlowPortModel({type: 'exec', in: true, name: 'InExec', hiddenLabel: true}),
            new FlowPortModel({type: 'string', in: true, name: 'ConfigName', label: 'Config name', maximumLinks: 1}),
            new FlowPortModel({type: 'uuid', in: true, name: 'UserId', label: 'User id [uuid]', maximumLinks: 1}),
            new FlowPortModel({type: 'stringList', in: true, name: 'UserRoles', label: 'User roles [List<String>]', maximumLinks: 1}),
            new FlowPortModel({type: 'json', in: true, name: 'Data', label: 'Json data', maximumLinks: 1}),
            ...ports,
        ]);
    }
}

export class QueryConfigModel extends ConfigModel {
    constructor(options: DefaultNodeModelOptions){
        super(options, [
            new FlowPortModel({type: 'int', in: true, name: 'PageNum', label: 'Page number [int]', maximumLinks: 1}),
            new FlowPortModel({type: 'int', in: true, name: 'PageSize', label: 'Page size [int]', maximumLinks: 1}),
            new FlowPortModel({type: 'exec', in: false, name: 'OutExec', hiddenLabel: true, maximumLinks: 1}),
            new FlowPortModel({type: 'jsonList', in: false, name: 'ReturnData'}),
        ])
    }
    getInPortsRender = QueryConfigPortsIn;
    getOutPortsRender = QueryConfigPortsOut;
}

const QueryConfigPortsIn = ({engine, node} : PortsProps) : JSX.Element => (
    <React.Fragment>
        <PortWrapper port={node.getPort('InExec')} engine={engine} />
        <PortWrapper port={node.getPort('ConfigName')} engine={engine}>
            {isExistLinks(node.getPort('ConfigName')) ? undefined : <InputPort port={node.getPort('ConfigName')}/>}
        </PortWrapper>
        <PortWrapper port={node.getPort('UserId')} engine={engine}/>
        <PortWrapper port={node.getPort('UserRoles')} engine={engine}/>
        <PortWrapper port={node.getPort('Data')} engine={engine}/>
        <PortWrapper port={node.getPort('PageNum')} engine={engine}/>
        <PortWrapper port={node.getPort('PageSize')} engine={engine}/>
    </React.Fragment>
)
const QueryConfigPortsOut = ({engine, node} : PortsProps) : JSX.Element => (
    <React.Fragment>
        <PortWrapper port={node.getPort('OutExec')} engine={engine} />
        <PortWrapper port={node.getPort('ReturnData')} engine={engine} />
    </React.Fragment>
)