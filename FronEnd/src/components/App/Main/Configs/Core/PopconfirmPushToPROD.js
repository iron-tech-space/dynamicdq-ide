import React, {useState} from 'react';
import {Input as AntInput, notification, Popconfirm} from "antd";
import {genericRequest} from "../../../../../apis/network";

const onPushConfig = (configName, token) => (e) => {
    console.log('token', token);
    // await api.bear.custom('migrationConfigs', {data: {app: "MAIN", zone: "PROD", configName: node.name}});
    // /bear/script/sync/migrationConfigs?version=latest
    genericRequest({
        headers: {Authorization: `Bearer ${token}`},
        method: 'POST',
        url: `http://10.5.121.117:8820/bear/script/sync/migrationDynamic?version=latest&configName=${configName}`,
    }).then(() => {
        notification.success({message: `Push to PROD [${configName}]`})
    }).catch((err) => {
        // console.log('onPushConfig', err);
        notification.error({
            message: 'Не смог запушить на PROD',
            description: err?.response?.data?.error || err?.response?.data?.message
        });
    });
    e.stopPropagation()
}

const PopconfirmTitle = ({token, setToken}) => {
    return (
        <AntInput
            size={'small'}
            ref={(input) => { input && input.focus() }}
            value={token}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setToken(e.target.value)}
            placeholder={'Bear token'}/>
    )
}

const PopconfirmPushToProd = ({configName, children}) => {
    const [token, setToken] = useState(undefined);

    return (
        <Popconfirm
            title={<PopconfirmTitle token={token} setToken={setToken}/>}
            onConfirm={onPushConfig(configName, token)}
            onCancel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            okText="Push"
            cancelText="Cancel"
        >
            {children}
        </Popconfirm>
    );
};

export default PopconfirmPushToProd;