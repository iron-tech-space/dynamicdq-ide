import React, {useEffect, useState} from 'react';
import SplitPane, {Size} from 'react-split-pane';
import PreviewBase from "./PreviewBase";
import {Layout, TextArea, Text} from "rt-design";
import {Col, Row, Space} from "antd";

const Sql = ({defaultFilter, requestLoadRows}) => {

    const [data, setData] = useState({});

    useEffect(() => {
        requestLoadRows({data: defaultFilter})
            .then(res => {setData(res.data)})
            .catch(err => console.log(err));
    }, [])

    const getParams = () => {
        let render = [];
        if(!data.params)
            return null;
        const params = JSON.parse(data.params)
        for(const key in params){
            render.push(
                <Row className={'preview-sql-param-row'}>
                    <Col span={8} className={'preview-sql-param-key'}>{key}</Col>
                    <Col span={16} className={'preview-sql-param-value'}>{Array.isArray(params[key]) ? params[key].join(', ') : params[key]}</Col>
                </Row>)
        }
        return render;
    }

    return (
        <Layout className={'preview-sql'}>
            <SplitPane
                // className={'Catalog'} style={{width: '30%'}}
                split='vertical'
                minSize={'30%'}
                maxSize={'70%'}
                defaultSize={'30%'}
            >
                <Space direction={"vertical"} size={0} className={'preview-sql-params'} style={{width: '100%', overflow: 'auto'}}>
                    {getParams()}
                </Space>
                <div style={{display: 'flex', width: '100%'}}>
                    <TextArea value={data.sql}/>
                </div>
            </SplitPane>

            {/*<div style={{display: 'flex', height: '100%'}}>*/}
            {/*   */}
            {/*</div>*/}
        </Layout>
    )
}

export default props => <PreviewBase {...props} type={'SQL'} Component={Sql} />;