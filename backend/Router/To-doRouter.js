const express = require("express");
const router = express.Router();

const {
  AddTodo,
  UpdateTodo,
  DeleteTodo,getAllTodos,getbyId // renamed function in controller,

} = require('../controller/Todolistcontroller');

// Routes
router.post('/add', AddTodo);
router.put('/update/:id', UpdateTodo);
router.delete('/delete/:id', DeleteTodo);  // renamed to avoid using `delete`
router.get('/getall',getAllTodos)
router.get("/getbyid/:id",getbyId )
module.exports = router;
