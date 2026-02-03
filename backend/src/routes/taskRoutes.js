const express = require('express');
const router = express.Router();
const { validateTask } = require("../middleware/validate");
const{
    getTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const {protect} = require('../middleware/authMiddleware');
// protect all task routes
router.use(protect);

// GET /api/v1/tasks
router.get("/", getTasks);

// POST /api/v1/tasks
router.post("/", validateTask, createTask);

// GET /api/v1/tasks/:id
router.get("/:id", getTask);

// PUT /api/v1/tasks/:id
router.put("/:id", updateTask);

// DELETE /api/v1/tasks/:id
router.delete("/:id", deleteTask);

module.exports = router;
