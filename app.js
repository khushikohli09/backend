const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const tasksFile = path.join(__dirname, 'tasks.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});


const loadTasks = () => {
    if (fs.existsSync(tasksFile)) {
        const data = fs.readFileSync(tasksFile, 'utf-8');
        return data ? JSON.parse(data) : [];
    }
    return [];
};


const saveTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};


app.get('/tasks', (req, res) => {
    const tasks = loadTasks();
    res.render('index', { tasks });
});


app.get('/task', (req, res) => {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == req.query.id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});


app.post('/add-task', (req, res) => {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        text: req.body.task,
        timestamp: new Date().toISOString()  
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.redirect('/tasks');
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
