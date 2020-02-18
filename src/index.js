const axios = require('axios')
const CancelToken = axios.CancelToken

class Vapor
{
    constructor() {
        this.cancelToken = null
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
            headers: options.headers || {}
        });

        let headers = response.data.headers;

        if ('Host' in headers) {
            delete headers.Host;
        }

        if (typeof options.progress === 'undefined') {
            options.progress = () => {};
        }

        this.cancelToken = CancelToken.source()

        await axios.put(response.data.url, file, {
            cancelToken: this.cancelToken,
            headers: headers,
            onUploadProgress: (progressEvent) => {
                options.progress(progressEvent.loaded / progressEvent.total);
            }
        })

        this.cancelToken = null

        response.data.extension = file.name.split('.').pop()

        return response.data;
    }

    cancel() {
        if (this.cancelToken) {
            this.cancelToken.cancel()
            this.cancelToken = null
        }
    }
}

module.exports = new Vapor();
