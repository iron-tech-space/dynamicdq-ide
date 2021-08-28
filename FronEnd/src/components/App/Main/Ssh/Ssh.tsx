import React, {ChangeEvent, useState} from 'react';
import SplitPane from "react-split-pane";
import {Layout, TextArea, Space} from "rt-design";
import {Row, Col, Select, Button, Input, Modal} from "antd";
import {CodeFilled, ExclamationCircleOutlined} from "@ant-design/icons";
import {ShellCommand} from "../../LeftSide/Ssh";
import {apiPostReq} from "../../../../apis/network";

const Executor = ({commands}: {commands: ShellCommand[]}) => {


    return null;
}

const Ssh = ({data}: {data: any}) => {
    // console.log('ssh => ', data);

    const [cmd, setCmd] = useState<string | undefined>(undefined);

    const onChangeHandler = (value: string) => {
        setCmd(value);
    }
    const onClickExecute = () => {
        Modal.confirm({
            width: 440,
            title: 'Вы действительно хотите выполнить команду?',
            icon: <ExclamationCircleOutlined />,
            content: cmd,
            onOk() {
                console.log('onClickExecute => ', cmd);
                apiPostReq('/execute', {serverName: data.name, cmd: cmd})
                    .then(res => console.log('res => ', res.data))
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
        <SplitPane
            className={'ssh-tab'}
            split='vertical'
            minSize={'30%'}
            maxSize={'70%'}
            defaultSize={'50%'}
        >
            {/*<Executor commands={data.commands}/>*/}
            <Space direction={"vertical"} className={'ssh-tab-left'}>
                <Row gutter={8}>
                    <Col span={12}>
                        <Select
                            size={'small'}
                            style={{ width: '100%' }}
                            placeholder={"Выберите команду"}
                            onChange={onChangeHandler}
                        >
                            {data.commands.map((db: ShellCommand, index: number) => { //marginRight: '8px'
                                return (
                                    <Select.Option key={index} value={db.command}>
                                        <Space>
                                            <CodeFilled style={{color: "rgb(0, 129, 189)"}}/>
                                            <span>{db.name}</span>
                                        </Space>
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Button onClick={onClickExecute} size={'small'} style={{ width: '100%' }}>Выполнить команду</Button>
                    </Col>
                </Row>
                <Input.TextArea
                    value={cmd}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCmd(`${e.target.value}`) }
                    autoSize={{ minRows: 2, maxRows: 10 }}
                />
            </Space>
            <div style={{display: 'flex', width: '100%'}}>
            </div>
        </SplitPane>
    );
};

export default Ssh;