const axios = require('axios')

const assetUrl = process.env.MIX_VAPOR_ASSET_URL
    ? process.env.MIX_VAPOR_ASSET_URL
    : '';

class Vapor
{
   /**
     * Generate the S3 URL to an application asset.
     */
    asset(path) {
        return assetUrl + '/' + path;
    }

    /**
     * Store a file in S3 and return its UUID, key, and other information.
     */
    async store(file, options = {}) {
        const response = await axios.post('/vapor/signed-storage-url', {
            'bucket': options.bucket || '',
            'content_type': options.contentType || file.type,
            'expires': options.expires || '',
            'visibility': options.visibility || ''
        }, {
            baseURL: options.baseURL || null,
            headers: options.headers || {},
            ...options.options
        });

        let headers = response.data.headers;

        if ('Host' in headers) {
            delete headers.Host;
        }

        if (typeof options.progress === 'undefined') {
            options.progress = () => {};
        }

        const cancelToken = options.cancelToken || ''

        await axios.put(response.data.url, file, {
            cancelToken: cancelToken,
            headers: headers,
            onUploadProgress: (progressEvent) => {
                options.progress(progressEvent.loaded / progressEvent.total);
            }
        })

        response.data.extension = file.name.split('.').pop()

        return response.data;
    }
}

module.exports = new Vapor();
