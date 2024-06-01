const {createProxyMiddleware} = require('http-proxy-middleware');

// const API_URL = 'https://mobinspect.dias-dev.ru';
const API_URL = 'http://10.5.121.117';
// const API_URL = 'http://localhost';
// const LOCAL_API_URL = 'http://192.168.1.65';

const filter = (pathname, req) => {
	return pathname.match('^/api') || req.method === 'POST';
};

module.exports = function (app) {
	app.use(
		'/',
		createProxyMiddleware(filter, {
			target: `${API_URL}:8805`,
			// pathRewrite: {'^/api/dynamicdq': ''},
		})
	);
};
