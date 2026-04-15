// Configures the Express application, routes, and error middleware.
const express = require('express');
const cors = require('cors');

const boardRoutes = require('./modules/boards/board.routes');
const listRoutes = require('./modules/lists/list.routes');
const cardRoutes = require('./modules/cards/card.routes');
const memberRoutes = require('./modules/members/member.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api', cardRoutes);
app.use('/api', memberRoutes);

app.use(errorHandler);

module.exports = app;
