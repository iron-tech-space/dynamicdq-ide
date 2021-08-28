import * as React from "react";
import {fillCls, size} from "../../../../../../../utils/baseUtils";
import {FlowPortModel} from "./FlowPortModel";

export interface PortIconProps{
    port: FlowPortModel;
}

export const PortIcon = ({port} : PortIconProps) => {
    const portType = port.getOptions().type;
    switch (portType){
        case 'exec': return <ExecPort port={port}/>;
        case 'bool': return <VarPort port={port}/>
        case 'byte': return <VarPort port={port}/>
        case 'int': return <VarPort port={port}/>
        case 'int64': return <VarPort port={port}/>
        case 'float': return <VarPort port={port}/>
        case 'name': return <VarPort port={port}/>
        case 'string': return <VarPort port={port}/>
        case 'stringList': return <ListPort port={port}/>
        case 'text': return <VarPort port={port}/>
        case 'headers': return <VarPort port={port}/>
        case 'json': return <VarPort port={port}/>
        case 'jsonList': return <ListPort port={port}/>
        case 'object': return <VarPort port={port}/>
        default: return <VarPort port={port}/>
    }
}

export const ExecPort = ({port} : PortIconProps) => (
    <div className={`port-exec ${fillCls(port)}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" stroke={'currentColor'} xmlns="http://www.w3.org/2000/svg">
            <path d="M1 15V1H9L14.5 8L9 15H1Z" strokeWidth="2"/>
        </svg>
    </div>
)

export const VarPort = ({port} : PortIconProps) => (
    <div className={`port-var ${port.getOptions().type} ${fillCls(port)}`}>
        <svg width="18" height="16" viewBox="0 0 18 16" stroke={'currentColor'} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 8L14.5 6.5V9.5L16.5 8Z" />
            <path d="M7 13C9.76142 13 12 10.7614 12 8C12 5.23858 9.76142 3 7 3C4.23858 3 2 5.23858 2 8C2 10.7614 4.23858 13 7 13Z" strokeWidth="2"/>
        </svg>
    </div>
)

const ListPort = ({port} : PortIconProps) => (
    <div className={`port-var ${port.getOptions().type} ${fillCls(port)}`}>
        <svg width="16" height="16" viewBox="0 0 16 16" stroke={'currentColor'} fill={'currentColor'} xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5H4.5V4.5H1.5V1.5ZM6.5 1.5H9.5V4.5H6.5V1.5ZM11.5 1.5H14.5V4.5H11.5V1.5ZM1.5 6.5H4.5V9.5H1.5V6.5ZM11.5 6.5H14.5V9.5H11.5V6.5ZM1.5 11.5H4.5V14.5H1.5V11.5ZM6.5 11.5H9.5V14.5H6.5V11.5ZM11.5 11.5H14.5V14.5H11.5V11.5Z" strokeLinecap="round" strokeLinejoin="round"/>
            {size(port.getLinks()) > 0 ? <path d="M6.5 6.5H9.5V9.5H6.5V6.5Z" strokeLinecap="round" strokeLinejoin="round"/> : null}
        </svg>
    </div>

)