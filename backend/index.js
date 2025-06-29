const express   = require("express");
const cors      = require("cors");
const dotenv    = require("dotenv");
const connectionDB     = require("./config/db");
const TodolistRouter   = require('./Router/To-doRouter');

dotenv.config();

const app  = express();
const port = process.env.PORT 

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS']
  // credentials: true  // uncomment if you use cookies/sessions
}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Hello world…!");
});

app.use('/api', TodolistRouter);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectionDB();
});
