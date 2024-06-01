import React, {useEffect, useState} from 'react';
import {Button, Dropdown, Menu, Select, Space, Tooltip} from "antd";
import {DatabaseFilled, ReloadOutlined, ToolOutlined, DeploymentUnitOutlined} from "@ant-design/icons";

export const SelectDataBase = props => {

    const {onChange, databases} = props;

    const onChangeHandler = (value) => {
        onChange(databases[value]);
    }

    return (
        <Select
            size={'small'}
            style={{width: '100%'}}
            bordered={false}
            placeholder={"Выберите базу"}
            onChange={onChangeHandler}
        >
            {databases.map((db, index) => {
                return (
                    <Select.Option key={index} value={index}>
                        <Space>
                            <DatabaseFilled style={{color: "rgb(0, 129, 189)"}}/>
                            <span>{db.name}</span>
                            <span>{db.readOnly ? '[read only]' : ''}</span>
                        </Space>
                    </Select.Option>
                )
            })}
        </Select>
    );
};