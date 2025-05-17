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
    const db = require('../helpers/db');
    
    db.Workflow.findAll({
        include: [
            { model: db.WorkflowStep, as: 'workflowSteps' },
            { model: db.Employee }
        ]
    })
    .then(workflows => {
        res.json(workflows);
    })
    .catch(err => {
        next(err);
    });
}

function getById(req, res, next) {
    const db = require('../helpers/db');
    
    db.Workflow.findByPk(req.params.id, {
        include: [
            { model: db.WorkflowStep, as: 'workflowSteps' },
            { model: db.Employee }
        ]
    })
    .then(workflow => {
        if (!workflow) return res.status(404).json({ message: 'Workflow not found' });
        res.json(workflow);
    })
    .catch(err => {
        next(err);
    });
}

function create(req, res, next) {
    const db = require('../helpers/db');
    
    // Create the workflow
    db.Workflow.create({
        employeeId: req.body.employeeId,
        type: req.body.type,
        status: req.body.status || 'pending',
        details: req.body.details,
        name: req.body.name,
        description: req.body.description,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        totalSteps: req.body.steps ? req.body.steps.length : 0,
        currentStep: 1
    })
    .then(workflow => {
        // If steps are provided, create them too
        if (req.body.steps && Array.isArray(req.body.steps)) {
            const stepPromises = req.body.steps.map((step, index) => {
                return db.WorkflowStep.create({
                    workflowId: workflow.id,
                    name: step.name,
                    description: step.description,
                    departmentId: step.departmentId,
                    stepNumber: index + 1,
                    isRequired: step.isRequired !== undefined ? step.isRequired : true,
                    estimatedDays: step.estimatedDays || 1,
                    status: 'pending'
                });
            });
            
            return Promise.all(stepPromises)
                .then(() => workflow);
        }
        
        return workflow;
    })
    .then(workflow => {
        res.json({ 
            message: 'Workflow created successfully',
            id: workflow.id
        });
    })
    .catch(err => {
        next(err);
    });
}

function update(req, res, next) {
    const db = require('../helpers/db');
    
    // First check if the workflow exists
    db.Workflow.findByPk(req.params.id)
        .then(workflow => {
            if (!workflow) {
                return res.status(404).json({ message: 'Workflow not found' });
            }
            
            // Update workflow properties
            workflow.employeeId = req.body.employeeId || workflow.employeeId;
            workflow.type = req.body.type || workflow.type;
            workflow.status = req.body.status || workflow.status;
            workflow.details = req.body.details || workflow.details;
            workflow.name = req.body.name || workflow.name;
            workflow.description = req.body.description || workflow.description;
            workflow.isActive = req.body.isActive !== undefined ? req.body.isActive : workflow.isActive;
            workflow.updated = new Date();
            
            if (req.body.steps && Array.isArray(req.body.steps)) {
                workflow.totalSteps = req.body.steps.length;
            }
            
            return workflow.save();
        })
        .then(workflow => {
            // If steps are provided, update them
            if (req.body.steps && Array.isArray(req.body.steps)) {
                // First delete existing steps
                return db.WorkflowStep.destroy({ where: { workflowId: workflow.id } })
                    .then(() => {
                        // Then create new steps
                        const stepPromises = req.body.steps.map((step, index) => {
                            return db.WorkflowStep.create({
                                workflowId: workflow.id,
                                name: step.name,
                                description: step.description,
                                departmentId: step.departmentId,
                                stepNumber: index + 1,
                                isRequired: step.isRequired !== undefined ? step.isRequired : true,
                                estimatedDays: step.estimatedDays || 1,
                                status: 'pending'
                            });
                        });
                        
                        return Promise.all(stepPromises)
                            .then(() => workflow);
                    });
            }
            
            return workflow;
        })
        .then(workflow => {
            res.json({ message: 'Workflow updated successfully' });
        })
        .catch(err => {
            next(err);
        });
}

function _delete(req, res, next) {
    const db = require('../helpers/db');
    
    db.Workflow.findByPk(req.params.id)
        .then(workflow => {
            if (!workflow) {
                return res.status(404).json({ message: 'Workflow not found' });
            }
            
            // The WorkflowStep records will be deleted automatically due to CASCADE relationship
            return workflow.destroy();
        })
        .then(() => {
            res.json({ message: 'Workflow deleted successfully' });
        })
        .catch(err => {
            next(err);
        });
}