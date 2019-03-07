const axios = require('axios')

class Vapor
{
    /**
     * Store a file in S3 and return its UUID, key, and other information.
     */
    async store(file, options = null) {
        console.log(file);

        const response = await axios.post('/vapor/signed-storage-url', {
            'bucket': options.bucket || '',
            'content_type': options.contentType || file.type,
            'expires': options.expires || ''
        });

        if (typeof options.progress === 'undefined') {
            options.progress = () => {};
        }

        const s3Response = await axios.put(response.data.url, file, {
            headers: response.data.headers,
            onUploadProgress: (progressEvent) => {
                options.progress(progressEvent.loaded / progressEvent.total);
            }
        });

        return response.data;
    }
}

module.exports = new Vapor();
