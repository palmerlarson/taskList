const express = require("express");
const app = express();
const fs = require('fs');
let tasks = require('./tasks.json');
app.use(express.json());

//returns all tasks
app.get("/api/tasks/", (req, res) => {
	req.header("Content-Type", "application/json");
	res.send(tasks);
});

//returns specified tasks
app.get("/api/tasks/:id", (req, res) => {
	let task = tasks.find(t => t.id == parseInt(req.params.id));
	if (task) {
		res.json(task);
	} else {
		res.json({});
	}
});

//add new task via post
app.post("/api/tasks/", (req, res) => {
	let newTask = {
		"id": tasks.length + 1,
		"name": req.body.name
	}
	for (let i = 0; i < tasks.length; i++) {
		while (tasks[i].id == newTask.id) {
			newTask.id++;
		}
	}
	tasks.push(newTask);
	let data = JSON.stringify(tasks);
	fs.writeFileSync('tasks.json', data);
	res.json(newTask);
});

//removes a task
app.delete("/api/tasks/:id", (req, res) => {
	let taskToRemove = tasks.find(t => t.id == parseInt(req.params.id));
	let index = tasks.indexOf(taskToRemove);
	tasks.splice(index, 1);
	let data = JSON.stringify(tasks);
	fs.writeFileSync('tasks.json', data);
	res.json(taskToRemove);
});

//updates a task
app.put("/api/tasks/:id", (req, res) => {
	let taskToUpdate = tasks.find(t => t.id == parseInt(req.params.id));
	taskToUpdate.name = req.body.name;
	let data = JSON.stringify(tasks);
	fs.writeFileSync('tasks.json', data);
	res.json(taskToUpdate);
})

//npx nodemon app.js
app.listen(3000, () => {
	console.log("listening on port 3000");
});
