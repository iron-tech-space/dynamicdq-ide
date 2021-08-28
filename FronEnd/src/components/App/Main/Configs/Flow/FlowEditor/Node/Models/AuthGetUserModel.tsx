import {BaseNodeModel} from "../BaseNodeModel";
import {DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {FlowPortModel} from "../../Port/FlowPortModel";
import {PortWrapper} from "../../Port/FlowPortWidget";
import * as React from "react";
import {PortsProps} from "../FlowNodeWidget";

export class AuthGetUserIdModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'headers', in: true, name: 'Headers', label: 'Headers', maximumLinks: 1}),
            new FlowPortModel({type: 'uuid', in: false, name: 'UserId', label: 'User id [uuid]'}),
        ]);
    }

    getInPortsRender = AuthGetUserIdPortsIn;
    getOutPortsRender = AuthGetUserIdPortsOut;
}

export class AuthGetListUserRolesModel extends BaseNodeModel {
    constructor(options: DefaultNodeModelOptions) {
        super(options, [
            new FlowPortModel({type: 'headers', in: true, name: 'Headers', label: 'Headers', maximumLinks: 1}),
            new FlowPortModel({type: 'stringList', in: false, name: 'UserRoles', label: 'User roles [List<String>]'}),
        ]);
    }

    getInPortsRender = AuthGetUserIdPortsIn;
    getOutPortsRender = AuthGetListUserRolesPortsOut;
}

const AuthGetUserIdPortsIn = ({engine, node} : PortsProps) =>
    <PortWrapper port={node.getPort('Headers')} engine={engine} />

const AuthGetUserIdPortsOut = ({engine, node} : PortsProps) =>
    <PortWrapper port={node.getPort('UserId')} engine={engine} />

const AuthGetListUserRolesPortsOut = ({engine, node} : PortsProps) =>
    <PortWrapper port={node.getPort('UserRoles')} engine={engine} />