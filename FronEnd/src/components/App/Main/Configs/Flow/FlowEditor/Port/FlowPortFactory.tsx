import * as React from 'react';
import {AbstractModelFactory} from '@projectstorm/react-canvas-core';
import {DiagramEngine} from "@projectstorm/react-diagrams";
import {FlowPortModel} from "./FlowPortModel";

export class FlowPortFactory extends AbstractModelFactory<FlowPortModel, DiagramEngine> {
    constructor(type: string) {
        super(type);
    }

    generateModel(event: any) : FlowPortModel {
        // console.log('FlowPortFactory generateModel', event)
        return new FlowPortModel({type: this.type, name: 'unknown'});
    }
}
