!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){var e=function(){};e.prototype.store=function(e,n){void 0===n&&(n={});try{var t=new FormData;return t.append("bucket",n.bucket||""),t.append("content_type",n.contentType||e.type),t.append("expires",n.expires||""),t.append("visibility",n.visibility||""),Promise.resolve(new Promise(function(e){var o=new XMLHttpRequest;for(var r in o.open("POST","/vapor/signed-storage-url"),o.onload=function(){return e(o.response)},n.headers)o.setRequestHeader(r,n.headers[r]);o.send(t)})).then(function(t){var o=JSON.parse(t),r=o.headers;return"Host"in r&&delete r.Host,Promise.resolve(new Promise(function(t){var s=new XMLHttpRequest;for(var i in s.open("PUT",o.url),s.onload=function(){return t(s.response)},s.upload.onprogress=function(e){return n.progress(Math.ceil(e.loaded/e.total*100))},r)s.setRequestHeader(i,r[i]);s.send(e)})).then(function(){return o.extension=e.name.split(".").pop(),o})})}catch(e){return Promise.reject(e)}},module.exports=new e});
//# sourceMappingURL=laravel-vapor.umd.js.map
