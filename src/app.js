const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');

const { sequelize } = require('./database/models');

const indexRouter = require('./routes/index');

const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 6379;

const app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Socket.io
const io = new Server({
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('join_channel', (data) => {
    socket.join(data);
  });

  socket.on('send_transaction', (data) => {
    socket.to(data.channel).emit('income_transaction', data.message);
  });
});

io.listen(socketPort);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === 'test') return;
    console.clear();
    console.log('----------------------------');
    console.log('Server live on port: ', port);
    console.log('Socket live on port: ', socketPort);
    console.log('MySQL connection established');
    console.log('----------------------------');
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = app;
