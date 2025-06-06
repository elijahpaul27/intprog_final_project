const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        employeeId: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
        details: { type: DataTypes.JSON },
        currentStep: { type: DataTypes.INTEGER, defaultValue: 1 },
        totalSteps: { type: DataTypes.INTEGER, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE },
        name: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('workflow', attributes, options);
}