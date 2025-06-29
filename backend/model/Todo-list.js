const mongoose= require("mongoose")


const TodoSchema= new mongoose.Schema(

{



    title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  }
}
,{
    timestamps:true
}

)
const Todolist= mongoose.model("Todolist",TodoSchema)
module.exports=Todolist