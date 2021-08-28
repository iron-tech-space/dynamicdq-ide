import React, {useState} from 'react';
import {Button, Space, Tree} from "antd";
import {Input, Checkbox} from "rt-design";
import {FormOutlined, EyeOutlined, EyeInvisibleOutlined, PlusOutlined} from "@ant-design/icons";
import {
    convertSharedForRolesStringToTable,
    convertSharedForRolesTableToString,
    convertSharedForUsersStringToTable,
    convertSharedForUsersTableToString,
    SmallModalArrayFields
} from "../Core/ModalArrayFields";

interface SmallModalProps {
    id: string;
    span: string;
    label: string;
    name: string;
    stringToTable: (value: string) => string[];
    tableToString: (value: any) => string;
}

const GeneralFields = ({data}: {data: { id: string; }}) => {

    const [visibleFields, setVisibleFields] = useState<boolean>(false)

    const toggleVisibleFields = () => setVisibleFields((prevState => !prevState))

    //label={'Доступ ролям'}
    return (
        <React.Fragment>
            <div className={'flow-editor-left-side-divide-title'}>
                <Space><FormOutlined /><span>Поля конфига</span></Space>
                <Button type={'text'} icon={visibleFields ? <EyeOutlined /> : <EyeInvisibleOutlined />} size={'small'} onClick={toggleVisibleFields}/>
                {/*<Space onClick={toggleVisibleFields}>{visibleFields ? <EyeOutlined /> : <EyeInvisibleOutlined />}</Space>*/}
            </div>
            <Space direction={"vertical"} className={'flow-editor-left-side-fields'} style={{display: visibleFields ? 'flex' : 'none'}}>
                <Input itemProps={{name: 'description'}} size={'small'}/>
                {/*<Input itemProps={}/>*/}
                <Space>
                    <SmallModalArrayFields
                        id={data.id}
                        type={'flow'}
                        // buttonLabel={({length}: {length: any}) => <Space><UsersIcon/><span>({length})</span></Space> }
                        buttonLabel={({length}: { length: any }) => <span>Users: {length}</span>}
                        modalTitle={'Доступ пользователям'}
                        name={'sharedForUsers'}
                        stringToTable={convertSharedForUsersStringToTable}
                        tableToString={convertSharedForUsersTableToString}
                    />
                    <SmallModalArrayFields
                        id={data.id}
                        type={'flow'}
                        buttonLabel={({length}: { length: any }) => <span>Roles: {length}</span>}
                        modalTitle={'Доступ ролям'}
                        name={'sharedForRoles'}
                        stringToTable={convertSharedForRolesStringToTable}
                        tableToString={convertSharedForRolesTableToString}
                    />
                    <Checkbox itemProps={{name: 'loggingQueries', valuePropName: 'checked'}}>Log flow</Checkbox>
                </Space>
            </Space>
        </React.Fragment>
    );
};

export default GeneralFields;