const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

// Логика игры
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

io.on('connection', socket => {
  socket.emit('currentPlayer', currentPlayer);
  socket.emit('gameBoard', gameBoard);

  socket.on('cellClicked', index => {
    if (gameBoard[index] !== '') {
      return;
    }

    gameBoard[index] = currentPlayer;
    io.emit('cellUpdated', { index, player: currentPlayer });

    if (checkWin(currentPlayer)) {
      io.emit('gameOver', currentPlayer);
      resetGame();
    } else if (checkDraw()) {
      io.emit('gameOver', 'draw');
      resetGame();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      io.emit('currentPlayer', currentPlayer);
    }
  });

  socket.on('disconnect', () => {
    resetGame();
    io.emit('currentPlayer', currentPlayer);
    io.emit('gameBoard', gameBoard);
  });
});

function checkWin(player) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return winningCombinations.some(combination => {
    return combination.every(index => {
      return gameBoard[index] === player;
    });
  });
}

function checkDraw() {
  return gameBoard.every(cell => cell !== '');
}

function resetGame() {
  currentPlayer = 'X';
  gameBoard = ['', '', '', '', '', '', '', '', ''];
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

