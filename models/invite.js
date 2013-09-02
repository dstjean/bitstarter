module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Invite", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		}, email: {
			type: DataTypes.STRING(254),
			allowNull: false,
			validate: {
				isEmail:true
			}
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
  }, {
	timestamps: true,
	paranoid: true,
	tableName: 'InviteRequests'
  })
}