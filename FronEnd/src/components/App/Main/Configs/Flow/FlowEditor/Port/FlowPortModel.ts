import {
    DefaultLinkModel,
    DefaultPortModel,
    PortModel,
    DefaultPortModelOptions,
    LinkModel, DefaultLinkModelOptions
} from "@projectstorm/react-diagrams";
import {AbstractModelFactory, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {size} from "../../../../../../../utils/baseUtils";

export interface FlowPortModelOptions extends DefaultPortModelOptions {
    hiddenLabel?: boolean;
}
export class FlowPortModel extends DefaultPortModel {
    private value: any;

    constructor(options: FlowPortModelOptions) {
        super(options);
        // console.log('Constructor FlowPortModel', options);

    }

    deserialize(event: DeserializeEvent<this>) {
        super.deserialize(event);
        // console.log('Deserialize FlowPortModel', event.data);
        this.value = event.data.value;
        (this.options as FlowPortModelOptions).hiddenLabel = event.data.hiddenLabel;
        this.options.maximumLinks = event.data.maximumLinks;
    }

    serialize() {
        return {
            ...super.serialize(),
            value: this.value,
            hiddenLabel: (this.options as FlowPortModelOptions).hiddenLabel,
            maximumLinks: this.options.maximumLinks
        };
    }

    getValue() {
        return this.value
    }
    setValue(value: any){
        this.value = value;
    }

    getOptions() {
        return this.options as FlowPortModelOptions;
    }

    canLinkToPort(port: PortModel): boolean {
        if (port instanceof DefaultPortModel) {
            console.log('canLinkToPort', this.options.in, port.getOptions().in, this.options.type, port.getOptions().type)
            if(!this.options.in && port.getOptions().in && this.options.type === port.getOptions().type) {
            // if (this.options.in !== port.getOptions().in && this.options.type === port.getOptions().type) {
                return true;
            }
        }
        return false;
    }

    createLinkModel(factory?: AbstractModelFactory<LinkModel>) : LinkModel {
        console.log('createLinkModel', this.options);
        if (this.options.maximumLinks) {
            const linksSize = size(this.links);
            if (this.options.maximumLinks === 1) {
                Object.values(this.links).forEach(link => link.remove());
                // const link = new DefaultLinkModel();
                // link.registerListener({eventDidFire: (e) => console.log('Link registerListener', e),})
                // const lPoint = link.getLastPoint();
                // lPoint.registerListener({eventDidFire: (e) => console.log('Point registerListener', e)})
                return new DefaultLinkModel();
            } else if (this.options.maximumLinks <= linksSize) {
                Object.values(this.links)[linksSize - 1].remove();
                return new DefaultLinkModel();
            }
        }
        return new DefaultLinkModel();
    }
}