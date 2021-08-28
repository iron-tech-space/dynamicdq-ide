import {BaseNodeModel} from "../BaseNodeModel";
import {DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {FlowPortModel} from "../../Port/FlowPortModel";
import * as React from "react";
import {PortWrapper} from "../../Port/FlowPortWidget";
import {PortsProps} from "../FlowNodeWidget";

export class RequestModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'exec', in: false, name: 'OutExec', hiddenLabel: true, maximumLinks: 1}),
            new FlowPortModel({type: 'string', in: false, name: 'FlowName', label: 'Flow name'}),
            new FlowPortModel({type: 'headers', in: false, name: 'Headers', label: 'Headers [Map<String, String>]'}),
            new FlowPortModel({type: 'uuid', in: false, name: 'UserId', label: 'User id [uuid]'}),
            new FlowPortModel({type: 'stringList', in: false, name: 'UserRoles', label: 'User roles [List<String>]'}),
            new FlowPortModel({type: 'json', in: false, name: 'RequestData', label: 'Request data [json]'}),
            new FlowPortModel({type: 'int', in: false, name: 'PageNum', label: 'Page number [int]'}),
            new FlowPortModel({type: 'int', in: false, name: 'PageSize', label: 'Page size [int]'}),
        ]);
    }

    getOutPortsRender = RequestPortsOut;
}

const getTypeFromNodeType = (nodeType?: string) : string => {
    if(nodeType){
        const type = nodeType.slice(8);
        return type.charAt(0).toLowerCase() + type.slice(1)
    } else return 'string'
}

export class ResponseModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'exec', in: true, name: 'InExec', hiddenLabel: true, maximumLinks: 1}),
            new FlowPortModel({type: 'int', in: true, name: 'HttpStatus', label: 'Http status', maximumLinks: 1}),
            new FlowPortModel({type: getTypeFromNodeType(options.type), in: true, name: 'Body', label: 'Body', maximumLinks: 1}),
        ]);
    }
    getInPortsRender = ResponsePortsIn
}


const RequestPortsOut = ({engine, node} : PortsProps) => (
    <React.Fragment>
        <PortWrapper port={node.getPort('OutExec')} engine={engine} />
        <PortWrapper port={node.getPort('FlowName')} engine={engine} />
        <PortWrapper port={node.getPort('Headers')} engine={engine} />
        <PortWrapper port={node.getPort('UserId')} engine={engine} />
        <PortWrapper port={node.getPort('UserRoles')} engine={engine} />
        <PortWrapper port={node.getPort('RequestData')} engine={engine} />
        <PortWrapper port={node.getPort('PageNum')} engine={engine} />
        <PortWrapper port={node.getPort('PageSize')} engine={engine} />
    </React.Fragment>
)

const ResponsePortsIn = ({engine, node} : PortsProps) => (
    <React.Fragment>
        <PortWrapper port={node.getPort('InExec')} engine={engine} />
        <PortWrapper port={node.getPort('HttpStatus')} engine={engine} />
        <PortWrapper port={node.getPort('Body')} engine={engine} />
    </React.Fragment>
)

