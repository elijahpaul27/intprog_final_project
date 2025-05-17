const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.post('/:id/transfer', authorize(Role.Admin), transfer);

async function create(req, res, next) {
    try {
        // Get the total count of employees to determine the new accountId
        const employeeCount = await db.Employee.count();
        const newAccountId = employeeCount + 1;

        // Create the employee with automatic accountId and hireDate
        const employeeData = {
            ...req.body,
            accountId: newAccountId,
            hireDate: new Date()
        };

        console.log('Creating employee with data:', employeeData);
        const employee = await db.Employee.create(employeeData);
        console.log('Created employee:', employee);
        res.status(201).json(employee);
    } catch(err) {
        console.error('Error creating employee:', err);
        next(err);
    }
}

async function getAll(req, res, next) {
    try {
        const employees = await db.Employee.findAll({
            include: [{ model: db.Account }, { model: db.Department }]  
        });
        res.json(employees);
    } catch (err) { next(err); }
}

async function getById(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id, {
            include: [{ model: db.Account }, { model: db.Department }]
        });
        if (!employee) throw new Error('Employee not found');
        res.json(employee);
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id);
        if (!employee) throw new Error('Employee not found');

        // Preserve the original accountId and hireDate
        const updateData = {
            ...req.body,
            accountId: employee.accountId,
            hireDate: employee.hireDate
        };

        await employee.update(updateData);
        res.json(employee);
    } catch (err) { next(err); }
}

async function _delete(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id);
        if (!employee) throw new Error('Employee not found');
        await employee.destroy();
        res.json({ message: 'Employee deleted' });
    } catch (err) { next(err); }
}

async function transfer(req, res, next) {
    try {
        const employee = await db.Employee.findByPk(req.params.id)
        if (!employee) throw new Error('Employee not found');
        await employee.update({ departmentId: req.body.departmentId });
        await db.Workflow.create({
            employeeId: employee.id,
            type: 'Transfer',
            details: { newDepartmentId: req.body.departmentId }
        });
        res.json({ message: 'Employee transferred' });
    } catch (err) { next(err); }   
}

module.exports = router;