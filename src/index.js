class Vapor
{
    /**
     * Store a file in S3 and return its UUID, key, and other information.
     */
    async store(file, options = {})
    {
        let data = new FormData();
        data.append('bucket', options.bucket || '');
        data.append('content_type', options.contentType || file.type);
        data.append('expires', options.expires || '');
        data.append('visibility', options.visibility || '');

        let response = JSON.parse(await function() {
            return new Promise(function(resolve) {

                let request = new XMLHttpRequest();
                request.open('POST', '/vapor/signed-storage-url');

                request.onload = () => resolve(request.response);

                for (const header in options.headers) {
                    request.setRequestHeader(header, options.headers[header]);
                }

                request.send(data);

            });
        }());

        let headers = response.headers;

        if ('Host' in headers) {
            delete headers.Host;
        }

        await function() {
            return new Promise(function(resolve) {

                let request = new XMLHttpRequest();
                request.open('PUT', response.url);

                request.onload = () => resolve(request.response);
                request.upload.onprogress = (e) => options.progress(Math.ceil((e.loaded / e.total) * 100));

                for (const header in headers) {
                    request.setRequestHeader(header, headers[header]);
                }

                request.send(file);

            });
        }();

        response.extension = file.name.split('.').pop();

        return response;
    }
}

module.exports = new Vapor();
