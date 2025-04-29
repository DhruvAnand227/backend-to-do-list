const express = require("express")
const mongoose = require("mongoose")
const path = require("path");

//nodemon ./to-do-list-project/main.js

const app = express()
mongoose.connect("mongodb://localhost:27017/to-do-list");
app.use(express.json());

const port = 3000;

let todoSchema = new mongoose.Schema({
    task: String,
    isDone: Boolean
})

const toDoList = mongoose.model("toDoList", todoSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
})

app.post('/add', async (req, res) => {
    const data = req.body;

    const newTask = new toDoList({
        task: data.task,
        isDone: data.isDone
    })

    let savedData = await newTask.save();

    res.json(savedData);
})

app.get('/todos', async (req, res) => {
    try {
        const tasks = await toDoList.find();
        res.json(tasks);
    } 
    catch (err) {
        res.status(500).json({Error: err.message});
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const updatedData = await toDoList.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new : true}            
        )
        res.json(updatedData);
    }

    catch (err) {
        res.status(500).json({Error: err.message});
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const deleteData = await toDoList.deleteOne({ _id: req.params.id })

        if (deleteData.deletedCount === 0) {
            res.json({ message: "Task not found!" });
        }

        res.json({message : "Task deleted successfully!"});
    }

    catch (err) {
        res.status(500).json({Error: err.message});
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
