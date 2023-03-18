'use strict';

const axios = require('axios');

class UserAuthentication {
    ID_TOKEN_KEY = 'id-token';
    KONG_AUTH_KEY = 'kong-key-auth';

    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const idToken = await kong.request.getHeader(this.ID_TOKEN_KEY);

            const response = await axios.get(
                `http://application-gateway:8000/access-control/authenticate`,
                {
                    headers: {
                        ID_TOKEN_KEY: idToken,
                        KONG_AUTH_KEY: 'mykey',
                    },
                }
            );

            const userId = response.data.extras;

            await kong.service.request.setBody({
                ...(await kong.request.getBody()),
                _extras: { userId },
            });

            // await kong.service.request.setHeader(
            //     'authentication-token-payload',
            //     JSON.stringify(idTokenPayload)
            // );
        } catch (err) {
            // if (err.request) {
            //     console.log('REQUEST ERROR', err.request);
            // }
            // if (err.response) {
            //     console.log('RESPONSE ERROR', err.response);
            // }
            // if (axios.isAxiosError(err)) {
            //     console.log('error message: ', err.message);
            // }
            return kong.response.exit(403);
        }
    }
}

module.exports = {
    Plugin: UserAuthentication,
    Schema: [{ message: { type: 'string' } }],
    Version: '0.1.0',
    Priority: 0,
};
