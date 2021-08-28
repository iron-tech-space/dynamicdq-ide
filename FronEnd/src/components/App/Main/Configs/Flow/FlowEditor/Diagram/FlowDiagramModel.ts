import {DiagramModel} from "@projectstorm/react-diagrams";
import { DiagramModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface VariableModel {
    id: string;
    name: string;
    type: string;
    value: any;
}

interface FlowDiagramOptions extends DiagramModelOptions{
    name?: string;
    variables?: VariableModel[];
}

export class FlowDiagramModel extends DiagramModel {
    variables: VariableModel[];
    constructor(options: FlowDiagramOptions) {
        super(options);
        console.log('Recreate model');
        this.variables = options?.variables || [];// [ {id: uuid(), type: 'bool', name: 'MyBoolVar', value: false} ]
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        console.log('Deserialize FlowDiagramModel', event.data.variables);
        this.variables = event.data.variables;
    }

    serialize() {
        return {
            ...super.serialize(),
            variables: this.variables
        };
    }
    getOptions() {
        return this.options as FlowDiagramOptions;
    }
    getVariables() {
        return this.variables;
    }
    getVariable(id: string) {
        return this.variables.find(v => v.id === id);
    }
    addVariable(variable: VariableModel) {
        this.variables.push(variable);
    }
    updateVariable(variable: VariableModel) {
        const fi = this.variables.findIndex(v => v.id === variable.id);
        if(fi !== -1)
            this.variables[fi] = variable;

    }
    removeVariableByName(name: string) {
        this.variables = this.variables.filter(v => v.name !== name);
    }
    removeVariableById(id: string) {
        this.variables = this.variables.filter(v => v.id !== id);
    }
}