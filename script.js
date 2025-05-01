const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const restartBtn = document.getElementById('restartBtn');

let playerX = 140;
let score = 0;
let lives = 3;
let gameOver = false;
let enemies = [];

function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'orange', 'purple', 'yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createEnemy() {
  const div = document.createElement('div');
  div.classList.add('enemy');
  div.style.backgroundColor = getRandomColor();

  const enemy = {
    el: div,
    x: Math.floor(Math.random() * (gameArea.clientWidth - 60)),
    y: -Math.random() * 200 - 100,
    speed: 3 + Math.random() * 2,
  };

  div.style.left = enemy.x + 'px';
  div.style.top = enemy.y + 'px';
  gameArea.appendChild(div);
  enemies.push(enemy);
}

function updatePlayerPosition() {
  player.style.left = playerX + 'px';
}

function updateUI() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
}

function resetGame() {
  playerX = 140;
  score = 0;
  lives = 3;
  gameOver = false;
  enemies.forEach(e => e.el.remove());
  enemies = [];
  updateUI();
  restartBtn.style.display = 'none';
  createEnemy(); // mínimo un enemigo
  updatePlayerPosition();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameOver = true;
  restartBtn.style.display = 'block';
}

function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
    enemy.el.style.top = enemy.y + 'px';

    // Colisión
    if (
      enemy.y + 80 >= gameArea.clientHeight - 110 &&
      enemy.x < playerX + 60 &&
      enemy.x + 60 > playerX
    ) {
      enemy.y = -100;
      enemy.x = Math.floor(Math.random() * (gameArea.clientWidth - 60));
      enemy.el.style.left = enemy.x + 'px';
      lives -= 1;
      updateUI();
      if (lives <= 0) {
        alert('¡Perdiste! Puntaje: ' + score);
        endGame();
      }
    }

    // Si el enemigo salió por abajo
    if (enemy.y > gameArea.clientHeight) {
      enemy.y = -100;
      enemy.x = Math.floor(Math.random() * (gameArea.clientWidth - 60));
      enemy.el.style.left = enemy.x + 'px';
      score += 1;
      updateUI();

      // Aumentar dificultad: más enemigos
      if (score % 5 === 0 && enemies.length < 6) {
        createEnemy();
      }

      // Aumentar velocidad de todos
      enemies.forEach(e => e.speed += 0.2);
    }
  });
}

function gameLoop() {
  if (gameOver) return;
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

// Movimiento táctil / mouse / teclado
function movePlayerTo(x) {
  const rect = gameArea.getBoundingClientRect();
  let newX = x - rect.left - player.offsetWidth / 2;
  newX = Math.max(0, Math.min(gameArea.clientWidth - player.offsetWidth, newX));
  playerX = newX;
  updatePlayerPosition();
}

gameArea.addEventListener('mousemove', (e) => {
  if (!gameOver) movePlayerTo(e.clientX);
});

gameArea.addEventListener('touchmove', (e) => {
  if (!gameOver) {
    movePlayerTo(e.touches[0].clientX);
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (gameOver) return;
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 20;
  } else if (e.key === 'ArrowRight' && playerX < gameArea.clientWidth - 60) {
    playerX += 20;
  }
  updatePlayerPosition();
});

restartBtn.addEventListener('click', resetGame);

// Iniciar juego
createEnemy();
updateUI();
updatePlayerPosition();
requestAnimationFrame(gameLoop);
