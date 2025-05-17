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
            name: 'Leave Request', 
            description: 'Process for requesting time off',
            steps: ['Submit Request', 'Manager Approval', 'HR Review', 'Final Approval']
        },
        { 
            id: 2, 
            name: 'Expense Report', 
            description: 'Process for submitting expense reports',
            steps: ['Submit Report', 'Manager Review', 'Finance Approval', 'Payment Processing']
        }
    ]);
}

function getById(req, res, next) {
    // TODO: Implement database query
    res.json({ 
        id: req.params.id, 
        name: 'Leave Request', 
        description: 'Process for requesting time off',
        steps: ['Submit Request', 'Manager Approval', 'HR Review', 'Final Approval']
    });
}

function create(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Workflow created successfully' });
}

function update(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Workflow updated successfully' });
}

function _delete(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Workflow deleted successfully' });
} 