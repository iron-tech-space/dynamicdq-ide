import React from 'react';
import App from '../components/App/App';
import Login from "../components/Login/Login";

const pathPrefix = process && process.env && process.env.PUBLIC_URL;

export const PATHS = {
	PATH_PREFIX: {
		title: 'Advanced management',
		path: `${pathPrefix}`,
		// isGroup: true,
		// redirect: `${pathPrefix}`,
	},
	// 404: {
	// 	title: '404',
	// 	path: `/404`,
	// 	isGroup: true,
	// },
	LOGIN: {
		title: 'Вход',
		path: `${pathPrefix}/login`,
		component: Login,
	},
	// AUTHORIZATION_CODE: {
	// 	title: 'Authorization code',
	// 	path: `${pathPrefix}/authorization_code`,
	// 	component: AuthorizationCode,
	// },
	APP: {
		title: 'Главная',
		path: `${pathPrefix}`,
		component: App,
		// roles: ['ROLE_ADMIN', 'ROLE_MOBILE_APP'],
	},
	// DEBUG_LIB: {
	// 	title: 'Отладка библиотеки',
	// 	path: `/debug-lib`,
	// 	component: Debug,
	// 	roles: ['ROLE_ADMIN']
	// },
	//
	// /** КОНФИГУРАЦИИ API */
	// CONFIGURATIONS_PORTAL: {
	// 	title: 'Конфигурации API',
	// 	path: `/configurations`,
	// 	isGroup: true,
	// 	redirect: `/configurations/get`,
	// 	roles: ['ROLE_ADMIN', 'ROLE_MOBILE_APP'],
	// },
	// /** Конфигурации получения (портал) */
	// CONFIGURATIONS_PORTAL_GET: {
	// 	title: 'Получение данных',
	// 	path: `/configurations/get`,
	// 	component: () => <ConfigurationRegistry />, // <ConfigurationRegistry />, // <GetRegistry />
	// 	roles: ['ROLE_ADMIN'],
	// },
	// CONFIGURATIONS_PORTAL_GET_EDIT: {
	// 	title: 'Изменение конфигурации',
	// 	path: `/configurations/get/:id`,
	// 	component: () => <ConfigurationForm />,
	// },
	// CONFIGURATIONS_GET: {
	// 	title: 'Получение данных (Beta)',
	// 	path: `/get-configurations`,
	// 	component: () => <GetRegistry />,
	// 	roles: ['ROLE_ADMIN'],
	// },
	// CONFIGURATIONS_GET_EDIT: {
	// 	title: 'Изменение конфигурации',
	// 	path: `/get-configurations/:id`,
	// 	component: () => <GetForm/> // <ConfigurationForm />,
	// },
	//
	// /** Конфигурации сохранения (портал) */
	// CONFIGURATIONS_PORTAL_SAVE: {
	// 	title: 'Сохранение данных',
	// 	path: `/configurations/save`,
	// 	component: () => <SaveRegistry />,
	// 	roles: ['ROLE_ADMIN'],
	// },
	// CONFIGURATIONS_PORTAL_SAVE_EDIT: {
	// 	title: 'Изменение конфигурации',
	// 	path: `/configurations/save/:id`,
	// 	component: () => <SaveForm />,
	// },
	//
	// DOCUMENTATION: {
	// 	title: 'Документация API',
	// 	path: `/configurations/documentation`,
	// 	component: Documentation,
	// 	roles: ['ROLE_ADMIN', 'ROLE_MOBILE_APP'],
	// },
	// MONITORING: {
	// 	title: 'Мониторинг и логирование',
	// 	path: `/monitoring`,
	// 	component: Monitoring,
	// 	//roles: ['ROLE_ADMIN']
	// },
	// TESTING: {
	// 	title: 'Тестирование АПИ',
	// 	path: `/testing`,
	// 	component: App,
	// 	//roles: ['ROLE_ADMIN']
	// },
	// TESTING_LIST: {
	// 	title: 'Список тестов',
	// 	path: `/testing/tests`,
	// 	component: TestsList,
	// 	//roles: ['ROLE_ADMIN']
	// },
	// TESTING_TEST_EDIT: {
	// 	title: 'Список тестов',
	// 	path: `/testing/tests/:id`,
	// 	component: TestEdit,
	// },
	// TESTING_LOGS: {
	// 	title: 'Логи тестирования',
	// 	path: `/testing/logs`,
	// 	component: TestingApi,
	// 	//roles: ['ROLE_ADMIN']
	// },
	// PLAYGROUND: {
	// 	title: 'Песочница',
	// 	path: `/playground`,
	// 	component: UiForms,
	// 	//roles: ['ROLE_ADMIN']
	// },
};
