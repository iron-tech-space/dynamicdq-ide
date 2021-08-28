import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store';
import * as serviceWorker from './serviceWorker';
import {ConfigProvider} from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import {menu} from './constants/menu';
import {PATHS} from './constants/PATHS';
// import {ReactComponent as LogoBig} from './imgs/logo-big.svg';
import {ReactComponent as LogoSmall} from './imgs/logo-small.svg';
import {ReactComponent as ToggleBtnLeft} from './imgs/toggle-btn-left.svg';
import {ReactComponent as ToggleBtnRight} from './imgs/toggle-btn-right.svg';
import './index.less';
import './init';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Switch>
				{/** Авторизация */}
				<Route path={PATHS.LOGIN.path} component={PATHS.LOGIN.component} />

				{/*<Route exact path={paths.AUTHORIZATION_CODE.path}>*/}
				{/*	<paths.AUTHORIZATION_CODE.component*/}
				{/*		redirectUrl={paths.HOME.path}*/}
				{/*	/>*/}
				{/*</Route>*/}

				{/** Приложение */}
				<Route path={PATHS.PATH_PREFIX.path}>
					<ConfigProvider locale={ru_RU}>
						<Route exact path={PATHS.APP.path} component={PATHS.APP.component}/>
					</ConfigProvider>
				</Route>
			</Switch>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
