const axios = require('axios')
const CancelToken = axios.CancelToken

class Vapor
{
    constructor() {
        this.cancelAction = null
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

        const cancelToken = new CancelToken(cancel => {
            this.cancelAction = cancel
        })

        await axios.put(response.data.url, file, {
            cancelToken: cancelToken,
            headers: headers,
            onUploadProgress: (progressEvent) => {
                options.progress(progressEvent.loaded / progressEvent.total);
            }
        });

        response.data.extension = file.name.split('.').pop()

        return response.data;
    }

    cancel() {
        if (this.cancelAction) {
            this.cancelAction()
            this.cancelAction = null
        }
    }
}

module.exports = new Vapor();
