import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { FlowNodeWidget } from './FlowNodeWidget';
import {DefaultNodeFactory, DiagramEngine} from "@projectstorm/react-diagrams";
import {BaseNodeModel} from "./BaseNodeModel";

interface NodeFactoryOptions {
    type: string;
    model: typeof BaseNodeModel
}

export class FlowNodeFactory extends AbstractReactFactory<BaseNodeModel, DiagramEngine> {
    model: typeof BaseNodeModel;
    constructor(options: NodeFactoryOptions) {
        // console.log('FlowNodeFactory', options)
        super(options.type);
        this.model = options.model
    }

    generateReactWidget(event: any): JSX.Element {
        // console.log('generateReactWidget', event)
        return <FlowNodeWidget engine={this.engine} node={event.model}/>;
    }

    generateModel(event: any) : BaseNodeModel {
        // console.log('generateModel', event.initialConfig)
        return new this.model(event.initialConfig);
    }
}
