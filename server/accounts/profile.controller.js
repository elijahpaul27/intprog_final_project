const express = require('express');
const router = express.Router();
const accountService = require('./account.service');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// routes
router.get('/', authorize(), getProfile);
router.put('/', authorize(), updateProfile);

module.exports = router;

function getProfile(req, res, next) {
    accountService.getById(req.user.id)
        .then(account => account ? res.json(account) : res.sendStatus(404))
        .catch(next);
}

function updateProfile(req, res, next) {
    // users can only update their own profile
    if (req.params.id !== req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    accountService.update(req.user.id, req.body)
        .then(account => res.json(account))
        .catch(next);
} 