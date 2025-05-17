const express = require('express');
const router = express.Router();
const accountService = require('./account.service');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

// routes
router.get('/', authorize(), getDashboard);

module.exports = router;

function getDashboard(req, res, next) {
    // Get user's dashboard data based on their role
    const userId = req.user.id;
    const userRole = req.user.role;

    // Return different dashboard data based on role
    if (userRole === Role.Admin) {
        // Admin dashboard data
        return res.json({
            role: 'admin',
            message: 'Welcome to the admin dashboard'
        });
    } else {
        // User dashboard data
        return res.json({
            role: 'user',
            message: 'Welcome to your dashboard'
        });
    }
} 