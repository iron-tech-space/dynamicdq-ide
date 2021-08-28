import {Checkbox, Input, InputNumber, Space} from "antd";
import {DiagramEngine, PortModel, PortWidget} from "@projectstorm/react-diagrams";
import * as React from "react";
import {FlowPortModel} from "./FlowPortModel";
import {PortIcon} from "./FlowPortIcons";
import {size} from "../../../../../../../utils/baseUtils";
import {SetVariableModel} from "../Node/Models/VariableModels";

export interface PortWrapperProps{
    port: FlowPortModel;
    engine: DiagramEngine;
    children?: JSX.Element[] | JSX.Element ;
}
interface InputVariablePortsProps {
    node: SetVariableModel
}

export const isExistLinks = (post: FlowPortModel): boolean => {
    return size(post.getLinks()) > 0
}

export const PortWrapper = ({port, engine, children} : PortWrapperProps) => {
    // const flowPort = port as FlowPortModel;
    const PortBody = children ? children : (port.getOptions().hiddenLabel ? null :  port.getOptions().label)
    // console.log('port => ', port);
    return (
        <Space className={'port-wrapper'}>
            {!port.getOptions().in && PortBody}
            <PortWidget port={port as PortModel} engine={engine} >
                <PortIcon port={port}/>
            </PortWidget>
            {port.getOptions().in && PortBody}
        </Space>
    )
}

export const InputVariable = ({node} : InputVariablePortsProps) => {
    if(node.variable.type === 'bool') {
        return <Checkbox defaultChecked={node.variable.value} onChange={({target: {checked}}) => node.variable.value = checked}/>
    } else if(node.variable.type === 'float') {
        return <InputNumber size={'small'} defaultValue={node.variable.value} onChange={(value) => node.variable.value = value}/>
    } else {
        return <Input size={'small'} defaultValue={node.variable.value} onChange={({target: {value}}) => node.variable.value = value}/>
    }
}

export const InputPort = ({port} : {port: FlowPortModel}) => {
    if(port.getOptions().type === 'bool') {
        return <Checkbox defaultChecked={port.getValue()} onChange={({target: {checked}}) => {port.setValue(checked)} }/>
    } else if(port.getOptions().type === 'float') {
        return <InputNumber size={'small'} defaultValue={port.getValue()} onChange={(value) => {port.setValue(value)} }/>
    } else {
        return <Input size={'small'} defaultValue={port.getValue()} onChange={({target: {value}}) => {port.setValue(value)} }/>
    }
}