import React, {useState} from 'react';
import SplitPane from 'react-split-pane';
import {Layout, Space} from 'antd';
import axios from "axios";
import logo from "../../imgs/logo.png";
import {DatabaseFilled, FilterFilled} from "@ant-design/icons";
import Query from "./Main/Configs/Query/Query";
import {FlowIcon, JiraIcon, LogOutIcon, QueryIcon, SaveIcon} from "../../imgs/icons";
import SaveForm from "./Main/Configs/Save/SaveForm";
import Flow from "./Main/Configs/Flow/Flow";
import {uuid} from "../../utils/baseUtils";
import Main from "./Main/Main";
import LeftSide from "./LeftSide/LeftSide";
import Ssh from "./Main/Ssh/Ssh";
import Jira from "./Main/Jira/Jira";

const SplitPaneProps = {
	minSize: 315,
	maxSize: 800,
	defaultSize: 350,
	blockedSize: 32,
}

const createConfigTab = (data) => ({
	key: data.key,
	data: {...data},
	title: (
		<React.Fragment>
			{NODE_TYPE_ICONS[data.type]}
			{`${data.configName} [${data.dataBase.name}]`}
		</React.Fragment>
	),
	content: (
		<Layout className={'app-page-tab-content'}>
			{data.type === NODE_TYPES.QUERY_CONFIG && <Query data={data}/>}
			{data.type === NODE_TYPES.SAVE_CONFIG && <SaveForm data={data}/>}
			{data.type === NODE_TYPES.FLOW_CONFIG && <Flow data={data}/>}
		</Layout>
	)
})

const createSshTab = (data) => ({
	key: data.key,
	data: {...data},
	title: (
		<React.Fragment>
			{NODE_TYPE_ICONS[data.type]}
			{`SSH [${data.name}]`}
		</React.Fragment>
	),
	content: (
		<Layout className={'app-page-tab-content'}>
			<Ssh data={data}/>
		</Layout>
	)
})

const createJiraTab = (data) => ({
	key: data.key,
	data: {...data},
	title: (
		<React.Fragment>
			{NODE_TYPE_ICONS[data.type]}
			{`${data.name}`}
		</React.Fragment>
	),
	content: (
		<Layout className={'app-page-tab-content'}>
			<Jira data={data}/>
		</Layout>
	)
})

export const NODE_TYPES = {
	// DATABASE: 'database',
	QUERY_CONFIGS: 'query_configs',
	QUERY_CONFIG: 'query_config',
	SAVE_CONFIGS: 'save_configs',
	SAVE_CONFIG: 'save_config',
	FLOW_CONFIGS: 'flow_configs',
	FLOW_CONFIG: 'flow_config',
	SSH_SERVER: 'ssh_server',
	JIRA_FILTER: 'jira_filter'
}

export const NODE_TYPE_ICONS = {
	[NODE_TYPES.QUERY_CONFIGS]: <QueryIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.QUERY_CONFIG]: <QueryIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.SAVE_CONFIGS]: <SaveIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.SAVE_CONFIG]: <SaveIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.FLOW_CONFIGS]: <FlowIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.FLOW_CONFIG]: <FlowIcon style={{margin: '0 4px 0 0'}}/>,
	[NODE_TYPES.SSH_SERVER]: <DatabaseFilled style={{margin: '0 4px 0 0', color: "rgb(0, 129, 189)"}}/>,
	[NODE_TYPES.JIRA_FILTER]: <JiraIcon style={{margin: '0 4px 0 0', color: "rgb(0, 129, 189)"}}/>,
}

export const NODE_TYPE_TABS = {
	[NODE_TYPES.QUERY_CONFIGS]: createConfigTab,
	[NODE_TYPES.QUERY_CONFIG]: createConfigTab,
	[NODE_TYPES.SAVE_CONFIGS]: createConfigTab,
	[NODE_TYPES.SAVE_CONFIG]: createConfigTab,
	[NODE_TYPES.FLOW_CONFIGS]: createConfigTab,
	[NODE_TYPES.FLOW_CONFIG]: createConfigTab,
	[NODE_TYPES.SSH_SERVER]: createSshTab,
	[NODE_TYPES.JIRA_FILTER]: createJiraTab,
}

const flowTab = {
	key: 'flowTab',
	data: {},
	title: (
		<React.Fragment>
			{`Flow []`}
		</React.Fragment>
	),
	content: (
		<Layout className={'app-page-tab-content'}>
			<Flow data={{id: uuid()}}/>
		</Layout>
	)
}

const App = () => {

	/** ===================== Common states ====================== */
	const [splitPaneSize, setSplitPaneSize] = useState(SplitPaneProps.defaultSize)
	// const auth = useSelector((state) => state.auth);

	const changePassword = () => {
		axios.post("/api/users/change-password", {oldPassword: "admin", newPassword: "qwerty"})
			.then(res => console.log("changePassword => ", res))
			.catch(err => console.error("changePassword => ", err))
	}

	/** ===================== Render ====================== */
	return (
		<Layout style={{height: '100%', background: 'white'}}>
			<Layout className={'app'}>
				<Layout.Header className={'app-header'}>
					<img src={logo} alt={"Logo"} className={'app-header-logo'}/>
					<Space size={16}>
						{/*<span>{auth.username}</span>*/}
						<span className={'app-header-version'}>v1.0.14</span>
						<a href={'/logout'} className={'app-header-logout'}>
							<LogOutIcon />
							{/*<LogoutOutlined></LogoutOutlined>*/}
							<span>Logout</span>
						</a>
					</Space>
				</Layout.Header>
				<Layout.Content className={'app-page'}>
					<SplitPane
						// className={'Catalog'}
						split='vertical'
						minSize={SplitPaneProps.minSize}
						maxSize={SplitPaneProps.maxSize}
						size={splitPaneSize}
						defaultSize={SplitPaneProps.defaultSize}
						allowResize={splitPaneSize !== SplitPaneProps.blockedSize}
						onChange={(size) =>  {setSplitPaneSize(size)} }
					>
						<LeftSide SplitPaneProps={SplitPaneProps} splitPaneSize={splitPaneSize} setSplitPaneSize={setSplitPaneSize}/>
						<Layout style={{width: '100%'}}>
							<Main/>
						</Layout>
					</SplitPane>
				</Layout.Content>
			</Layout>
		</Layout>
	);
};

export default App;
