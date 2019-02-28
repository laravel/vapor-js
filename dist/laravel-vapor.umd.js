!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o():"function"==typeof define&&define.amd?define(o):o()}(0,function(){var e=require("axios"),o=function(){};o.prototype.work=function(){e.get("/foo").then(function(e){console.log(e.data)})},module.exports=new o});
//# sourceMappingURL=laravel-vapor.umd.js.map
