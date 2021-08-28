import {notification} from 'antd';

export const noop = () => {};

export const size = (object) => Object.keys(object).length
export const fillCls = (port) => size(port.getLinks()) > 0 ? 'fill' : ''

export const flatten = (arrayOfArrays) =>
	arrayOfArrays.reduce(
		(flattened, item) =>
			flattened.concat(Array.isArray(item) ? flatten(item) : [item]),
		[]
	);

export const getTableRowKeys = (data, rowKey) => {
	const rowKeys = data.map((item) => {
		if (item.children && item.children.length) {
			return [item[rowKey], getTableRowKeys(item.children, rowKey)];
		}
		return item[rowKey];
	});
	return [...rowKeys];
};

export const uuid = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
};

export const parseQueryParams = (params) => {
	let result = {};

	params = params.trim().replace(/^[?#&]/, '');
	// ?code=NvSLRq
	for (const param of params.split('&')) {
		let p = param.split('=');
		if (p.length > 1) {
			result[p[0]] = p[1];
		}
	}
	return result;
};

export const notificationError = (error, message) => {
	if (error.response) {
		console.log(error.response.data);
		console.log(error.response.status);
	}

	notification.error({
		message: `[${error.response.status}] ${message}`,
		description: error.response.data.error,
	});
};

export const getParentPath = (currentPath) => {
	const arrayPath = currentPath.split('/');
	return arrayPath.slice(0, arrayPath.length - 1).join('/');
}
