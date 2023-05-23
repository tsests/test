const socket = io();

socket.on('currentPlayer', currentPlayer => {
  document.getElementById('currentPlayer').textContent = `Current Player: ${currentPlayer}`;
});

socket.on('gameBoard', gameBoard => {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.textContent = gameBoard[index];
    cell.classList.remove('X', 'O');
    if (gameBoard[index] !== '') {
      cell.classList.add(gameBoard[index]);
    }
  });
});

socket.on('cellUpdated', ({ index, player }) => {
  const cell = document.getElementsByClassName('cell')[index];
  cell.textContent = player;
  cell.classList.add(player);
});

socket.on('gameOver', winner => {
  if (winner === 'draw') {
    alert('Игра окончена. Ничья!');
  } else {
    alert(`Игра окончена. Победил игрок ${winner}!`);
  }
});

function handleCellClick(index) {
  socket.emit('cellClicked', index);
}

