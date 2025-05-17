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
        { id: 1, name: 'IT Department', description: 'Information Technology Department' },
        { id: 2, name: 'HR Department', description: 'Human Resources Department' }
    ]);
}

function getById(req, res, next) {
    // TODO: Implement database query
    res.json({ id: req.params.id, name: 'IT Department', description: 'Information Technology Department' });
}

function create(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Department created successfully' });
}

function update(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Department updated successfully' });
}

function _delete(req, res, next) {
    // TODO: Implement database query
    res.json({ message: 'Department deleted successfully' });
} 