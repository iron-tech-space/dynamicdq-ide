import {BaseNodeModel} from "../BaseNodeModel";
import {FlowPortModel} from "../../Port/FlowPortModel";
import * as React from "react";
import {PortWrapper} from "../../Port/FlowPortWidget";
import {PortsProps} from "../FlowNodeWidget";

export class BranchModel extends BaseNodeModel {
    constructor(options = {}) {
        super(options, [
            new FlowPortModel({type: 'exec', in: true, name: 'InExec', hiddenLabel: true}),
            new FlowPortModel({type: 'bool', in: true, name: 'Condition', maximumLinks: 1}),
            new FlowPortModel({type: 'exec', in: false, name: 'TrueExec', label: 'True', maximumLinks: 1}),
            new FlowPortModel({type: 'exec', in: false, name: 'FalseExec', label: 'False', maximumLinks: 1})
        ]);
    }

    getInPortsRender = BranchPortsIn;
    getOutPortsRender = BranchPortsOut;
}

const BranchPortsIn = ({engine, node} : PortsProps) : JSX.Element => (
    <React.Fragment>
        <PortWrapper port={node.getPort('InExec')} engine={engine} />
        <PortWrapper port={node.getPort('Condition')} engine={engine}/>
    </React.Fragment>
)
const BranchPortsOut = ({engine, node} : PortsProps) : JSX.Element => (
    <React.Fragment>
        <PortWrapper port={node.getPort('TrueExec')} engine={engine} />
        <PortWrapper port={node.getPort('FalseExec')} engine={engine} />
    </React.Fragment>
)