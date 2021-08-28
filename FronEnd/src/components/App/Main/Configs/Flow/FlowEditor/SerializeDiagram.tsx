import * as React from "react";
import {FlowDiagramModel, VariableModel} from "./Diagram/FlowDiagramModel";
import {ButtonProps} from "antd";

interface LinkModel {
    node: string;
    port: string;
}

interface PortModel {
    id: string;
    in: boolean;
    type: string;
    name: string;
    links: LinkModel[];
    value: any
}

interface NodeModel {
    id: string;
    type: string;
    inPorts: PortModel[];
    outPorts: PortModel[];
    variable?: VariableModel;
}

interface LinkSerializeModel {
    source: string;
    sourcePort: string;
    target: string;
    targetPort: string;
}
interface PortSerializeModel {
    id: string;
    in: boolean;
    type: string;
    name: string;
    value: any;
    links: string[];
}

interface NodeSerializeModel {
    id: string;
    type: string;
    name: string;
    ports: PortSerializeModel[]
}

interface LayerSerializeModel {
    type: string;
    models: any //{ [id: string]: NodeSerializeModel | LinkSerializeModel };
}

interface DiagramSerializeModel {
    layers: LayerSerializeModel[],
    variables: VariableModel[];
}

export const serializeDiagramToBack = (diagram : DiagramSerializeModel) => {
    const linkModels = diagram.layers[0].models//find(layer => layer.type === 'diagram-links');
    const nodesModels = diagram.layers[1].models//.find(layer => layer.type === 'diagram-nodes');
    let resultNodes: NodeModel[] = [];
    Object.keys(nodesModels).forEach(nodeKey => {
        const node = nodesModels[nodeKey];
        const posts = node.ports;
        let resultNode: NodeModel = {id: node.id, type: node.type, inPorts: [], outPorts: []};
        // console.log('SerializeDiagramToBack node', node)
        if(['getVariable', 'setVariable'].includes(node.type)){
            resultNode.variable = node.variable
        }
        posts.forEach((port: PortSerializeModel) => {
            let resultPort: PortModel = {id: port.id, in: port.in, type: port.type, name: port.name, links: [], value: port.value || undefined};
            port.links.forEach(link => {
                // console.log('serializeDiagramToBack link', link)

                if(!port.in){ // Выходной порт
                    resultPort.links.push({
                        node: linkModels[link].target ,
                        port: linkModels[link].targetPort
                    })
                } else { // Входной порт
                    resultPort.links.push({
                        node: linkModels[link].source,
                        port: linkModels[link].sourcePort
                    })
                }
            })
            port.in && resultNode.inPorts.push(resultPort)
            !port.in && resultNode.outPorts.push(resultPort)
            // console.log('serializeDiagramToBack resultPort', resultPort)
        });
        // console.log('serializeDiagramToBack resultNode', resultNode)
        resultNodes.push(resultNode);
    });
    // console.log('serializeDiagramToBack linkLayer', linkModels)
    // console.log('serializeDiagramToBack variables', JSON.stringify(diagram.variables))
    // console.log('serializeDiagramToBack resultNodes', JSON.stringify(resultNodes))
    return {
        variables: diagram.variables,
        flows: resultNodes
    }
    // Object.keys(nodes).forEach(nodeKey => {
    //     const node = nodes[nodeKey];
    //     const posts = node.getPorts()
    //     Object.keys(posts).forEach(portKey => {
    //         const port = posts[portKey];
    //         const links = port.getLinks();
    //     })
    // })
    // console.log('serializeDiagramToBack ', nodes)
}