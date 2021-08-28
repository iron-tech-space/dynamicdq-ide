import React, {useEffect, useState} from 'react';
import {apiDeleteReq, apiGetReq, apiPostReq, catchNotification} from "../../../../apis/network";
import {
    FolderFilled,
    PlusOutlined,
    EllipsisOutlined,
    ApartmentOutlined,
    CopyOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import {Button, Dropdown, Input, Menu, Modal, notification, Space, Tooltip, Tree, Typography} from "antd";
import { AutoResizer } from "react-base-table";
import {NODE_TYPE_ICONS, NODE_TYPES} from "../../App";
import {uuid} from "../../../../utils/baseUtils";
import {SqlIcon} from "../../../../imgs/icons";

const listConfigsToTree = (list, parentKey, nodeType, dataBase) => {
    let roots = [], map = {}, i, node;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        node.key = `${dataBase.name}/${nodeType}/${node.id}`;
        node.dataBase = dataBase;
        node.url = {configuration: {}, data: {}};
        node.url.configuration.get = `${parentKey}/${node.configName}`;
        node.url.configuration.set = parentKey;
        node.url.data.flat = `/${dataBase.name}/data/flat/${node.configName}`;
        node.url.data.hierarchical = `/${dataBase.name}/data/hierarchical/${node.configName}`;
        node.url.data.sql = `/${dataBase.name}/data/sql/${node.configName}`;
        node.title = node.configName;
        node.type = nodeType;
        node.icon = node.isGroup ? <FolderFilled/> : NODE_TYPE_ICONS[nodeType]; // === NODE_TYPES.QUERY_CONFIG ? <QueryIcon/> : <SaveIcon/>)
        node.isLeaf = !node.isGroup;

        // Если родителя нет - рутовая нода
        if (node.parentId === null) {
            roots.push(node);
        }else {
            list[map[node.parentId]].children.push(node);
        }
    }
    return roots;
}

const findByPrams = (data, key, rowKey, callback) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i][rowKey] === key)
            return callback(data[i], i, data);
        if (data[i].children)
            findByPrams(data[i].children, key, rowKey, callback);
    }
};

const findByKey = (data, key, callback) => findByPrams(data, key, 'key', callback);

const savaPositionRecursively = (url, data, type) => {
    for (let i = 0; i < data.length; i++) {
        if(data[i].type === type){
            data[i].position = i;
            // console.log("savaPositionRecursively => ", data[i].configName, data[i].position)
            apiPostReq(url, data[i])
                .then()
                .catch(err => catchNotification(err))
        }
        if (data[i].children)
            savaPositionRecursively(url, data[i].children, type);
    }
};

const isQueryType = (node) =>
    node.type === NODE_TYPES.QUERY_CONFIGS || node.type === NODE_TYPES.QUERY_CONFIG

const ModalWithInput = ({node, parentNode, nodeNormalize, title, icon, request, onOk, onCancel}) => {
    let newName = node.configName;
    Modal.confirm({
        title: title,
        icon: icon,
        content: <Input defaultValue={node.configName} onChange={e => newName = e.target.value} />,
        okText: 'Сохранить',
        cancelText: 'Отмена',
        onOk() {
            console.log(parentNode);
            if(parentNode.dataBase.readOnly){
                notification.error({
                    message: 'База доступна только на чтение'
                });
            } else {
                const newNode = nodeNormalize({...node, configName: newName});
                request(newNode)
                    .then(res => {
                        notification.success({message: `Save [${newName}]`})
                        onOk(newNode)
                    })
                    .catch(err => catchNotification(err))
            }
        },
        onCancel() {onCancel()}
    })
}

