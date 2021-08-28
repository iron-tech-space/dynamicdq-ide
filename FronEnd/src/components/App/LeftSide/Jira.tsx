import React, {useEffect, useState} from 'react';
import {apiGetReq, catchNotification, genericRequest} from "../../../apis/network";
import {NODE_TYPES} from "../App";
import {Button, Form} from 'rt-design';
import {Input, Space, Tree} from "antd";
import {CodeFilled, FilterFilled} from "@ant-design/icons";
import {JiraIcon} from "../../../imgs/icons";

interface Credentials {
    username?: string;
    password?: string;
    hash?: string;
}

const Jira = ({setRightPanelData}: {setRightPanelData: (data: any) => void}) => {

    const [credentials, setCredentials] = useState<Credentials>({username: '', password: '', hash: ''});
    const [treeData, setTreeData] = useState([]);

    // useEffect(() => {
    const loadFilters = () => {
        const auth = `Basic ${btoa(credentials.username + ':' + credentials.password)}`;
        genericRequest({
            method: 'GET',
            // headers: {'jiraAuth': 'Basic YW50b24uZWxpc2VldjpTaHZhcmM5Ng=='},
            headers: {'jiraAuth': auth},
            url: `/api/jira/rest/api/2/filter/favourite`
        })
            .then(res => {
                // console.log('JIRA => ', res.data)
                setTreeData(res.data.map((srv: any) => {
                    return {
                        ...srv,
                        type: NODE_TYPES.JIRA_FILTER,
                        title:
                            <Space>
                                <FilterFilled style={{color: "rgb(0, 129, 189)"}}/>
                                <span>{srv.name}</span>
                            </Space>,
                        key: `jiraFilter/${srv.name}/${srv.id}`,
                        isLeaf: true
                    }
                }))
            })
            .catch(catchNotification)
    }
    // }, [])

    // 'username' | 'password'
    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials,
            username: e.target.value,
            hash: `Basic ${btoa(e.target.value + ':' + credentials.password)}`})
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials,
            password: e.target.value,
            hash: `Basic ${btoa(credentials.username + ':' + e.target.value)}`})
    }

    const onLoadFilters = () => {
        loadFilters();
    }

    const onSelect = (selectedKeys: React.Key[], {node}: any) => {
        // console.log("onSelect: ", node);
        setRightPanelData({...node, 'jiraAuth': credentials.hash});
    }
    // bordered={false}
    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '34px', padding: '4px 11px', borderBottom: '2px solid #f0f0f0', }}>
                <JiraIcon style={{margin: '0 8px 0 0', color: "rgb(0, 129, 189)"}}/>JIRA Filters
            </div>
            <Space direction={'vertical'} style={{margin: '8px 16px 8px 16px'}}>
                <Input allowClear size={'small'} type={'text'} placeholder={'Login'}
                       value={credentials.username} onChange={onChangeUsername}/>
                <Input allowClear size={'small'} type={'password'} placeholder={'Password'}
                       value={credentials.password} onChange={onChangePassword}/>
                <Button size={'small'} style={{width: '100%'}} onClick={onLoadFilters}>Load filters</Button>
                {/*<Button size={"small"} type={"text"}/>*/}

            </Space>
            <div style={{ overflow: 'auto'}}>
                <Tree
                    onSelect={onSelect}
                    treeData={treeData}
                />
            </div>
        </div>
    );
};

export default Jira;