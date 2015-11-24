module.exports = function(Reader) {
  Reader.beforeRemote('create', function(context, next){
    var require = context.require;
    next();
  });
};
