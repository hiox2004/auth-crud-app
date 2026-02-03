const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try{
        const tasks = await Task.find({user: req.user._id});
        res.json(tasks);
    } catch(error){
        console.error("Get tasks error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.createTask = async (req, res) => {
    try{
        const task = new Task({
            ...req.body,
            user: req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch(error){
        console.error("Create task error: ", error);
        res.status(500).json({message:"Server error"});
    }
};

exports.getTask = async (req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, user: req.user._id});
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
        const task = await Task.findOneAndUpdate(
            {_id: req.params.id, user: req.user._id},
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
        const task = await Task.findOneAndDelete({_id: req.params.id, user: req.user._id});
        if(!task){
            return res.status(404).json({message:"Task not found"});
        }
        res.json({message:"Task deleted"});
    } catch(error){
        console.error("Delete task error: ", error);
        res.status(500).json({message:"Server error"});
    }
}
