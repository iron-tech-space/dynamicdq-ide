import React, {useState} from 'react';
import {Button, notification, Space} from "antd";
import { SelectDataBase } from "./Header/SelectDataBase";
import TreeConfigs from "./TreeConfigs";
import {apiPostReq} from "../../../../apis/network";
import {notificationError} from "../../../../utils/baseUtils";
import Header from "./Header/Header";
const Configs = props => {

    const { setRightPanelData } = props

    const [dataBase, setDataBase] = useState({name: undefined});

    const onChangeDataBaseHandler = (value) => {
        console.log('onChangeDataBaseHandler', value)
        setDataBase(value);
    }



    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <Header onChangeDataBase={onChangeDataBaseHandler}/>
            {/*<div style={{padding: '4px', borderBottom: '2px solid #f0f0f0'}}>*/}
            {/*    <SelectDataBase onChange={onChangeDataBaseHandler}/>*/}
                {/*<Button onClick={onClickMigrate}>Migrate</Button>*/}
            {/*</div>*/}
            <TreeConfigs setRightPanelData={setRightPanelData} dataBase={dataBase}/>
        </div>
    );
};

export default Configs;