const TreeConfigs = props => {

    const {dataBase, setRightPanelData} = props;

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeData, setTreeData] = useState(undefined);

    const positionUrls = {
        [NODE_TYPES.QUERY_CONFIG]: `/${dataBase.name}/configurations/query/position`,
        [NODE_TYPES.SAVE_CONFIG]: `/${dataBase.name}/configurations/save/position`,
        [NODE_TYPES.FLOW_CONFIG]: `/${dataBase.name}/configurations/flow/position`,
    }

    useEffect(() => {
        loadConfigs().then(r => r);
    }, [dataBase]);

    const loadConfigs = async () => {
        if (dataBase && dataBase.name) {
            const urlQueryConfigs = `/${dataBase.name}/configurations/query`;
            const urlSaveConfigs = `/${dataBase.name}/configurations/save`;
            const urlFlowConfigs = `/${dataBase.name}/configurations/flow`;

            try {
                const queryConfigs = listConfigsToTree(
                    (await apiGetReq(urlQueryConfigs)).data,
                    urlQueryConfigs,
                    NODE_TYPES.QUERY_CONFIG, dataBase);
                const saveConfigs = listConfigsToTree(
                    (await apiGetReq(urlSaveConfigs)).data,
                    urlSaveConfigs,
                    NODE_TYPES.SAVE_CONFIG, dataBase);
                const flowConfigs = listConfigsToTree(
                    (await apiGetReq(urlFlowConfigs)).data,
                    urlFlowConfigs,
                    NODE_TYPES.FLOW_CONFIG, dataBase);

                setTreeData([{
                    id: null,
                    key: uuid(),
                    dataBase: dataBase,
                    url: { configuration: {set: urlQueryConfigs}},
                    type: NODE_TYPES.QUERY_CONFIGS,
                    icon: <FolderFilled/>,
                    configName: 'Конфигурации запросов',
                    isLeaf: false,
                    isGroup: true,
                    children: queryConfigs
                }, {
                    id: null,
                    key: uuid(),
                    dataBase: dataBase,
                    // url: urlSaveConfigs,
                    url: { configuration: {set: urlSaveConfigs}},
                    type: NODE_TYPES.SAVE_CONFIGS,
                    icon: <FolderFilled/>,
                    configName: 'Конфигурации сохранения',
                    isLeaf: false,
                    isGroup: true,
                    children: saveConfigs
                }, {
                    id: null,
                    key: uuid(),
                    dataBase: dataBase,
                    // url: urlFlowConfigs,
                    url: { configuration: {set: urlFlowConfigs}},
                    type: NODE_TYPES.FLOW_CONFIGS,
                    icon: <FolderFilled/>,
                    configName: 'Конфигурации потоков',
                    isLeaf: false,
                    isGroup: true,
                    children: flowConfigs
                }])

            } catch (err) {
                setTreeData([])
                catchNotification(err);
            }
        }
    }

    const getAllowDrop = (dropNode, dragNode) => {
        return dropNode.type === dragNode.type
            || (dropNode.type === NODE_TYPES.QUERY_CONFIGS && dragNode.type === NODE_TYPES.QUERY_CONFIG)
            || (dropNode.type === NODE_TYPES.SAVE_CONFIGS && dragNode.type === NODE_TYPES.SAVE_CONFIG)
            || (dropNode.type === NODE_TYPES.FLOW_CONFIGS && dragNode.type === NODE_TYPES.FLOW_CONFIG);
    }

    const onDrop = info => {
        // console.log(info.node)
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const data = [...treeData];

        // Find dragObject
        const getDragObj = () => {
            let dragObj;
            findByKey(data, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });
            return dragObj;
        }

        if (!getAllowDrop(info.node, info.dragNode)) {
            notification.error({message: 'Невозможно переместить между типами'});
            return;
        }

        if (info.dropToGap) {
            // Найти объект который тащим
            const dragObj = getDragObj();
            findByKey(data, dropKey, (item, index, arr) => {
                // Присвоить родителя
                dragObj.parentId = info.node.parentId;
                if (dropPosition === -1) {
                    // Добавить в место
                    arr.splice(index, 0, dragObj);
                } else {
                    // Добавить в место
                    arr.splice(index + 1, 0, dragObj);
                }
                // Обновить стейт
                setTreeData(data);
                console.log('Добавить в место => ', dragObj)
            });
        } else {
            // Если объект в который кидаем не группа, то выходим
            if (!info.node.isGroup) {
                notification.error({message: 'Невозможно переместить в конфиг'});
                return;
            }
            findByKey(data, dropKey, item => {
                // Найти объект который тащим
                const dragObj = getDragObj();
                // Создать детей
                item.children = item.children || [];
                // Присвоить родителя
                dragObj.parentId = info.node.id || null;
                // Добавить в начало
                item.children.unshift(dragObj);
                // Обновить стейт
                setTreeData(data);
                console.log('Добавить в начало => ', dragObj);
            });
        }

        const url = positionUrls[info.dragNode.type]
        // console.log('Save drop url => ', url);
        savaPositionRecursively(url, data, info.dragNode.type);
    };

    const onExpand = (expandedKeys) => {
        setExpandedKeys(expandedKeys);
    }

    const onSelect = (selectedKeys, {node}) => {
        // console.log("onSelect: ", node);
        !node.isGroup && setRightPanelData({...node});
    }

    const onClickTitleContextMenu = (node) => ({key}) => {
        // console.log('onClickTitleContextMenu', node, key);
        switch (key) {
            case 'addGroup':
                addGroup(node);
                break;
            case 'addConfig':
                addConfig(node);
                break;
            case 'rename':
                renameConfig(node);
                break;
            case 'removeGroup':
                if (node.children && node.children.length > 0) {
                    notification.error({message: "Невозможно удалить папку с конфигами"})
                } else {
                    // notification.success({message: "Удалить папку"})
                    removeConfig(node);
                }
                break;
            case 'copyAs':
                copyConfig(node);
                break;
            case 'remove':
                removeConfig(node);
                break;

        }
    }

    const updateTreeData = (node) => {
        // loadConfigs().then(r => r);
        const _treeData = [...treeData];
        findByKey(_treeData, node.key, (item, index, arr)=> {
            arr[index] = node;
            // arr.splice(index, 1);
            // arr.splice(index, 0, node);
            // console.log("_treeData => ", arr);
            setTreeData(_treeData);
        });
    }

    const addGroup = (parentNode) => {
        ModalWithInput({
            node: {},
            parentNode: parentNode,
            nodeNormalize: (node) => ({
                ...node,
                id: uuid(),
                isGroup: true,
                parentId: parentNode.id,
                position: (parentNode.children && parentNode.children.length) || 0,
                userId: '0be7f31d-3320-43db-91a5-3c44c99329ab',
                loggingQueries: false,
                logic: "{}",
            }),
            title: 'Создание папки',
            icon: <EditOutlined/>,
            request: (newNode) => apiPostReq(parentNode.url.configuration.set, newNode),
            onOk: (newNode) => loadConfigs().then(r => r),
            onCancel: () => {
            }
        })
    }

    const addConfig = (parentNode) => {
        ModalWithInput({
            node: {},
            parentNode: parentNode,
            nodeNormalize: (node) => ({
                ...node,
                id: uuid(),
                isGroup: false,
                parentId: parentNode.id,
                position: (parentNode.children && parentNode.children.length) || 0,
                userId: '0be7f31d-3320-43db-91a5-3c44c99329ab',
                loggingQueries: false,
                logic: "{}",
            }),
            title: 'Создание конфигурации',
            icon: <EditOutlined/>,
            request: (newNode) => apiPostReq(parentNode.url.configuration.set, newNode),
            onOk: (newNode) => loadConfigs().then(r => r),
            onCancel: () => {
            }
        })
    }

    const renameConfig = (node) => {
        ModalWithInput({
            node: node,
            parentNode: node,
            nodeNormalize: (node) => node,
            title: 'Переименование конфигурации',
            icon: <EditOutlined/>,
            request: (newNode) => apiPostReq(node.url.configuration.set, newNode),
            onOk: (newNode) => updateTreeData(newNode),
            onCancel: () => {
            }
        })
    }
    const copyConfig = (node) => {
        ModalWithInput({
            node: node,
            parentNode: node,
            nodeNormalize: (node) => ({...node, id: uuid()}),
            title: 'Дублирование конфигурации',
            icon: <CopyOutlined/>,
            request: (newNode) => apiPostReq(node.url.configuration.set, newNode),
            onOk: (newNode) => loadConfigs().then(r => r),
            onCancel: () => {
            }
        })
    }
    const removeConfig = (node) => {
        ModalWithInput({
            node: node,
            parentNode: node,
            nodeNormalize: (node) => ({...node, id: null}),
            title: 'Удалиние конфигурации',
            icon: <DeleteOutlined/>,
            request: (newNode) => apiDeleteReq(`${node.url.configuration.set}/${node.id}`, newNode),
            onOk: (newNode) => loadConfigs().then(r => r),
            onCancel: () => {
            }
        })
    }

    const TitleContextMenu = (node) => {
        let menuItems = [];
        if(node.isGroup){
            menuItems.push(<Menu.Item key="addGroup"><FolderFilled/>Создать папку</Menu.Item>)
            menuItems.push(<Menu.Item key="addConfig">{NODE_TYPE_ICONS[node.type]}Создать конфиг</Menu.Item>)
            if([NODE_TYPES.QUERY_CONFIG, NODE_TYPES.SAVE_CONFIG, NODE_TYPES.FLOW_CONFIG].includes(node.type)) {
                menuItems.push(<Menu.Item key="rename"><EditOutlined/>Переименовать</Menu.Item>)
                menuItems.push(<Menu.Item key="removeGroup"><DeleteOutlined/>Удалить папку</Menu.Item>)
            }
        } else {
            menuItems.push(<Menu.Item key="rename"><EditOutlined/>Переименовать</Menu.Item>)
            menuItems.push(<Menu.Item key="copyAs"><CopyOutlined/>Дублировать конфиг</Menu.Item>);
            menuItems.push(<Menu.Item key="remove"><DeleteOutlined/>Удалить конфиг</Menu.Item>);
        }
        return (
            <Menu onClick={onClickTitleContextMenu(node)} className={'context-menu'}>
                {menuItems}
            </Menu>
        )
    }

    /** ===================== Renders ====================== */
    const renderTitle = (nodeData) => (
        <Dropdown overlay={TitleContextMenu(nodeData)} trigger={['contextMenu']}>
            <div style={{display: "flex", justifyContent: 'space-between', paddingRight: '8px'}}>
                <Tooltip title={nodeData.description} placement="topLeft" mouseEnterDelay={0.75}>
                    <span style={{width: '100%'}} onClick={() => {!nodeData.isGroup && setRightPanelData({...nodeData});}}>{nodeData.configName}</span>
                </Tooltip>
                {!nodeData.isGroup && nodeData.type === NODE_TYPES.QUERY_CONFIG &&
                    <Space>
                        {/*{nodeData.customSql && <DatabaseOutlined />}*/}
                        {nodeData.customSql && <Tooltip title={'Exist custom SQL'}><SqlIcon/></Tooltip>}
                        {nodeData.hierarchical && <Tooltip title={'Hierarchical'}><ApartmentOutlined/></Tooltip>}
                    </Space>
                }
                {nodeData.isGroup
                    // && (nodeData.type === NODE_TYPES.QUERY_CONFIG
                    // || nodeData.type === NODE_TYPES.SAVE_CONFIG)
                    && <Space>
                        <Tooltip title="Создать конфиг">
                            <Button onClick={() => onClickTitleContextMenu(nodeData)({key: 'addConfig'})} size={'small'} className={'ant-tree-title-btn'} icon={<PlusOutlined/>} type="text"/>
                        </Tooltip>
                        <Dropdown size={'small'} className={'ant-tree-title-btn'} trigger={['click']} overlay={TitleContextMenu(nodeData)}>
                            <Tooltip title="Доп. действия">
                                <Button size={'small'} className={'ant-tree-title-btn'} icon={<EllipsisOutlined />} type="text"/>
                            </Tooltip>
                        </Dropdown>
                    </Space>
                }
            </div>
        </Dropdown>
    )

    const renderTreePlaceholder = (height, width, msg) => ( // style={{color: 'rgba(0,0,0,.45)'}}
        <div style={{ width: width, height: height, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            {Array.isArray(msg)
                ? msg.map((m, i) => <Typography.Title key={i} level={4} type={'secondary'} style={{marginTop: 0}}>{m}</Typography.Title>)
                : <Typography.Title level={4} type={'secondary'} >{msg}</Typography.Title>
            }
        </div>
    )

    const renderTree = (height, width) => {
        if(!treeData)
            return renderTreePlaceholder(height, width, "Выберите базу данных")
        else if(treeData && treeData.length === 0)
            return renderTreePlaceholder(height, width, ["Ошибка загрузки базы данных", "Выберите другую базу данных"])
        else if(treeData && treeData.length > 0) {
            return (
                <div style={{ width: width, height: height, overflow: 'auto'}}>
                    <Tree
                        blockNode
                        showIcon={true}
                        treeData={treeData}
                        draggable={(nodeData) => [NODE_TYPES.QUERY_CONFIG, NODE_TYPES.SAVE_CONFIG, NODE_TYPES.FLOW_CONFIG].includes(nodeData.type)}
                        expandedKeys={expandedKeys}
                        onDrop={onDrop}
                        onExpand={onExpand}
                        // onSelect={onSelect}
                        titleRender={renderTitle}
                    />
                </div>
            )
        }
    }

    return (
        <div style={{height: '100%'}} >
            <AutoResizer>
                {({height, width}) => (
                    renderTree(height, width)
                )}
            </AutoResizer>
        </div>
    );
};

TreeConfigs.propTypes = {

};

export default TreeConfigs;