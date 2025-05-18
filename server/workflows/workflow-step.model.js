const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        workflowId: { type: DataTypes.INTEGER, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        departmentId: { type: DataTypes.INTEGER },
        stepNumber: { type: DataTypes.INTEGER, allowNull: false },
        isRequired: { type: DataTypes.BOOLEAN, defaultValue: true },
        estimatedDays: { type: DataTypes.INTEGER, defaultValue: 1 },
        status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE }
    };

    const options = {
        timestamps: false
    };

    return sequelize.define('workflowStep', attributes, options);
}