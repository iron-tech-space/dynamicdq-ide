import React, {useState} from 'react';
import {Tabs} from "antd";
import {CodeFilled, DatabaseFilled, TeamOutlined} from "@ant-design/icons";
import Configs from "./Configs/Configs";
import Ssh from "./Ssh";
import {dispatchToStore} from "../../../utils/redux";
import {useDispatch} from "react-redux";
import Jira from "./Jira";
import {JiraIcon} from "../../../imgs/icons";

interface LeftSideProps {
    SplitPaneProps: any;
    splitPaneSize: number;
    setSplitPaneSize: (arg: number) => void;
}

const LeftSide = ({SplitPaneProps, splitPaneSize, setSplitPaneSize}: LeftSideProps) => {

    const dispatch = useDispatch();
    const [activeTabKey, setActiveTabKey] = useState<string>("1");


    const onClickTabLeftPanel = (activeKey: string) => {
        // console.log('onChangeTab => ', activeKey);
        if(activeTabKey === activeKey){
            setActiveTabKey('0');
            setSplitPaneSize(SplitPaneProps.blockedSize);
        } else {
            setActiveTabKey(activeKey);
            setSplitPaneSize(splitPaneSize === SplitPaneProps.blockedSize ? SplitPaneProps.defaultSize : splitPaneSize);
        }
    }
    const onClickTreeNodeHandler = (data: any) => {
        dispatchToStore({dispatch, path: 'main.tabs.events.onOpenTab', value: data});
    }

    return (
        <Tabs
            className={'app-page-tabs app-page-tabs-vertical'}
            tabPosition={'left'}
            size={'small'}
            defaultActiveKey={activeTabKey}
            activeKey={activeTabKey}
            onChange={onClickTabLeftPanel}
        >
            <Tabs.TabPane tab={<span><DatabaseFilled style={{margin: '0 8px 0 0'}}/>Конфиги</span>} key="1" className={'app-page-tab data-bases'}>
                <Configs setRightPanelData={onClickTreeNodeHandler}/>
            </Tabs.TabPane>
            {/*<Tabs.TabPane tab={<span><CodeFilled style={{margin: '0 8px 0 0'}}/>SSH</span>} key="2" className={'app-page-tab'}>*/}
            {/*    <Ssh setRightPanelData={onClickTreeNodeHandler}/>*/}
            {/*</Tabs.TabPane>*/}
            {/*<Tabs.TabPane tab={<span><JiraIcon style={{margin: '0 8px 0 0'}}/>JIRA</span>} key="3" className={'app-page-tab'}>*/}
            {/*    <Jira setRightPanelData={onClickTreeNodeHandler}/>*/}
            {/*</Tabs.TabPane>*/}
            {/*<Tabs.TabPane tab={<span><TeamOutlined style={{marginTop: '0 8px 0 0'}}/>Пользователи</span>} key="20">*/}
            {/*    Users*/}
            {/*</Tabs.TabPane>*/}
        </Tabs>
    );
};

export default LeftSide;
