import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import createEngine from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import {Layout, notification, Space, Tree, Collapse} from "antd";
import {FlowNodeFactory as BranchFactory} from "./FlowEditor/Node/FlowNodeFactory";
import {Point} from "@projectstorm/geometry";
import {FlowDiagramModel, VariableModel} from "./FlowEditor/Diagram/FlowDiagramModel";
import {BranchModel} from "./FlowEditor/Node/Models/BranchModel";
import {uuid} from "../../../../../utils/baseUtils";
import {FolderFilled, SaveOutlined, AppstoreAddOutlined, AppstoreOutlined, PlusOutlined} from "@ant-design/icons";
import {AuthGetUserIdModel, AuthGetListUserRolesModel} from "./FlowEditor/Node/Models/AuthGetUserModel";
import {RequestModel, ResponseModel} from "./FlowEditor/Node/Models/NetworkModel";
import {QueryConfigModel} from "./FlowEditor/Node/Models/QueryConfigModel";
import {JsonListLengthModel, StringListLengthModel} from "./FlowEditor/Node/Models/ArrayModels";
import {serializeDiagramToBack} from "./FlowEditor/SerializeDiagram";
import {Form, FormBody, Button} from "rt-design";
import {apiPostReq, catchNotification, requestLoadData} from "../../../../../apis/network";
import TreeVariables from "./TreeVariables/TreeVariables";
import {GetVariableModel, SetVariableModel} from "./FlowEditor/Node/Models/VariableModels";
import GeneralFields from "./GeneralFields";
import { connect } from "react-redux";

import {
    convertSharedForRolesStringToTable, convertSharedForRolesTableToString,
    convertSharedForUsersStringToTable,
    convertSharedForUsersTableToString,
    SmallModalArrayFields
} from "../Core/ModalArrayFields";
import {FlowPortFactory} from "./FlowEditor/Port/FlowPortFactory";

const NODE_TYPES = {
    REQUEST: ['Request', 'request', RequestModel],
    BRANCH: ['Branch', 'branch', BranchModel],
}

export const DATA_TYPES = [
    'bool',
    // 'byte',
    'int',
    // 'int64',
    'float',
    // 'name',
    'uuid',
    'string',
    'stringList',
    // 'text',
    'headers',
    'json',
    'jsonList',
    'object',
]

export const PORT_TYPES = [
    'exec',
    ...DATA_TYPES
]

const getResponseItems = () => {
    const items = {};
    DATA_TYPES.forEach(dateType => {
        const itemType = `response${dateType.charAt(0).toUpperCase() + dateType.slice(1)}`;
        items[itemType.toUpperCase()] = [`Response [${dateType}]`, itemType, ResponseModel]
    })
    return items;
}

const treeComponents = {
    'Network': {
        REQUEST: ['Request', 'request', RequestModel],
        ...getResponseItems(),
    },
    'Flow control': {
        BRANCH: ['Branch', 'branch', BranchModel],
    },
    'Data': {
        GET_FLAT_DATA: ['Get flat data', 'getFlatData', QueryConfigModel]
    },
    'Utilities': {
        'List': {
            STRING_LIST_LENGTH: ['Get list string length', 'stringListLength', StringListLengthModel],
            JSON_LIST_LENGTH: ['Get list json length', 'jsonListLength', JsonListLengthModel]
        },
        'Auth': {
            GET_USER_ID_FROM_HEADERS: ['Get user id from headers', 'authGetUserId', AuthGetUserIdModel],
            GET_USER_ROLES_FROM_HEADERS: ['Get user id from headers', 'authGetListUserRoles', AuthGetListUserRolesModel]
        }
    }

}

const parseTree = (obj) => {
    return Object.keys(obj).map(keyItem => {
        const item = obj[keyItem]
        if(Array.isArray(item)){
            // console.log(`Title: [${item[0]}] Type: [${item[1]}]`)
            return {
                title: item[0],
                key: uuid(),
                type: item[1],
                model: item[2],
            }
        } else {
            // console.log(`Key item: [${keyItem}]`)
            return {
                title: keyItem,
                key: uuid(),
                icon:  <FolderFilled/>,
                children: parseTree(item)
            }
        }
    })

}

const treeDataNodes = parseTree(treeComponents)

const createNodeFactories = (engine, data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].type && data[i].model)
            engine.getNodeFactories().registerFactory(new BranchFactory({type: data[i].type, model: data[i].model}))
        else if (data[i].children)
            createNodeFactories(engine, data[i].children);
    }
}

