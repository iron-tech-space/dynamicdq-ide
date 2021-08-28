import React, {ReactNode, useState} from 'react';
import {Layout} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {Tabs, Custom, TabPane} from 'rt-design';
import {NODE_TYPE_TABS} from "../App";


interface MainProps {

}

interface TabData {
    key: string;
    type: string;
}

interface Tab {
    key: string;
    data: TabData;
    title: ReactNode,
    content: ReactNode
}

const Main = () => {

    /** ===================== Right side states ====================== */
    const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);
    const [tabs, setTabs] = useState<Tab[]>([]); //flowTab

    /** ===================== Right side handlers ====================== */
    const onClickTabRightPanel = (activeKey: string) => { //() => {
        setActiveTabKey(activeKey);
        // console.log('onClickTabRightPanel =>', activeKey)

    }
    const onClickCloseTabRightPanel = (targetKey: string) => (e: React.MouseEvent<HTMLElement>) => {
        let newActiveKey = activeTabKey;
        const lastIndex = tabs.findIndex((tab, i) => tab.key === targetKey) - 1;
        const filteredTabs = tabs.filter(tab => tab.key !== targetKey)
        if (filteredTabs.length && newActiveKey === targetKey) {
            // console.log('A newActiveKey =>', newActiveKey, lastIndex)
            newActiveKey = lastIndex < 0 ? filteredTabs[0].key : filteredTabs[lastIndex].key;
            // console.log('B newActiveKey =>', newActiveKey, lastIndex)
        }
        setActiveTabKey(newActiveKey);
        setTabs(filteredTabs);
        e.stopPropagation();
        e.preventDefault();
    }

    const onOpenTab = (data: TabData) => {
        const tab = tabs.find(tab => tab.key === data.key)
        if(tab) {
            setActiveTabKey(tab.key);
        } else {
            setActiveTabKey(data.key);
        	setTabs([...tabs, NODE_TYPE_TABS[data.type](data)])
        	// console.log("dddd => ", data.type, NODE_TYPE_TABS[data.type])
        }
    }

    return (
        <React.Fragment>
            <Custom
                render={() => null}
                subscribe={[
                    {
                        name: 'onOpenTab',
                        path: 'rtd.main.tabs.events.onOpenTab',
                        onChange: ({value}: any) => {
                            onOpenTab(value)
                            // console.log('onOpenTab value', value.value)
                        },
                    },
                ]}
            />
            <Tabs
                className={'app-page-tabs app-page-tabs-horizontal'}
                activeKey={activeTabKey}
                size={'small'}
                onTabClick={onClickTabRightPanel}
            >

                {tabs.map((tab) => (
                    <TabPane
                        key={tab.key}
                        tab={
                            <React.Fragment>
                                <span>{tab.title}</span>
                                <CloseOutlined onClick={onClickCloseTabRightPanel(tab.key)}/>
                            </React.Fragment>
                        }
                    >
                        {tab.content}
                    </TabPane>
                ))}
            </Tabs>
        </React.Fragment>
    );
};

export default Main;