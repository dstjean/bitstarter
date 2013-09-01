module.exports = {
  up: function(migration, DataTypes, done) {
        migration.createTable("InviteRequests", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}, email: {
			type: DataTypes.STRING(254),
			allowNull: false
		}, request_date: {
			type: DataTypes.DATE,
			allowNull: false
		}, request_type: {
			type: DataTypes.ENUM,
			values: ['free', 'premium'],
			allowNull: false,
		}, payment_method: {
			type: DataTypes.ENUM,
			values: ['PayPal', 'BitCoin'],
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE
		}, updatedAt: {
			type: DataTypes.DATE
		}, deletedAt: {
			type: DataTypes.DATE
		}
	});
    done()
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("InviteRequests");
    done()
  }
}