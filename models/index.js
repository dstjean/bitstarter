var config = require('../.env');
if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

    // the application is executed on the local machine ... use mysql
      sequelize = new Sequelize(config.postgres.db, config.postgres.username, config.postgres.password, {
      dialect:  'postgres',
      protocol: 'postgres',
//      port:     match[4], Default Port
      host:     config.postgres.host,
      logging:  function(log) {
		console.log(log);
	  },
	  omitNull: true
    })

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Invite:      sequelize.import(__dirname + '/invite'),


    // add your other models here
  }

  /*
    Associations can be defined here. E.g. like this:
  */
//global.db.sequelize.sync();
}

module.exports = global.db
