const express = require('express');
const router = express.Router();
const accountService = require('../../accounts/account.service');
const authorize = require('../../middleware/authorize');
const Role = require('../../helpers/role');
const Joi = require('joi');
const validateRequest = require('../../middleware/validate-request');

// routes
router.get('/', authorize(Role.Admin), getAll);
router.get('/:id', authorize(Role.Admin), getById);
router.post('/', authorize(Role.Admin), createSchema, create);
router.put('/:id', authorize(Role.Admin), updateSchema, update);
router.delete('/:id', authorize(Role.Admin), _delete);
router.put('/:id/block', authorize(Role.Admin), blockAccount);
router.put('/:id/unblock', authorize(Role.Admin), unblockAccount);

module.exports = router;

function getAll(req, res, next) {
    accountService.getAll()
        .then(accounts => res.json(accounts))
        .catch(next);
}

function getById(req, res, next) {
    accountService.getById(req.params.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        isActive: Joi.boolean()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    accountService.create(req.body)
        .then(account => res.json(account))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().empty(''),
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        email: Joi.string().email().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
        role: Joi.string().valid(Role.Admin, Role.User).empty(''),
        isActive: Joi.boolean().empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    accountService.update(req.params.id, req.body)
        .then(account => res.json(account))
        .catch(next);
}

function _delete(req, res, next) {
    accountService.delete(req.params.id)
        .then(() => res.json({ message: 'Account deleted successfully' }))
        .catch(next);
}

function blockAccount(req, res, next) {
    accountService.blockAccount(req.params.id)
        .then(() => res.json({ message: 'Account blocked successfully' }))
        .catch(next);
}

function unblockAccount(req, res, next) {
    accountService.unblockAccount(req.params.id)
        .then(() => res.json({ message: 'Account unblocked successfully' }))
        .catch(next);
} 