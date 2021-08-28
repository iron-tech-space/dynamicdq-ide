import {
	HomeOutlined,
	BugOutlined,
	ControlOutlined,
	MonitorOutlined,
	IssuesCloseOutlined,
	ApiOutlined,
	CodeSandboxOutlined,
	SaveOutlined,
	ReadOutlined,
	DatabaseOutlined,
} from '@ant-design/icons';

import {PATHS} from './PATHS';

export const menu = [
	{
		...PATHS.APP,
		icon: HomeOutlined,
	},
	{
		...PATHS.DEBUG_LIB,
		icon: BugOutlined,
	},
	// {
	// 	...paths.CONFIGURATIONS_PORTAL,
	// 	icon: ApiOutlined, //ControlOutlined,
	// 	children: [
	{...PATHS.CONFIGURATIONS_PORTAL_GET, icon: DatabaseOutlined},
	{...PATHS.CONFIGURATIONS_GET, icon: DatabaseOutlined},

	{...PATHS.CONFIGURATIONS_PORTAL_SAVE, icon: SaveOutlined},
	{...PATHS.DOCUMENTATION, icon: ReadOutlined},
		// ],
	// },
	{
		...PATHS.MONITORING,
		icon: MonitorOutlined,
	},
	{
		...PATHS.TESTING,
		icon: IssuesCloseOutlined,
		children: [PATHS.TESTING_LIST, PATHS.TESTING_LOGS],
	},
	{
		...PATHS.PLAYGROUND,
		icon: CodeSandboxOutlined,
	},
];
