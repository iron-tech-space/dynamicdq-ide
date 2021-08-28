import React, {useEffect, useState} from 'react';
import {apiGetDataBases, apiGetReq, catchNotification} from "../../../apis/network";
import {Space, Tree} from "antd";
import {CodeFilled, DatabaseFilled} from "@ant-design/icons";
import {NODE_TYPES} from "../App";

export interface ShellCommand {
    name: string;
    command: string;
}

export interface ShellServer {
    name: string;
    ip: string;
    port: string;
    username: string;
    password: string;
    readOnly: boolean;
    position: number;
    commands: ShellCommand[];
}


const Ssh = ({setRightPanelData}: {setRightPanelData: (data: any) => void}) => {

    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        apiGetReq("/servers")
            .then(res => {
                setTreeData(res.data.map((srv: ShellServer) => {
                    return {
                        ...srv,
                        type: NODE_TYPES.SSH_SERVER,
                        title:
                            <Space>
                                <DatabaseFilled style={{color: "rgb(0, 129, 189)"}}/>
                                <span>{srv.name}</span>
                            </Space>,
                        key: `${srv.name}/server/${srv.ip}`,
                        isLeaf: true
                    }
                }))
                // setServers(res.data)
            })
            .catch(catchNotification)
    }, [])

    const onSelect = (selectedKeys: React.Key[], {node}: any) => {
        // console.log("onSelect: ", node);
        setRightPanelData({...node});
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '34px', padding: '4px 11px', borderBottom: '2px solid #f0f0f0', }}>
                <CodeFilled style={{margin: '0 8px 0 0', color: "rgb(0, 129, 189)"}}/>SSH Сервера
            </div>
            <Tree
                onSelect={onSelect}
                treeData={treeData}
            />
        </div>
    );
};

export default Ssh;