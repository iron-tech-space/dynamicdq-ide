import React, {useEffect, useState} from 'react';
import {FlowDiagramModel, VariableModel} from "../FlowEditor/Diagram/FlowDiagramModel";
import {Dropdown, Space, Tree, Menu, TreeDataNode as AntTreeDataNode} from "antd";
import {Point} from "@projectstorm/geometry";
import {AppstoreAddOutlined, DeleteOutlined, EditOutlined, LogoutOutlined, LoginOutlined} from "@ant-design/icons";
import {AddVarModal} from "./AddVarModal";
import {GetVariableModel, SetVariableModel} from "../FlowEditor/Node/Models/VariableModels";
import {uuid} from "../../../../../../utils/baseUtils";
import {DiagramEngine} from "@projectstorm/react-diagrams";

interface TreeVariablesProps {
    diagram: FlowDiagramModel;
    engine: DiagramEngine;
}

interface TreeDataNode extends AntTreeDataNode{
    variable?: VariableModel;
}

const TreeVariables = ({diagram, engine}: TreeVariablesProps) => {

    const [treeDataVars, setTreeDataVars] = useState<TreeDataNode[]>([])

    useEffect(() => {
        updateTreeDataVars();
    }, [])

    const updateTreeDataVars = () => {
        console.log('TreeVariables updateTreeDataVars')
        setTreeDataVars(
            diagram.variables.map(v => {
                return {
                    key: v.id,
                    title: v.name,
                    variable: v
                }
            })
        )
    }

    const onClickAddVariable = ({type, name}: VariableModel) => {
        diagram.addVariable({id: uuid(), type: type, name: name, value: null})
        updateTreeDataVars();
    }

    const onClickTitleContextMenu = (node: TreeDataNode) => ({key}: {key: string}) => {
        // console.log('click', e);
        switch (key){
            case 'get':
                if(node.variable)
                    diagram.addNode(new GetVariableModel({variable: node.variable, type: 'getVariable', position: new Point(100, 100)}))
                engine.repaintCanvas();
                break;
            case 'set':
                if(node.variable)
                    diagram.addNode(new SetVariableModel({variable: node.variable, type: 'setVariable', position: new Point(100, 100)}))
                engine.repaintCanvas();
            // case 'edit': onAddRow(null); break;
            // case 'remove': onRemoveRow(rowIndex); break;
        }
    }

    const menu = (node: TreeDataNode) => (
        <Menu onClick={onClickTitleContextMenu(node)} className={'context-menu'}>
            <Menu.Item key="get"><LogoutOutlined />Добавить GET блок</Menu.Item>
            <Menu.Item key="set"><LoginOutlined />Добавить SET блок</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="edit"><EditOutlined/>Изменить</Menu.Item>
            <Menu.Item key="remove"><DeleteOutlined/>Удалить</Menu.Item>
        </Menu>
    );

    const renderTitle = (node: TreeDataNode) => (
        <Dropdown overlay={menu(node)} trigger={['click', 'contextMenu']}>
            <div>{node.title}</div>
        </Dropdown>
    )

    return (
        <React.Fragment>
            <div className={'flow-editor-left-side-divide-title'}>
                <Space><AppstoreAddOutlined /><span>Переменные</span></Space>
                <Space><AddVarModal value={undefined} onFinish={onClickAddVariable}/></Space>
            </div>
            <div className={'flow-editor-left-side-vars'}>
                <Tree
                    blockNode
                    defaultExpandAll={true}
                    showIcon={true}
                    selectedKeys={[]}
                    treeData={treeDataVars}
                    titleRender={renderTitle}
                />
            </div>
        </React.Fragment>

    );
};

export default TreeVariables;