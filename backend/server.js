const express = require "express";

const app = express()

app.get("/", (req, res) => {
    res.send(" Server is running!!")
})

const PORT = 7500;
app.listen(PORT, (req, res) => {
      console.log(`Server is running on http://localhost(PORT)`)
})