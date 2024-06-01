import axios from 'axios';
import {notification} from "antd";

const DEFAULT_HEADERS = {
	'Content-type': 'application/json',
};

const instance = axios.create({
	baseURL: '/',
	timeout: 1200000,
	headers: DEFAULT_HEADERS,
});

const catchHandler = (err) => {
	// console.log('catchHandler', err.response)
	if (err.response) {
		// console.log("catchHandler error.response.data => ", err.response);
		if (err.response.status === 401) {
			window.location.href = "/login"
		}
	}
	return Promise.reject(err);
}

export const genericRequest = (options) => {
	return instance({
		...options,
	})
		.then(response => {
			// console.log("genericRequest.response => ", response);
			return response
		})
		.catch(catchHandler);
}

export const apiGetDataBases = () =>
	genericRequest({
		method: 'GET',
		url: '/api/databases'
	})

export const apiGetReq = (url) =>
	genericRequest({
		method: 'GET',
		url: `/api${url}`
	})

export const apiPostReq = (url, data) =>
	genericRequest({
		method: 'POST',
		url: `/api${url}`,
		data: data
	})
export const apiDeleteReq = (url) =>
	genericRequest({
		method: 'DELETE',
		url: `/api${url}`
	})

export const requestLoadConfig = (url) => () =>
	genericRequest({
		method: 'GET',
		url: `/api${url}`,
	})

export const requestLoadData = (url) => ({params, data}) =>
	genericRequest({
		method: 'POST',
		url: `/api${url}`,
		params, data
	})

export const catchNotification = (err) => {
	// console.error(err?.response?.data);
	console.error(err);
	notification.error({
		message: 'Ошибка загрузки данных',
		description: err?.response?.data?.error
	});
}
