import React, {useEffect, useState} from 'react';
import {apiGetReq, catchNotification, genericRequest, requestLoadConfig} from "../../../../apis/network";
import {Table, Layout} from "rt-design";
import {config, configRenders} from "./tasksConfig";
import {Button, Input, Space, Spin} from "antd";
import {ReloadOutlined} from "@ant-design/icons";

const Jira = ({data}: {data: any}) => {

    const [loaded, setLoaded] = useState(false);
    // const [issueTypes, setIssueTypes] = useState([]);
    const [jql, setJql] = useState(data.jql);

    // useEffect(() => {
    //     genericRequest({
    //         headers: {'jiraAuth': data.jiraAuth},
    //         url: "/api/jira/rest/api/2/issuetype",
    //     }).then(res => setIssueTypes(res.data))
    // }, [])

    useEffect(() => {
        if (!loaded)
            setTimeout(() => setLoaded(true), 20);
    }, [loaded])

    const requestLoadConfigHandler = () => {
        return new Promise((resolve) => resolve({data: config}));
    }

    const requestLoadRowsHandler = () => {
        return genericRequest({
            method: 'POST',
            // headers: {'jiraAuth': 'Basic YW50b24uZWxpc2VldjpTaHZhcmM5Ng=='},
            headers: {'jiraAuth': data.jiraAuth},
            url: "/api/jira/rest/api/2/search",
            data: {
                jql: jql
            }
        })
            .then(res => new Promise((resolve) => resolve({...res, data: res.data.issues})))
            .catch(err => new Promise((resolve, reject) => reject(err)))
    }

    const onChangeJql = (e: React.ChangeEvent<HTMLInputElement>) => setJql(e.target.value)

    const onClickReload = () => setLoaded(false);

    if (loaded)
        return (
            <Layout>
                <div style={{display: 'flex', marginBottom: '8px'}}>
                    <Input size={"small"} value={jql} onChange={onChangeJql} onPressEnter={onClickReload} style={{marginRight: '8px'}}/>
                    <Button size={"small"} icon={<ReloadOutlined/>} onClick={onClickReload}>Reload tasks</Button>
                </div>
                <Table
                    fixWidthColumn={true}
                    customColumnProps={configRenders}
                    requestLoadRows={requestLoadRowsHandler}
                    requestLoadConfig={requestLoadConfigHandler}
                />
            </Layout>
        );
    else
        return <Spin/>
};

export default Jira;