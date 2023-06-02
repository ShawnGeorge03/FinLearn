import express from "express";

const router = express.Router();

import Todo from "../controllers/todo.js"

/**
 * @route GET /todos/:id
 * @description get a todo
 * @access public
 */
router.get("/todos/:id", Todo.getSingleTodo);


/**
 * @route GET /todos
 * @description get all todo
 * @access public
 */
router.get("/todos", Todo.getAllTodo);

/**
 * @route POST /todos
 * @description add a new todo
 * @access public
 */
router.post("/todos", Todo.postCreateTodo);


/**
 * @route PUT /todos/:id
 * @description update todo
 * @access public
 */
router.put("/todos/:id", Todo.putUpdateTodo);

/**
 * @route DELETE /todos/:id
 * @description delete todo
 * @access public
 */
router.delete("/todos/:id", Todo.deleteTodo);

export default router;