const Todolist = require('../model/Todo-list');

exports.AddTodo = async (req, res) => {
  const { title } = req.body;

  try {
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title field is required",
        success: false,
      });
    }

    const existingTodo = await Todolist.findOne({ title });

    if (existingTodo) {
      return res.status(400).json({
        message: "Title already exists",
        success: false,
      });
    }

    const newTodo = await Todolist.create({ title });

    return res.status(201).json({
      message: "Todo added successfully",
      success: true,
      todo: {
        id: newTodo._id,
        title: newTodo.title,
      },
    });

  } catch (error) {
    console.error("Todo add failed:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
exports.UpdateTodo = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    // Validate input
    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Title is required",
        success: false,
      });
    }

    const todo = await Todolist.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
        success: false,
      });
    }

    todo.title = title;

    const updatedTodo = await todo.save();

    res.status(200).json({
      message: "Todo updated successfully",
      success: true,
      todo: {
        id: updatedTodo._id,
        title: updatedTodo.title,
      },
    });

  } catch (error) {
    console.error("Todo update failed:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

exports.DeleteTodo= async(req,res)=>{
    const {id}=req.params
    try {
        const Delete= await Todolist.findById(id)

        if(!Delete){
            return res.status(400).json({
                message:"Todo not found",
                success:false
            })
        }
          await Todolist.findByIdAndDelete(id)
          res.status(200).json({
            message: "Todo deleted successfully",
            success: true,
          })

    } catch (error) {
        console.error("Todo delete failed:",error.message)
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

exports.getAllTodos= async(req,res)=>{

    try {
        const todos= await Todolist.find()
         res.status(200).json({
      message: "Todos fetched successfully",
      success: true,
      count: todos.length,
      todos,
    });
        
    } catch (error) {
         console.error("Failed to fetch todos:",error.message);
         return res.status(500).json({
            message:"Internal Server Error",
            success:false
         })
    }
}
exports.getbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todolist.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found by ID",
        success: false,
      });
    }

    res.status(200).json({
      message: "Todo fetched successfully",
      success: true,
      todo,  // returning single object
    });

  } catch (error) {
    console.error("Failed to fetch todo by ID:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};