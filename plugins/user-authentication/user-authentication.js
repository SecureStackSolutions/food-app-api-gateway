'use strict';

const axios = require('axios');

class UserAuthentication {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            console.log(await kong.request.getHeaders());
            const authenticationToken = await kong.request.getHeader(
                'authentication-token'
            );

            const response = await axios.get(
                `http://application-gateway:8000/authenticate/authenticate`,
                {
                    headers: {
                        'authentication-token': authenticationToken,
                        'kong-key-auth': 'mykey',
                    },
                }
            );

            const authenticationTokenPayload =
                response.data.extras.authenticationTokenPayload;

            await kong.service.request.setBody({
                ...(await kong.request.getBody()),
                _extras: { authenticationTokenPayload },
            });

            // await kong.service.request.setHeader(
            //     'authentication-token-payload',
            //     JSON.stringify(authenticationTokenPayload)
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
