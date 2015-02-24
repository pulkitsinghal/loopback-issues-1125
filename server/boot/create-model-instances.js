// DEBUG=boot:create-model-instances slc run
var debug = require('debug')('boot:create-model-instances');

var devGlobalConfig = {
  "env": "development"
};

module.exports = function(app) {
  var UserModel = app.models.UserModel;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  var adminUser = {realm: '123', username: 'admin@123.com', email: 'admin@123.com', password: '123'};

  // (1) create users
  UserModel.findOrCreateAsync(
    {where: {username: adminUser.username}}, // find
    adminUser // or create
  )
    .then(function(resolvedData){
      debug(resolvedData);
      // API changes: 2015-01-07, Version 2.13.0
      // add a flag to callback of findOrCreate to indicate find or create (Clark Wang)
      //adminUser = resolvedData[0];

      adminUser = resolvedData;
      debug('adminUser: ' + adminUser);

      //create the admin role
      Role.create({name: 'admin'},
        function(err, role) {
          if (err) return debug(err);
          debug(role);
          //make admin an admin
          role.principals.create({
              principalType: RoleMapping.USER,
              principalId: adminUser.id
            },
            function(err, principal) {
              if (err) return debug(err);
              debug(principal);
              debug(adminUser.username + ' now has role: ' + role.name);

              // create mock GlobalConfigModel(s) through UserModel to auto populate
              // the foreign keys in userModelToGlobalConfigModelId correctly
              adminUser.globalConfigModels.create(
                [devGlobalConfig],
                function(err, globalConfigModels) {
                  if (err) return debug('%j', err);
                  debug('created ' + globalConfigModels.length + ' globalConfigModels that belong to ' + adminUser.username);
                });

            });
        });
    })
    .catch(function(error){
      debug('error!');
      return debug('%j', error);
      //cb(error);
    });

};