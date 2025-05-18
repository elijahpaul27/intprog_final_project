const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(Role.Admin), create);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// controller functions
function getAll(req, res, next) {
    // TODO: Implement database query
    res.json([
        { 
            id: 1, 
            firstName: 'John', 
            lastName: 'Doe',
            email: 'john.doe@example.com',
            departmentId: 1,
            position: 'Software Developer'
        },
        { 
            id: 2, 
            firstName: 'Jane', 
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            departmentId: 2,
            position: 'HR Manager'
        }
    ]);
}

function getById(req, res, next) {
    // TODO: Implement database query
    res.json({ 
        id: req.params.id, 
        firstName: 'John', 
        lastName: 'Doe',
        email: 'john.doe@example.com',
        departmentId: 1,
        position: 'Software Developer'
    });
}

function create(req, res, next) {
    const db = req.app.get('db');
    const { firstName, lastName, email, position, departmentId, salary } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !position || !salary) {
        return res.status(400).json({ message: 'First name, last name, email, position, and salary are required fields' });
    }
    
    // This function is a placeholder and not being used in the project
    // The actual implementation is in server/employees/index.js
    // But keeping this for potential future use
    
    // First create an account for the employee
    const bcrypt = require('bcryptjs');
    
    db.Account.create({
        email: email,
        passwordHash: bcrypt.hashSync('DefaultPassword123', 10), // Default password that should be changed
        title: 'Mr/Ms',
        firstName: firstName,
        lastName: lastName,
        acceptTerms: true,
        role: 'User',
        verified: new Date(), // Pre-verified
        created: new Date()
    })
    .then(account => {
        // Now create the employee with the new accountId
        const employee = {
            firstName,
            lastName,
            email,
            position,
            departmentId,
            salary,
            accountId: account.id,
            hireDate: new Date(),
            status: 'active'
        };
        
        return db.Employee.create(employee);
    })
    .then(newEmployee => {
        res.json({
            message: 'Employee created successfully',
            employee: newEmployee
        });
    })
    .catch(error => {
        next(error);
    });
}

function update(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Employee updated successfully' });
}

function _delete(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Employee deleted successfully' });
} 