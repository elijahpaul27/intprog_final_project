const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        accountId: { type: DataTypes.INTEGER, allowNull: false },
        departmentId: { type: DataTypes.INTEGER },
        position: { type: DataTypes.STRING, allowNull: false },
        hireDate: { type: DataTypes.DATE, allowNull: false },
        salary: { type: DataTypes.DECIMAL(10, 2) },
        status: { type: DataTypes.ENUM('active', 'inactive', 'on_leave'), defaultValue: 'active' },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('employee', attributes, options);
} 