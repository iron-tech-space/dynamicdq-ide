import {Modal, FormBody, Input, Select} from "rt-design";
import {PlusOutlined} from "@ant-design/icons";
import {requestLoadData} from "../../../../../../apis/network";
import React from "react";
import {DATA_TYPES} from "../Flow";

export const AddVarModal = ({value, onFinish}) => (
    <Modal
        toolTipProps={{ title: 'Создать переменную' }}
        buttonProps={{ type: 'text', icon: <PlusOutlined/>, size: 'small'}}
        modalConfig={{
            type: 'save',
            title: (value ? 'Изменение' : 'Создание') +  ' переменной',
            onFinish: (values) => onFinish(values),
            form: {
                name: 'AddVariable',
                labelCol: {span: 8},
                wrapperCol: {span: 16},
                noPadding: false,
                loadInitData: (callBack, row) => {
                    // console.log('loadInitData', value, DATA_TYPES);
                    // callBack({...value, routeSelect: 'fc0222bd-ff28-41dd-9f1c-8afbce01f043' })
                    callBack(value)
                },
            },
        }}
    >
        <FormBody>
            <Input itemProps={{label: 'Наименование', name: 'name', className: 'mb-8'}} />
            <Select
                itemProps={{label: 'Тип', name: 'type', className: 'mb-0'}}
                optionConverter={(option) => option}
                options={DATA_TYPES.map(type => ({label: type, value: type}))}
            />
            {/*<Select*/}
            {/*    itemProps={{name: 'routeSelect'}}*/}
            {/*    mode={'single'}*/}
            {/*    infinityMode={true}*/}
            {/*    requestLoadRows={requestDataConfig('/MI_121.117(main)/data/flat/routes')}*/}
            {/*    optionConverter={(option) => ({ label: option.name, value: option.id, })}*/}
            {/*    pageSize={10}*/}
            {/*/>*/}
        </FormBody>
    </Modal>
)