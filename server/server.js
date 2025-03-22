const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

// Read data from JSON file
const readData = () => {
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
};

// Load initial data into memory
let data = readData();

// Get all tasks
app.get('/tasks', (req, res) => {
  setTimeout(() => {
    res.json(data);
  }, 1000); // 1 second delay
});

// Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const task = data.find((task) => task._id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  const newTask = {
    _id: uuidv4(),
    createdAt: new Date().toISOString(),
    title,
    description,
    user: "default_user",
    comments: [],
    commentCount: 0
  };

  data.push(newTask);
  res.status(201).json(newTask);
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const taskIndex = data.findIndex((task) => task._id === req.params.id);
  if (taskIndex !== -1) {
    data[taskIndex] = req.body;
    res.json(data[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = data.findIndex((task) => task._id === req.params.id);
  if (taskIndex !== -1) {
    const deletedTask = data.splice(taskIndex, 1);
    res.json(deletedTask[0]);
  } else {
    res.status(404).send('Task not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});