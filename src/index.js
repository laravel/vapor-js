import axios from 'axios'

let assetUrlResolver = () => {
    try {
        return process.env.MIX_VAPOR_ASSET_URL
            ? process.env.MIX_VAPOR_ASSET_URL
            : '';
    } catch (e) {
        console.error('Unable to automatically resolve the asset URL. Use Vapor.withBaseAssetUrl() to specify it manually.')

        throw e
    }
}

class Vapor
{
    /**
     * Generate the S3 URL to an application asset.
     */
    asset(path) {
        return assetUrlResolver() + '/' + path;
    }

    /**
     * Set the base URL for assets.
     */
    withBaseAssetUrl(url) {
        assetUrlResolver = () => url ? url : ''
    }

    /**
     * Store a file in S3 and return its UUID, key, and other information.
     */
    async store(file, options = {}) {
        const httpClient = options.httpClient ? options.httpClient : axios;

        const response = await httpClient.post(options.signedStorageUrl ? options.signedStorageUrl : '/vapor/signed-storage-url', {
            'bucket': options.bucket || '',
            'content_type': options.contentType || file.type,
            'expires': options.expires || '',
            'visibility': options.visibility || '',
            ...options.data
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

        await httpClient.put(response.data.url, file, {
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

export default new Vapor();
