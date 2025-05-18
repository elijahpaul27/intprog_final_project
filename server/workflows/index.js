const express = require('express');
const router = express.Router();
const db = require('../helpers/db');
const authorize = require('../middleware/authorize');
const Role = require('../helpers/role');

router.post('/', authorize(Role.Admin), create);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(Role.Admin), update);
router.patch('/:id/status', authorize(Role.Admin), toggleStatus);
router.delete('/:id', authorize(Role.Admin), _delete);

async function create(req, res, next) {
    try {
        // Extract steps from request body
        const { steps, ...workflowData } = req.body;
        
        // Set totalSteps based on steps array length
        if (steps && Array.isArray(steps)) {
            workflowData.totalSteps = steps.length;
        }
        
        // Create the workflow
        const workflow = await db.Workflow.create(workflowData);
        
        // Create workflow steps if provided
        if (steps && Array.isArray(steps)) {
            const stepPromises = steps.map((step, index) => {
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
            
            await Promise.all(stepPromises);
        }
        
        // Return the created workflow with its steps
        const createdWorkflow = await db.Workflow.findByPk(workflow.id, {
            include: [
                { model: db.Employee },
                { model: db.WorkflowStep, as: 'workflowSteps' }
            ]
        });
        
        res.status(201).json(createdWorkflow);
    } catch(err) { next(err); }
}

async function getAll(req, res, next) {
    try {
        const workflows = await db.Workflow.findAll({
            include: [
                { model: db.Employee },
                { model: db.WorkflowStep, as: 'workflowSteps' }
            ]
        });
        res.json(workflows);
    } catch(err) { next(err); }
}

async function getById(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id, {
            include: [
                { model: db.Employee },
                { model: db.WorkflowStep, as: 'workflowSteps' }
            ]
        });
        if (!workflow) throw new Error('Workflow not found');
        res.json(workflow);
    } catch(err) { next(err); }
}

async function update(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        
        // Extract steps from request body
        const { steps, ...workflowData } = req.body;
        
        // Update totalSteps based on steps array length
        if (steps && Array.isArray(steps)) {
            workflowData.totalSteps = steps.length;
        }
        
        // Update workflow data
        await workflow.update(workflowData);
        
        // Update workflow steps if provided
        if (steps && Array.isArray(steps)) {
            // First delete existing steps
            await db.WorkflowStep.destroy({
                where: { workflowId: workflow.id }
            });
            
            // Then create new steps
            const stepPromises = steps.map((step, index) => {
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
            
            await Promise.all(stepPromises);
        }
        
        // Return the updated workflow with its steps
        const updatedWorkflow = await db.Workflow.findByPk(workflow.id, {
            include: [
                { model: db.Employee },
                { model: db.WorkflowStep, as: 'workflowSteps' }
            ]
        });
        
        res.json(updatedWorkflow);
    } catch(err) { next(err); }
}

// Toggle the isActive status of a workflow
async function toggleStatus(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        
        // Update isActive status
        await workflow.update({ 
            isActive: req.body.isActive,
            updated: new Date()
        });
        
        // Return the updated workflow with its steps
        const updatedWorkflow = await db.Workflow.findByPk(workflow.id, {
            include: [
                { model: db.Employee },
                { model: db.WorkflowStep, as: 'workflowSteps' }
            ]
        });
        
        res.json(updatedWorkflow);
    } catch(err) { next(err); }
}

async function _delete(req, res, next) {
    try {
        const workflow = await db.Workflow.findByPk(req.params.id);
        if (!workflow) throw new Error('Workflow not found');
        await workflow.destroy();
        res.json({ message: 'Workflow deleted' });
    } catch(err) { next(err); }
}

module.exports = router;