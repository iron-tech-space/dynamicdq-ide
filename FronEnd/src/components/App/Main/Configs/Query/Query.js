import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Col as AntCol,
    Row,
    Space,
    Tabs,
    Result,
    Input as AntInput,
    notification, Collapse, Button, Spin, Popconfirm
} from "antd";
import {
    Form,
    FormBody,
    Input as RtInput,
    Checkbox as RtCheckBox,
    Custom,
    Layout,
    TextArea,
} from "rt-design";
import EditableTable, {validateValue} from "../../../../Base/EditableTable/EditableTable";
import {columns} from "./queryFields";
import {
    InsertRowLeftOutlined,
    ConsoleSqlOutlined,
    FileSearchOutlined,
    ApiOutlined,
    ScheduleOutlined,
    DatabaseOutlined, ReloadOutlined, CopyOutlined, RiseOutlined
} from "@ant-design/icons";
import {
    apiPostReq,
    catchNotification, genericRequest, requestLoadConfig,
} from "../../../../../apis/network";
import PreviewBase from "./Tabs/PreviewBase";
import {ColumnIcon, SqlIcon, UsersIcon} from "../../../../../imgs/icons";
import {
    convertHierarchyFieldStringToTable,
    convertHierarchyFieldTableToString,
    convertSharedForRolesStringToTable,
    convertSharedForRolesTableToString,
    convertSharedForUsersStringToTable,
    convertSharedForUsersTableToString,
    LargeModalArrayFields
} from "../Core/ModalArrayFields";
import ModalLoadFields from "./ModalLoadFields";
import PreviewTable from "./Tabs/PreviewTable";
import PreviewSQL from "./Tabs/PreviewSQL";
import {copyTextToClipboard} from "../../../../../utils/clipboardUtils";
import PopconfirmPushToPROD from "../Core/PopconfirmPushToPROD";

const Input = ({span, name, label}) => {
    return <Col span={span} label={label}>
        {/*<AntInput value={configData[name]} onChange={onChange('value')}/>*/}
        <RtInput itemProps={{name: name, normalize: value => validateValue(value) }}/>
    </Col>
}
export const Col = ({children, span, label}) => {
    return (
        <AntCol span={span}>
            <Space direction={"vertical"} size={0} style={{width: '100%'}}>
                <span>{label}</span>
                {children}
            </Space>
        </AntCol>
    )
}

const CheckBoxCol = ({span, children}) => (
    <AntCol span={span} style={{justifyContent: 'flex-end', display: 'flex', flexDirection: 'column'}}>
        {Array.isArray(children)
            ? children.map((child, index) => (<div key={index}>{child}</div>))
            : <div>{children}</div>
        }
    </AntCol>
)

export const EditableTableItem = ({name, columns}) => (
    <Custom
        itemProps={{name: name}}
        render={({onChange, value}) => {
            return (
                <Layout style={{width: '100%'}}>
                    <EditableTable
                        columns={columns}
                        data={value}
                        onChange={onChange}
                    />
                </Layout>
            );
        }}
    />
)

