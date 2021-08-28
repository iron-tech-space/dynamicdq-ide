import * as React from "react";
import {DefaultLinkModel, DefaultNodeModel, DefaultPortModel, NodeModel, PortModel, DefaultNodeModelOptions} from "@projectstorm/react-diagrams";
import {size} from "../../../../../../../utils/baseUtils";
import {FlowPortModel} from "../Port/FlowPortModel";
import {PortsProps} from "./FlowNodeWidget";
import {DeserializeEvent} from "@projectstorm/react-canvas-core";

const InExecPortDidFire = (e: any) : void => {
    // console.log(`[${e.entity.getOptions().name}] InExecPortDidFire`, e)
    const port = e.entity;
    if(port.getOptions().maximumLinks) {
        const linksSize = size(port.links);
        // console.log(`[${e.entity.getOptions().name}] InExecPortDidFire`, Object.values(port.links)[linksSize-1])
        if(linksSize > port.getOptions().maximumLinks) {
            (Object.values(port.links)[linksSize-1] as DefaultLinkModel).remove();
        }
        // else if(linksSize > 0){
        //     const link = Object.values(port.links)[linksSize-1] as DefaultLinkModel
        //     if(link.getSourcePort().getOptions().in && !link.getTargetPort().getOptions().in){
        //         console.log('Change ports', link)
        //         // link.switchPorts();
        //         // const sourcePort = {...link.getSourcePort()}
        //         // const targetPort = {...link.getTargetPort()}
        //         // link.setSourcePort(targetPort as PortModel);
        //         // link.setTargetPort(sourcePort as PortModel)
        //     }
        // }
    }
}

export class BaseNodeModel extends DefaultNodeModel {
    constructor(options: DefaultNodeModelOptions, ports: FlowPortModel[] = []) {
        super(options);
        // console.log('BaseNodeModel', options);
        ports.forEach(port => this.addPort(port));
        Object.values(this.getPorts()).forEach(port => port.registerListener({
            eventDidFire: InExecPortDidFire
        }));
    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        // console.log('Deserialize BaseNodeModel', event.data);

        //deserialize ports
        // event.data.ports.forEach((port: any) => {
        //     let portOb = (event.engine as DiagramEngine).getFactoryForPort(port.type).generateModel(port);
        //     portOb.deserialize({
        //         ...event,
        //         data: port
        //     });
        //     // the links need these
        //     event.registerModel(portOb);
        //     this.addPort(portOb);
        // });
    }


    // @ts-ignore
    getPort(name: string) : FlowPortModel {
        return this.ports[name] as FlowPortModel;
    }

    getInPortsRender = ({engine, node} : PortsProps) : JSX.Element => <React.Fragment/>
    getOutPortsRender = ({engine, node} : PortsProps) : JSX.Element => <React.Fragment/>;
}