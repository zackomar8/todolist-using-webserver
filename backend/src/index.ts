import express from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
import { v4 as uuidv4 } from "uuid";
const LocalStorage = require("node-localstorage").LocalStorage;

const localStorage = new LocalStorage("./localStorage");

const app = express();

app.use(bodyParser.json());
app.use(cors());

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

class TodoList {
  todos: Todo[];

  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos") || "[]");
  }

  saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(task: string) {
    const newTodo: Todo = {
      id: uuidv4().slice(0, 4),
      task: task,
      completed: false,
    };
    this.todos.push(newTodo);
    this.saveToLocalStorage();
  }

  updateTodoStatus(id: string, completed: boolean) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = completed;
      this.saveToLocalStorage();
    }
  }

  updateTodo(id: string, updatedTask: string) {
    const todo = this.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.task = updatedTask;
      this.saveToLocalStorage();
    }
  }

  deleteTodo(id: string) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  searchTodos(term: string) {
    return this.todos.filter(
      (todo) =>
        todo.task.toLowerCase().includes(term.toLowerCase()) || todo.id === term
    );
  }
}

const todoList = new TodoList();

app.get("/tasks", (req, res) => {
  const todos = todoList.getAllTodos();
  res.json(todos);
});

app.post("/create-task", (req, res) => {
  const task = req.body.task.todo;
  todoList.createTodo(task);
  const id = todoList.todos[todoList.todos.length - 1].id;
  req.body.task.id = id;
  res.status(201).json(req.body);
});

app.put("/edit-task/:id", (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  todoList.updateTodo(id, task);
  res.json({ message: "Todo updated successfully" });
});

app.delete("/delete-task/:id", (req, res) => {
  const { id } = req.params;
  todoList.deleteTodo(id);
  res.json({ message: "Todo deleted successfully" });
});

app.put("/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  todoList.updateTodoStatus(id, completed);
  res.json({ message: "Todo status updated successfully" });
});

app.get("/tasks/search", (req, res) => {
  const { term } = req.query;
  const todos = todoList.searchTodos(term.toString());
  res.json(todos);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
