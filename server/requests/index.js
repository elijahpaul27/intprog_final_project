const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

router.post('/', authorize(), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.get('/employee/:employeeId', authorize(), getByEmployeeId);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(), _delete);

async function create(req, res, next) {
    try {
        const request = await db.Request.create({
            ...req.body,
            status: 'pending'
        });
        res.status(201).json(request);
    } catch (err) { next(err); }
}

async function getAll(req, res, next) {
    try {
        const requests = await db.Request.findAll({
            include: [{ model: db.Employee }]
        });
        res.json(requests);
    } catch (err) { next(err); }
}

async function getById(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id, {
            include: [{ model: db.Employee }]
        });
        if (!request) throw new Error('Request not found');
        res.json(request);
    } catch (err) { next(err); }
}

async function getByEmployeeId(req, res, next) {
    try {
        const requests = await db.Request.findAll({
            where: { employeeId: req.params.employeeId },
            include: [{ model: db.Employee }]
        });
        res.json(requests);
    } catch (err) { next(err); }
}

async function update(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) throw new Error('Request not found');
        await request.update(req.body);
        res.json(request);
    } catch (err) { next(err); }
}

async function _delete(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) throw new Error('Request not found');
        await request.destroy();
        res.json({ message: 'Request deleted' });
    } catch (err) { next(err); }
}

module.exports = router;