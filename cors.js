module.exports = function(options) {
	var options = options || {};
	options.allowWithoutOrigin = options.allowWithoutOrigin || true;
	options.onlyAllowedOrigin = options.onlyAllowedOrigin || true;
	options.allowCredentials = options.allowCredentials || true;
	options.allowedOrigins = options.allowedOrigins || [];
	options.nullOrigin = options.nullOrigin || 'null';

	function isAllowed(origin) {
		return options.allowedOrigins.indexOf(origin) >= 0;
	}

	return function(req, res, next) {
		var origin = req.headers['origin'];
		if (origin && options.nullOrigin !== origin) {
			if (!options.onlyAllowedOrigin || isAllowed(origin))
				res.header('access-control-allow-origin', origin);
		}
		else {
			if (options.allowWithoutOrigin) {
				if (origin)
					res.header('access-control-allow-origin', origin);
				else
					res.header('access-control-allow-origin', '*');
			}
		}

		if (options.allowCredentials)
			res.header('access-controll-allow-credentials', 'true');

		var headers = req.headers['access-control-request-headers'];
		if (headers)
			res.header('access-control-allow-headers', headers);

		var method = req.headers['access-control-request-method'];
		if (method)
			res.headers('access-control-request-methods', method);

		if (req.method === "OPTIONS")
			res.end();
		else
			next();
	}
}

