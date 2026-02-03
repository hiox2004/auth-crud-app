const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try{
        let query = {};
        if (req.user.role === 'admin') {
            query = {}; // admins see all tasks
        } else {
            query = { user: req.user._id }; // users see only their tasks
        }
        const tasks = await Task.find(query).populate('user', 'name email');
        res.json(tasks);
    } catch(error){
        console.error("Get tasks error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.createTask = async (req, res) => {
    try{
        const { title, description, status, assignedUserId } = req.body;
        
        let taskOwnerId = req.user._id;
        
        // If admin assigns task to another user
        if (req.user.role === 'admin' && assignedUserId) {
            taskOwnerId = assignedUserId;
        }
        
        const task = new Task({
            title,
            description,
            status: status || 'pending',
            user: taskOwnerId
        });
        await task.save();
        await task.populate('user', 'name email');
        res.status(201).json(task);
    } catch(error){
        console.error("Create task error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.getTask = async (req, res) => {
    try{
        let query = { _id: req.params.id };
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }
        const task = await Task.findOne(query).populate('user', 'name email');
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json(task);
    } catch(error){
        console.error("Get task error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.updateTask = async (req, res) => {
    try{
        let query = { _id: req.params.id };
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }
        const task = await Task.findOneAndUpdate(
            query,
            req.body,
            {new:true, runValidators:true}
        );
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json(task);
    } catch(error){
        console.error("Update task error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.deleteTask = async (req, res) => {
    try{
        let query = { _id: req.params.id };
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }
        const task = await Task.findOneAndDelete(query);
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task deleted"});
    } catch(error){
        console.error("Delete task error: ", error);
        res.status(500).json({message:"Server error"});
    }
}
