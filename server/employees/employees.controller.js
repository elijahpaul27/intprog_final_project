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
    // TODO: Implement database query
    res.json({ message: 'Employee created successfully' });
}

function update(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Employee updated successfully' });
}

function _delete(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Employee deleted successfully' });
} 