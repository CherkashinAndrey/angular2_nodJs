const config = {
	google: {
		clientID: '904582236453-geu00jdmdk6anlucig2vdhoq7qto7j3d.apps.googleusercontent.com',
		clientSecret: '3wISCbjVQWhgwriZ2qoLl94k',
		callbackURL: 'http://localhost:8080/login/google'
	},
	secret: 'secret',
	headers: {
        'access-control-allow-headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-expose-headers': 'Authorization'
	},
	tokenExpiresIn: '1d'
}

module.exports = config;