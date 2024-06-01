import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {EditableTableItem} from "./Query";
import {Modal, TreeSelect, FormBody} from "rt-design";
import {Col} from "./Query";
import {apiGetReq, catchNotification, requestLoadConfig, requestLoadData} from "../../../../../apis/network";
import {notificationError, uuid} from "../../../../../utils/baseUtils";
import {FolderFilled} from "@ant-design/icons";
import {NODE_TYPE_ICONS} from "../../../App";
import {Space} from "antd";
import {QueryIcon} from "../../../../../imgs/icons";

const listConfigsToTree = (list) => {
    let roots = [], map = {}, i, node;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        node.label = <Space>{node.isGroup ? <FolderFilled/> : <QueryIcon/>}<span>{node.configName}</span></Space>
        node.value = node.configName
        node.isLeaf = !node.isGroup;
        node.selectable = !node.isGroup;

        // Если родителя нет - рутовая нода
        if (node.parentId === null) {
            roots.push(node);
        }else {
            list[map[node.parentId]].children.push(node);
        }
    }
    return roots;
}

const filterTree = (tree, name) => {
    let filtered = [];
    for (let i = 0; i < tree.length; i++) {
        if(tree[i].isGroup){
            // console.log('Group filterTree => ', tree[i].value)
            const children = filterTree(tree[i].children, name)
            children.length > 0 && filtered.push({...tree[i], children})
        } else {
            // console.log('filterTree', tree[i])
            // console.log('Item filterTree => ', tree[i].value)
            if (tree[i].value.indexOf(name) !== -1)
                filtered.push(tree[i]);
        }
    }
    return filtered;
}

const ModalLoadFields = ({span, modalTitle, dataBase}) => {

    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        // apiGetReq(`/${dataBase}/configurations/save/tables`)
        //     .then((res) => setTreeData(res.data))
        //     .catch(err => notificationError(err, 'Ошибка загрузки таблиц'))
        loadTreeData().then(r => r);
    }, []);

    const loadTreeData = async () => {
        const urlTables = `/${dataBase.name}/configurations/save/tables`;
        const urlQueries = `/${dataBase.name}/configurations/query`;
        try {
            const tables = (await apiGetReq(urlTables)).data;
            const queries = listConfigsToTree((await apiGetReq(urlQueries)).data)

            console.log("Tables", tables)
            console.log("Queries", queries)

            setTreeData([
                {
                    value: "Tables",
                    label: <Space><FolderFilled/><span>Таблицы</span></Space>,
                    isLeaf: false,
                    isGroup: true,
                    selectable: false,
                    children: tables.map(table => ({label: <Space><QueryIcon/><span>{table}</span></Space>, value: table}))
                },
                {
                    value: "Queries",
                    label: <Space><FolderFilled/><span>Конфигурации запросов</span></Space>,
                    isLeaf: false,
                    isGroup: true,
                    selectable: false,
                    children: queries //queries.filter(item => !item.isGroup).map(query => ({label: query.configName, value: query.configName}))
                }
            ])

        } catch (err){
            setTreeData([])
            notificationError(err);
        }
    };

    const requestLoadRowsForTreeSelect = ({data: {name}}) => {
        // console.log('requestLoadRowsForTreeSelect => ', filterTree(treeData, name))
        if(name)
            return new Promise((resolve) => resolve({data: filterTree(treeData, name)}));
        else
            return new Promise((resolve) => resolve({data: treeData}));
    }

    const loadInitData = (callBack) => {
        // console.log('loadInitData', _value);
        callBack({})
    };
    return (
        <Col span={span} label={modalTitle}>
            <Modal
                buttonProps={{
                    label: 'Load',
                    type: 'default',
                    style: {width: '100%', backgroundColor: '#dbe7f7'}
                }}
                toolTipProps={{title: modalTitle}}
                // dispatch={{path: `${type}.config.${id}.modals.ModalLoadFields`}}
                modalConfig={{
                    type: 'save',
                    title: modalTitle,
                    width: 600,
                    bodyStyle: {height: 500},
                    form: {
                        name: 'TableList',
                        noPadding: true,
                        loadInitData: loadInitData
                    },
                }}
            >
                <FormBody>
                    <TreeSelect
                        itemProps={{name: 'controlPointId'}}
                        dispatch={{path: 'query.config.modals.ModalLoadFields'}}
                        searchParamName={'name'}
                        requestLoadRows={requestLoadRowsForTreeSelect}
                        optionConverter={(option) => ({
                            ...option
                        })}
                    />
                </FormBody>
                {/*<EditableTableItem name={name} columns={[{title: 'Наименование', dataKey: 'name'}]}/>*/}
            </Modal>
        </Col>

    );
};

ModalLoadFields.propTypes = {
    
};

export default ModalLoadFields;