const Flow = ({data}) => {
    let selectedVar = undefined;

    // create engine
    const engine = createEngine();
    // Запретить свободные ссылки
    const state = engine.getStateMachine().getCurrentState();
    state.dragNewLink.config.allowLooseLinks = false;

    // Создаем фабрики по каждый тип node
    createNodeFactories(engine, treeDataNodes)
    engine.getNodeFactories().registerFactory(new BranchFactory({type: 'getVariable', model: GetVariableModel}))
    engine.getNodeFactories().registerFactory(new BranchFactory({type: 'setVariable', model: SetVariableModel}))

    PORT_TYPES.forEach(type =>
        engine.getPortFactories().registerFactory(new FlowPortFactory(type))
    )

    // create diagram model
    const diagram = new FlowDiagramModel({name: 'MyFistFlow'});
    diagram.deserializeModel(JSON.parse(data.uiDiagram), engine)
    engine.setModel(diagram);

    // const [treeDataVars, setTreeDataVars] = useState([])

    // useEffect(() => {
    //     updateTreeDataVars();
    // }, [])
    //
    // let treeDataVars;
    // const updateTreeDataVars = () => {
    //     console.log('updateTreeDataVars')
    //     treeDataVars =
    //         Object.keys(diagram.variables).map(key => {
    //             const v = diagram.variables[key];
    //             return {
    //                 key: key,
    //                 title: v.name,
    //             }
    //         })
    // }


    // const onAddRequestMapping = () => {
    //     const nodes = diagram.getNodes();
    //     const existNode = !!nodes.find(node => node.getOptions().type === NODE_TYPES.REQUEST_MAPPING);
    //     if(existNode)
    //         notification.error({message: `REQUEST_MAPPING в данном flow[${diagram.getOptions().name}] уже существует`})
    //     else {
    //         diagram.addNode(new RequestMappingModel({name: diagram.getOptions().name, position: new Point(100, 100)}))
    //         engine.repaintCanvas();
    //     }
    // }
    // const onAddSetVariable = () => {
    //     const variable = diagram.getVariable(selectedVar)
    //     diagram.addNode(new SetVariableModel({variable: variable, position: new Point(100, 100)}))
    //     engine.repaintCanvas();
    // }
    //
    // const onAddGetVariable = () => {
    //     const variable = diagram.getVariable(selectedVar)
    //     diagram.addNode(new GetVariableModel({variable: variable, position: new Point(100, 100)}))
    //     engine.repaintCanvas();
    // }
    //
    // const renderVarSelect = () => {
    //     const variables = diagram.getVariables();
    //     return Object.keys(variables).map(varKey =>
    //         <Select.Option key={varKey} value={varKey}>{variables[varKey].name}</Select.Option>)
    // }

    const onClickSaveDiagram = (values) => {
        if(data.dataBase.readOnly){
            notification.error({
                message: 'База доступна только на чтение'
            });
        } else {
            const saveObject = {
                ...values,
                logic: JSON.stringify(values.logic),
                execDiagram: JSON.stringify(serializeDiagramToBack(diagram.serialize())),
                uiDiagram: JSON.stringify(diagram.serialize())
            };
            apiPostReq(data.url.configuration.set, saveObject)
                .then(res => {
                    // setLocalData(newData)
                    console.log('onClickSaveDiagram', saveObject)
                    notification.success({message: `Save [${data.configName}]`})
                })
                .catch(err => catchNotification(err))
        }

    }

    const onSelectTreeNode = (selectedKeys, {node}) => {
        if(node.model){
            console.log('Create model', node)
            if(node.type === NODE_TYPES.REQUEST && !!diagram.getNodes().find(node => node.getOptions().type === NODE_TYPES.REQUEST)) {
                notification.error({message: `REQUEST_MAPPING в данном flow[${diagram.getOptions().name}] уже существует`})
                return;
            }
            diagram.addNode(new node.model({type: node.type, name: node.title, position: new Point(100, 100)}))
            engine.repaintCanvas();
        } else {
            console.log('Skip create model', node)
        }
    }

    return (
        <Form
            loadInitData={(callBack) => callBack(data)}
            onFinish={onClickSaveDiagram}
        >
            <FormBody noPadding={true}>
                <div className={'flow-editor'}>
                    <div className={'flow-editor-left-side'}>
                        <Space className={'flow-editor-left-side-header'}>
                            {/*<Button size={'small'} onClick={onClickSaveDiagram}>Add variable</Button>*/}
                                <Button htmlType={'submit'} size={'small'} icon={<SaveOutlined/>}/>
                        </Space>
                        <GeneralFields data={data}/>
                        <TreeVariables diagram={diagram} engine={engine}/>
                        <div className={'flow-editor-left-side-divide-title'}>
                            <Space><AppstoreOutlined /><span>Компоненты</span></Space>
                        </div>
                        <div className={'flow-editor-left-side-nodes'}>
                            <Tree
                                blockNode
                                defaultExpandAll={true}
                                showIcon={true}
                                selectedKeys={[]}
                                treeData={treeDataNodes}
                                onSelect={onSelectTreeNode}
                            />
                        </div>
                    </div>
                    {/*    <Button onClick={onAddAuthGetUserId}>Add AuthGetUserId</Button>*/}
                    {/*    <Button onClick={onAddAuthGetListUserRoles}>Add AuthGetListUserRoles</Button>*/}
                    {/*    <Button onClick={onAddBranch}>Add Branch</Button>*/}
                    {/*    <Button onClick={onAddRequestMapping}>Add request mapping</Button>*/}
                    {/*    <Select style={{width: 100}} onChange={(value) => selectedVar = value}>*/}
                    {/*        {renderVarSelect()}*/}
                    {/*    </Select>*/}
                    {/*    <Button onClick={onAddSetVariable}>SetVariable</Button>*/}
                    {/*    <Button onClick={onAddGetVariable}>GetVariable</Button>*/}

                    {/*    <Button onClick={onSaveModal}>Save</Button>*/}
                    <CanvasWidget className={'flow-editor-canvas'} engine={engine}/>
                </div>
            </FormBody>
        </Form>
    );
};

Flow.propTypes = {

};

export default Flow;