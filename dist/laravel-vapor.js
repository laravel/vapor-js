var e=require("axios"),t=e.CancelToken,n=function(){this.cancelAction=null};n.prototype.store=function(n,o){void 0===o&&(o={});try{var r=this;return Promise.resolve(e.post("/vapor/signed-storage-url",{bucket:o.bucket||"",content_type:o.contentType||n.type,expires:o.expires||"",visibility:o.visibility||""},{baseURL:o.baseURL||null,headers:o.headers||{}})).then(function(i){var s=i.data.headers;"Host"in s&&delete s.Host,void 0===o.progress&&(o.progress=function(){});var c=new t(function(e){r.cancelAction=e});return Promise.resolve(e.put(i.data.url,n,{cancelToken:c,headers:s,onUploadProgress:function(e){o.progress(e.loaded/e.total)}})).then(function(){return i.data.extension=n.name.split(".").pop(),i.data})})}catch(e){return Promise.reject(e)}},n.prototype.cancel=function(){this.cancelAction&&(this.cancelAction(),this.cancelAction=null)},module.exports=new n;
//# sourceMappingURL=laravel-vapor.js.map
