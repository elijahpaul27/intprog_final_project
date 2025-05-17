const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

// controller functions
function getAll(req, res, next) {
    // TODO: Implement database query
    res.json([
        { 
            id: 1, 
            type: 'Leave Request',
            status: 'Pending',
            employeeId: 1,
            workflowId: 1,
            details: {
                startDate: '2024-03-20',
                endDate: '2024-03-22',
                reason: 'Family vacation'
            }
        },
        { 
            id: 2, 
            type: 'Expense Report',
            status: 'Approved',
            employeeId: 2,
            workflowId: 2,
            details: {
                date: '2024-03-15',
                amount: 150.00,
                description: 'Office supplies'
            }
        }
    ]);
}

function getById(req, res, next) {
    // TODO: Implement database query
    res.json({ 
        id: req.params.id, 
        type: 'Leave Request',
        status: 'Pending',
        employeeId: 1,
        workflowId: 1,
        details: {
            startDate: '2024-03-20',
            endDate: '2024-03-22',
            reason: 'Family vacation'
        }
    });
}

function create(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Request created successfully' });
}

function update(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Request updated successfully' });
}

function _delete(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Request deleted successfully' });
} 