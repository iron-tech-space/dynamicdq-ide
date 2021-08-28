import {
    Custom,
    Modal,
} from "rt-design";
import React from "react";
import {Col, EditableTableItem} from "../Query/Query";

export const convertHierarchyFieldStringToTable = (value) => ({hierarchyField: value && value.length > 0 ? value.split('/').map(f => ({name: f})) : []})
export const convertHierarchyFieldTableToString = (value) => Array.isArray(value.hierarchyField) ? value.hierarchyField.map(f => f.name).join('/') : ""

export const convertSharedForRolesStringToTable = (value) => ({sharedForRoles: value && value.length > 0 ? JSON.parse(value).map(f => ({name: f})) : []})
export const convertSharedForRolesTableToString = (value) => Array.isArray(value.sharedForRoles) ? JSON.stringify(value.sharedForRoles.map(f => f.name)) : null

export const convertSharedForUsersStringToTable = (value) => ({sharedForUsers: value && value.length > 0 ? JSON.parse(value).map(f => ({name: f})) : []})
export const convertSharedForUsersTableToString = (value) => Array.isArray(value.sharedForUsers) ? JSON.stringify(value.sharedForUsers.map(f => f.name)) : null

export const LargeModalArrayFields = (props) => { // 'hierarchyField'
    const {id, span, type, buttonLabel, modalTitle, name, stringToTable, tableToString} = props;
    // const loadInitData = (value) => (callBack) => {
    //     const _value = stringToTable(value)
    //     // console.log('loadInitData', _value);
    //     callBack(_value)
    // };
    // const subscribeOnChange = ({value, setSubscribeProps}) => {
    //     const _value = tableToString(value)
    //     // console.log("subscribe => ", _value);
    //     setSubscribeProps({value: _value});
    // }
    return (
        <Col span={span} label={modalTitle}>
            <SmallModalArrayFields {...props} buttonSize={'middle'}/>
            {/*<Custom*/}
            {/*    itemProps={{name: name}}*/}
            {/*    subscribe={[{*/}
            {/*        name: `${id}.${name}`,*/}
            {/*        path: `rtd.query.config.${id}.modals.${name}`,*/}
            {/*        onChange: subscribeOnChange,*/}
            {/*    }]}*/}
            {/*    render={({value}) => {*/}
            {/*        // console.log('Custom', value);*/}
            {/*        return (*/}
            {/*            <Modal*/}
            {/*                buttonProps={{*/}
            {/*                    label: `Элементов: ${stringToTable(value)[name].length}`,*/}
            {/*                    type: 'default',*/}
            {/*                    style: {width: '100%', backgroundColor: '#dbe7f7'}*/}
            {/*                }}*/}
            {/*                toolTipProps={{title: modalTitle}}*/}
            {/*                dispatch={{path: `query.config.${id}.modals.${name}`}}*/}
            {/*                modalConfig={{*/}
            {/*                    type: 'editOnLocal',*/}
            {/*                    title: modalTitle,*/}
            {/*                    width: 600,*/}
            {/*                    bodyStyle: {height: 500},*/}
            {/*                    form: {*/}
            {/*                        name: 'TableList',*/}
            {/*                        noPadding: true,*/}
            {/*                        loadInitData: loadInitData(value)*/}
            {/*                    },*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <EditableTableItem name={name} columns={[{title: 'Наименование', dataKey: 'name'}]}/>*/}
            {/*            </Modal>*/}
            {/*        )*/}
            {/*    }}*/}
            {/*/>*/}
        </Col>
    )
}

export const SmallModalArrayFields = ({id, type, buttonLabel, buttonSize = 'small', modalTitle, name, stringToTable, tableToString}) => { // 'hierarchyField'

    const loadInitData = (value) => (callBack) => {
        const _value = stringToTable(value)
        // console.log('loadInitData', _value);
        callBack(_value)
    };
    const subscribeOnChange = ({value, setSubscribeProps}) => {
        const _value = tableToString(value)
        // console.log("subscribe => ", _value);
        setSubscribeProps({value: _value});
    }
    return (
        <Custom
            itemProps={{name: name}}
            subscribe={[{
                name: `${id}.${name}`,
                path: `rtd.${type}.config.${id}.modals.${name}`,
                onChange: subscribeOnChange,
            }]}
            render={({value}) => {
                // console.log('Custom', value);
                return (
                    <Modal
                        buttonProps={{
                            label: buttonLabel({length: stringToTable(value)[name].length}),// `Элементов: ${stringToTable(value)[name].length}`,
                            type: 'default',
                            size: buttonSize,
                            style: {width: '100%', backgroundColor: '#dbe7f7'}
                        }}
                        toolTipProps={{title: modalTitle}}
                        dispatch={{path: `${type}.config.${id}.modals.${name}`}}
                        modalConfig={{
                            type: 'save',
                            title: modalTitle,
                            width: 600,
                            bodyStyle: {height: 500},
                            form: {
                                name: 'TableList',
                                noPadding: true,
                                loadInitData: loadInitData(value)
                            },
                        }}
                    >
                        <EditableTableItem name={name} columns={[{title: 'Наименование', dataKey: 'name'}]}/>
                    </Modal>
                )
            }}
        />
    )
}