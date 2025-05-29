const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");

const enemyImages = [
  "enemy1.png", "enemy2.png", "enemy3.png",
  "enemy4.png", "enemy5.png", "enemy3.png"
];

const playerShotImage = "shot.png";

let playerX = game.offsetWidth / 2 - 40;
let score = 0;
let lives = 3;
let currentEnemy = 0;

// --- Melhorias de jogabilidade e dinamismo ---
let maxLives = 7;
lives = maxLives;
livesText.textContent = `Vidas: ${lives}`;
let enemySpeed = 50; // menor = mais rápido
let enemyMoveStep = 7; // pixels por movimento
let enemyFireChance = 0.025; // mais tiros
let playerSpeed = 30; // pixels por movimento
let scorePerEnemy = 150;

player.style.left = playerX + "px";
player.style.bottom = "0px";

// Movimento do jogador com teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed;
  } else if (e.key === "ArrowRight" && playerX < game.offsetWidth - 80) {
    playerX += playerSpeed;
  } else if (e.key === " " || e.key === "ArrowUp") {
    shoot();
  }
  player.style.left = playerX + "px";
});

// Movimento com toque
document.getElementById("leftBtn").addEventListener("touchstart", () => {
  playerX = Math.max(0, playerX - playerSpeed);
  player.style.left = playerX + "px";
});

document.getElementById("rightBtn").addEventListener("touchstart", () => {
  playerX = Math.min(game.offsetWidth - 80, playerX + playerSpeed);
  player.style.left = playerX + "px";
});

document.getElementById("shootBtn").addEventListener("touchstart", () => {
  shoot();
});

// Criar tiro do jogador
function shoot() {
  const shot = document.createElement("img");
  shot.src = playerShotImage;
  shot.classList.add("shot");
  shot.style.left = playerX + 25 + "px";
  shot.style.bottom = "100px";
  game.appendChild(shot);

  const interval = setInterval(() => {
    const bottom = parseInt(shot.style.bottom);
    if (bottom > game.offsetHeight) {
      clearInterval(interval);
      shot.remove();
    } else {
      shot.style.bottom = bottom + 10 + "px";
      detectHit(shot, interval);
    }
  }, 30);
}

// Criar inimigo
function spawnEnemy() {
  const enemy = document.createElement("img");
  enemy.src = enemyImages[currentEnemy % enemyImages.length];
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * (game.offsetWidth - 80) + "px";
  enemy.style.top = "0px";
  game.appendChild(enemy);

  moveEnemy(enemy);
}

function moveEnemy(enemy) {
  const interval = setInterval(() => {
    if (!enemy) return;
    let top = parseInt(enemy.style.top);
    if (top > game.offsetHeight - 50) {
      clearInterval(interval);
      enemy.remove();
      loseLife();
      return;
    }
    enemy.style.top = top + enemyMoveStep + "px";
    if (Math.random() < enemyFireChance) {
      enemyShoot(enemy);
    }
  }, enemySpeed);
}

// Inimigo atira
function enemyShoot(enemy) {
  const enemyShot = document.createElement("div");
  enemyShot.classList.add("enemy-shot");
  enemyShot.style.left = parseInt(enemy.style.left) + 25 + "px";
  enemyShot.style.top = parseInt(enemy.style.top) + 50 + "px";
  enemyShot.style.position = "absolute";
  enemyShot.style.backgroundImage = "url('enemy-shot.png')";
  enemyShot.style.backgroundSize = "cover";
  game.appendChild(enemyShot);

  const interval = setInterval(() => {
    const top = parseInt(enemyShot.style.top);
    if (top > game.offsetHeight) {
      clearInterval(interval);
      enemyShot.remove();
    } else {
      enemyShot.style.top = top + 10 + "px";
      detectPlayerHit(enemyShot, interval);
    }
  }, 30);
}

// Detectar colisão de tiro no inimigo
function detectHit(shot, interval) {
  const enemies = document.querySelectorAll(".enemy");
  enemies.forEach((enemy) => {
    const shotBox = shot.getBoundingClientRect();
    const enemyBox = enemy.getBoundingClientRect();
    if (
      shotBox.left < enemyBox.right &&
      shotBox.right > enemyBox.left &&
      shotBox.top < enemyBox.bottom &&
      shotBox.bottom > enemyBox.top
    ) {
      clearInterval(interval);
      shot.remove();
      enemy.remove();
      score += scorePerEnemy;
      scoreText.textContent = `Pontuação: ${score}`;
      currentEnemy++;
      spawnEnemy();
    }
  });
}

// Detectar colisão do inimigo com jogador
function detectPlayerHit(enemyShot, interval) {
  const playerBox = player.getBoundingClientRect();
  const shotBox = enemyShot.getBoundingClientRect();
  if (
    shotBox.left < playerBox.right &&
    shotBox.right > playerBox.left &&
    shotBox.top < playerBox.bottom &&
    shotBox.bottom > playerBox.top
  ) {
    clearInterval(interval);
    enemyShot.remove();
    loseLife();
  }
}

function loseLife() {
  lives--;
  livesText.textContent = `Vidas: ${lives}`;
  if (lives <= 0) {
    setTimeout(() => {
      alert("Game Over! Recarregando...");
      location.reload();
    }, 100);
  } else {
    spawnEnemy();
  }
}

// Avatar dinâmico via postMessage
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'avatar' && typeof event.data.data === 'string') {
    player.src = event.data.data;
  }
});

spawnEnemy();
