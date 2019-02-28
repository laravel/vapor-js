const axios = require('axios')

class Vapor
{
    async store(file, options = null) {
        const response = await axios.post('/vapor/signed-storage-url');

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