const Query = props => {

    // const {data} = props;

    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState(props.data);
    const [visibleGenInfo, setVisibleGenInfo] = useState([]);

    useEffect(() => {
        if(!loaded){
            requestLoadConfig(data.url.configuration.get)()
                .then(res => {
                    setData({...data, ...res.data})
                    setLoaded(true);
                })
                .catch(catchNotification)
        }
    }, [loaded])

    const onChange = (valuePropName) => (event) => {
        const value = event && event.target && valuePropName in event.target
            ? event.target[valuePropName]
            : event
        console.log("onChange => ", value);
    }

    const onValuesFromChange = (changedValues, allValues) => {
        // console.log('changedValues ', changedValues)
        // console.log('data ', data)
        if (data.dataBase.readOnly) {
            notification.error({
                message: 'База доступна только на чтение'
            });
        } else {
            const newData = {...data, ...allValues};
            apiPostReq(data.url.configuration.set, newData)
                .then(res => {
                    // setLocalData(newData)
                    notification.success({message: `Save [${data.configName}]`})
                })
                .catch(err => catchNotification(err))
        }
    }

    // return (
    //     <EditableTable
    //         // data={value}
    //         data={data.fields}
    //         // onChange={onChange}
    //         onChange={(fields) => {
    //             // const _data = {...configData};
    //             // _data.fields = fields;
    //             // setConfigData(_data)
    //             console.log("onChange fields => ", fields)
    //         }}
    //     />
    // )

    const onChangeCollapsePanel = (key) => {
        // console.log(key);
        // setVisibleGenInfo(key);
    }

    const onClickCollapsePanelExtra = (e) => {
        e.stopPropagation();
        setLoaded(false);
    }

    const CollapsePanelExtra = () => {
        return (
            <Space>
                <PopconfirmPushToPROD configName={data.configName}>
                    <Button size={"small"} icon={<RiseOutlined/>}>Push to PROD</Button>
                </PopconfirmPushToPROD>
                <Button size={"small"} icon={<ReloadOutlined/>} onClick={onClickCollapsePanelExtra}>Reload config</Button>
                {/*<Button size={"small"} icon={<CopyOutlined />} onClick={() => copyTextToClipboard(data.configName)}>Copy name</Button>*/}
            </Space>
        )
    }

    if(loaded)
    return (
        <Form
            layout={'vertical'}
            name={'query-config-from'}
            className={'query-config'}
            loadInitData={(callBack) => callBack(data)}
            onValuesChange={onValuesFromChange}
            onFinish={(values) => console.log('query-config-from', values)}
            dispatch={{path: `query.config.${data.id}.form`}}
        >
            <FormBody noPadding={true}>
                {/*activeKey={visibleGenInfo} onChange={onChangeCollapsePanel}*/}
                <Collapse bordered={false} ghost={true}>
                    <Collapse.Panel header={'Общая информация'} extra={<CollapsePanelExtra/>}
                                    className={'query-config-header'} key="qwerty">
                        <Row gutter={8}>
                            {/*<RtInput itemProps={{name: 'dataBase', hidden: true}}/>*/}
                            <Input span={6} label={'Описание'} name={'description'}/>
                            <Input span={6} label={'Имя таблицы'} name={'tableName'}/>
                            {/*<ModalLoadFields span={3} modalTitle={'Загрузить поля'} dataBase={data.dataBase}/>*/}
                            <LargeModalArrayFields
                                id={data.id}
                                span={3}
                                type={'query'}
                                buttonLabel={({length}) => <span>Fields: {length}</span>}
                                modalTitle={'Скрытые поля'}
                                name={'hierarchyField'}
                                stringToTable={convertHierarchyFieldStringToTable}
                                tableToString={convertHierarchyFieldTableToString}
                            />
                            <LargeModalArrayFields
                                id={data.id}
                                span={3}
                                type={'query'}
                                buttonLabel={({length}) => <span>Users: {length}</span>}
                                modalTitle={'Доступ пользователям'}
                                name={'sharedForUsers'}
                                stringToTable={convertSharedForUsersStringToTable}
                                tableToString={convertSharedForUsersTableToString}
                            />
                            <LargeModalArrayFields
                                id={data.id}
                                span={3}
                                type={'query'}
                                buttonLabel={({length}) => <span>Roles: {length}</span>}
                                modalTitle={'Доступ ролям'}
                                name={'sharedForRoles'}
                                stringToTable={convertSharedForRolesStringToTable}
                                tableToString={convertSharedForRolesTableToString}
                            />
                        </Row>
                        <Row gutter={8} style={{marginTop: 8}}>
                            <Input span={6} label={'Поле с иконкой иерархии'} name={'hierarchyView'}/>
                            <Input span={6} label={'Пользовательские настройки'} name={'userSettings'}/>
                            <CheckBoxCol span={6}>
                                <RtCheckBox itemProps={{name: 'hierarchical', valuePropName: 'checked'}}>
                                    Иерархичная таблица
                                </RtCheckBox>
                                <RtCheckBox itemProps={{name: 'hierarchyLazyLoad', valuePropName: 'checked'}}>
                                    Ленивая загрузка таблицы
                                </RtCheckBox>
                            </CheckBoxCol>
                            <CheckBoxCol span={6}>
                                <RtCheckBox itemProps={{name: 'loggingQueries', valuePropName: 'checked'}}>
                                    Логирование запросов
                                </RtCheckBox>
                            </CheckBoxCol>
                        </Row>
                    </Collapse.Panel>
                </Collapse>
                <Tabs className={'app-page-tabs app-page-tabs-horizontal'} style={{marginTop: 8}}>
                    <Tabs.TabPane key="1" tab={<span><ColumnIcon style={{margin: '0 4px 0 0'}}/>Поля</span>}>
                        <EditableTableItem name={'fields'} columns={columns}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="2" tab={<span><SqlIcon style={{margin: '0 4px 0 0'}}/>Custom SQL</span>}>
                        {/*<Result title="Раздел [Custom SQL] в разработке" style={{margin: 'auto'}}/>*/}
                        <TextArea itemProps={{name: 'customSql', normalize: value => value}}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="4"
                                  tab={<span><FileSearchOutlined style={{margin: '0 4px 0 0'}}/>Preview table</span>}>
                        {/*<Result title="Раздел [PreView] в разработке" style={{margin: 'auto'}}/>*/}
                        <PreviewTable data={data}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="3"
                                  tab={<span><FileSearchOutlined style={{margin: '0 4px 0 0'}}/>Preview SQL</span>}>
                        {/*<Result title="Раздел [Preview SQL] в разработке" style={{margin: 'auto'}}/>*/}
                        <PreviewSQL data={data}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="5" tab={<span><ApiOutlined style={{margin: '0 4px 0 0'}}/>Test Request</span>}>
                        <Result title="Раздел [Test Request] в разработке" style={{margin: 'auto'}}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="6"
                                  tab={<span><ScheduleOutlined style={{margin: '0 4px 0 0'}}/>Auto tests</span>}>
                        <Result title="Раздел [Auto tests] в разработке" style={{margin: 'auto'}}/>
                    </Tabs.TabPane>
                </Tabs>
            </FormBody>
        </Form>
    )
    else
        return <Spin/>
};

// customSql: null

Query.propTypes = {};

export default Query;