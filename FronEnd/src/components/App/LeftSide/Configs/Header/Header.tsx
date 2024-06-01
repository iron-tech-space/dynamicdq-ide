import React, {useEffect, useState} from 'react';
import {SelectDataBase} from "./SelectDataBase";
import {apiGetDataBases, apiPostReq, catchNotification} from "../../../../../apis/network";
import {Button, Dropdown, Menu, notification, Select, Space, Tooltip} from "antd";
import {DatabaseFilled, DeploymentUnitOutlined, ReloadOutlined, ToolOutlined} from "@ant-design/icons";
import {StoreProps} from "rt-design/dist/components/core/wrappers";
import moment from 'moment';
import {useDispatch} from "react-redux";
import {dispatchToStore} from "../../../../../utils/redux";
import MigrateModal from "./MigrateModal";
import {notificationError} from "../../../../../utils/baseUtils";

const Header = (props: StoreProps & {onChangeDataBase: (value: any) => void}) => {

    const dispatch = useDispatch();

    const {onChangeDataBase} = props;

    const [databases, setDatabases] = useState<any>([]);
    const [selectedDB, setSelectedDB] = useState({});

    useEffect(() => {
        apiGetDataBases()
            .then(res => setDatabases(res.data))
            .catch(catchNotification)

    }, [])

    const onChangeDataBaseHandler = (value: number) => {
        console.log('onChangeDataBaseHandler', databases, value)
        setSelectedDB(value);
        onChangeDataBase(value);
    }

    const onClickReload = () => {
        onChangeDataBase({...selectedDB});
    }

    const onClickMigrate = () => {
        apiPostReq('/migrate-configs', {dataBaseSource: 'ASSD_DEV_121.73', dataBaseTarget: 'ASSD_2_PROD_121.80_10232', type: 'FULL'})
            .then(res => notification.success({message: `Успешная миграция`}) )
            .catch(err => notificationError(err, 'Ошибка миграции'))
    }

    const onClickToolsMenu = () => {
        // dispatchToStore({dispatch, path: 'leftSide.configs.events.onMigrateConfigs', value: { timestamp: moment() }});
        onClickMigrate()
    }

    const toolsMenu = (
        <Menu onClick={onClickToolsMenu}>
            <Menu.Item key="0">
                <Space><DeploymentUnitOutlined />Migrate configs ASSD_DEV_121.73 to ASSD_2_PROD_121.80_10232</Space>
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{padding: '4px', borderBottom: '2px solid #f0f0f0'}}>
            <div style={{display: 'flex'}}>
                <SelectDataBase databases={databases} onChange={onChangeDataBaseHandler}/>
                <Tooltip title={'Reload configs'}>
                    <Button size={"small"} type={"text"} icon={<ReloadOutlined/>} onClick={onClickReload}/>
                </Tooltip>
                {/*<Dropdown overlay={toolsMenu} trigger={['click']}>*/}
                {/*    <Tooltip title={'Tools'}>*/}
                {/*        <Button size={"small"} type={"text"} icon={<ToolOutlined />} onClick={onClickReload}/>*/}
                {/*    </Tooltip>*/}
                {/*</Dropdown>*/}
                <MigrateModal databases={databases}/>
            </div>
        </div>
    );
};

export default Header;

