/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/todo-list');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  res.status(err.status).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
