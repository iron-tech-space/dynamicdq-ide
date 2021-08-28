import * as React from "react";
import {BaseNodeModel} from "../BaseNodeModel";
import {VariableModel} from "../../Diagram/FlowDiagramModel";
import {DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {FlowPortModel} from "../../Port/FlowPortModel";
import {PortsProps} from "../FlowNodeWidget";
import {InputVariable, isExistLinks, PortWrapper} from "../../Port/FlowPortWidget";

interface VariableModelOptions extends DefaultNodeModelOptions{
    variable: VariableModel;
}

export class GetVariableModel extends BaseNodeModel {
    public variable: VariableModel;
    constructor({variable, ...options} : VariableModelOptions) {
        super({name: `Get [${variable.name}]`, ...options}, [
            new FlowPortModel({type: variable.type, in: false, name: 'GetData'})
        ]);
        this.variable = variable;
    }
    getOutPortsRender = GetVariablePortsOut;
    serialize(): any {
        return {
            ...super.serialize(),
            variable: this.variable.id
        };
    }
}

export class SetVariableModel extends BaseNodeModel {
    variable: VariableModel;
    constructor({variable, ...options}: VariableModelOptions) {
        super({name: `Set [${variable.name}]`, ...options}, [
            new FlowPortModel({type: 'exec', in: true, name: 'InExec', hiddenLabel: true}),
            new FlowPortModel({type: variable.type, in: true, name: 'SetData', hiddenLabel: true, maximumLinks: 1}),
            new FlowPortModel({type: 'exec', in: false, name: 'OutExec', hiddenLabel: true, maximumLinks: 1}),
        ]);
        this.variable = variable;
    }
    getInPortsRender = SetVariablePortsIn
    getOutPortsRender = SetVariablePortsOut;
    serialize(): any {
        return {
            ...super.serialize(),
            variable: this.variable.id
        };
    }
}

const GetVariablePortsOut = ({engine, node} : PortsProps) => (
    <React.Fragment>
        <PortWrapper port={node.getPort('GetData')} engine={engine}/>
    </React.Fragment>
)

const SetVariablePortsIn = ({engine, node} : PortsProps) => (
    <React.Fragment>
        <PortWrapper port={node.getPort('InExec')} engine={engine} />
        <PortWrapper port={node.getPort('SetData')} engine={engine} >
            {isExistLinks(node.getPort('SetData')) ? undefined : <InputVariable node={(node as SetVariableModel)}/>}
        </PortWrapper>
    </React.Fragment>
)
const SetVariablePortsOut = ({engine, node} : PortsProps) => (
    <React.Fragment>
        <PortWrapper port={node.getPort('OutExec')} engine={engine} />
    </React.Fragment>
)
