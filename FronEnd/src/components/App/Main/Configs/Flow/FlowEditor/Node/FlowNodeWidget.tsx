import * as React from 'react';
import {DiagramEngine} from "@projectstorm/react-diagrams";
import {BaseNodeModel} from "./BaseNodeModel";

export interface PortsProps {
    engine: DiagramEngine;
    node: BaseNodeModel //| GetVariableModel | SetVariableModel;
}

const NodePorts = ({engine, node} : PortsProps) => {
    const PortsIn = node.getInPortsRender;
    const PortsOut = node.getOutPortsRender;
    return (
        <React.Fragment>
            <div className="node-ports-in">
                <PortsIn engine={engine} node={node}/>
                {/*{inPorts}*/}
            </div>
            <div className="node-ports-out">
                <PortsOut engine={engine} node={node}/>
                {/*{outPorts}*/}
            </div>
        </React.Fragment>
    )
}

export const FlowNodeWidget = (props : PortsProps) => {
    const {engine, node} = props
    // console.log('FlowNodeWidget', props)
    return (
        <div className={['node-wrapper', 'node-branch', node.isSelected() ? 'node-selected' : undefined].join(' ')}>
            <div className={'node-header'}>{node.getOptions().name}</div>
            <div className={'node-body'} >
                <NodePorts engine={engine} node={node}/>
            </div>
        </div>
    )
}