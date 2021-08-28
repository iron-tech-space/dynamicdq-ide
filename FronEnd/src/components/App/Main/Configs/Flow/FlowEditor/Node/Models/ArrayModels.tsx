import {BaseNodeModel} from "../BaseNodeModel";
import {DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {FlowPortModel} from "../../Port/FlowPortModel";
import {PortsProps} from "../FlowNodeWidget";
import {PortWrapper} from "../../Port/FlowPortWidget";
import * as React from "react";

export class StringListLengthModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'stringList', in: true, name: 'List', label: 'List', maximumLinks: 1}),
            new FlowPortModel({type: 'int', in: false, name: 'Length', label: 'Length'}),
        ]);
    }
    getInPortsRender = ListLengthPortsIn;
    getOutPortsRender = ListLengthPortsOut;
}

export class JsonListLengthModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'jsonList', in: true, name: 'List', label: 'List', maximumLinks: 1}),
            new FlowPortModel({type: 'int', in: false, name: 'Length', label: 'Length'}),
        ]);
    }
    getInPortsRender = ListLengthPortsIn;
    getOutPortsRender = ListLengthPortsOut;
}



const ListLengthPortsIn = ({engine, node} : PortsProps) =>
    <PortWrapper port={node.getPort('List')} engine={engine} />

const ListLengthPortsOut = ({engine, node} : PortsProps) =>
    <PortWrapper port={node.getPort('Length')} engine={engine} />
