'use strict';

class StripPath {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const fullPath = await kong.request.getPath();
            const transformedPath = `/${fullPath
                .split('/')
                .filter((v) => v != '')
                .slice(1)
                .join('/')}`;
            kong.service.request.setPath(transformedPath);
        } catch (err) {
            return kong.response.exit(403);
        }
    }
}

module.exports = {
    Plugin: StripPath,
    Schema: [{ message: { type: 'string' } }],
    Version: '0.1.0',
    Priority: 0,
};
