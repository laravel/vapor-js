const axios = require('axios')

class Vapor
{
    work() {
        axios.get('/foo')
            .then(response => {
                console.log(response.data);
            })
    }
}

module.exports = Vapor;
