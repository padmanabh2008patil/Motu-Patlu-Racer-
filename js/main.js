
const screens = document.querySelectorAll(".screen");

function go(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });
  hideNotice();
}

/* Loading bar: 0% to 100% */
let progress = 0;
const progressEl = document.getElementById("progress");
const percentEl = document.getElementById("loadPercent");

const loader = setInterval(() => {
  progress = Math.min(100, progress + 1);

  progressEl.style.width = progress + "%";
  percentEl.textContent = "Loading " + progress + "%";

  if (progress >= 100) {
    clearInterval(loader);
    setTimeout(() => go("home"), 400);
  }
}, 35);

/* Player and car selection */
let playerIndex = 0;
let carIndex = 0;
let selectedPlayer = 0;
let selectedCar = 0;

function openPlayers() {
  playerIndex = selectedPlayer;
  updateItem("player");
  go("players");
}

function openCars() {
  carIndex = selectedCar;
  updateItem("car");
  go("cars");
}

function changeItem(type, direction) {
  if (type === "player") {
    playerIndex = (playerIndex + direction + 6) % 6;
  } else {
    carIndex = (carIndex + direction + 6) % 6;
  }

  updateItem(type);
}

function updateItem(type) {
  if (type === "player") {
    document.getElementById("playerBg").src =
      "images/player" + (playerIndex + 1) + ".png";
  } else {
    document.getElementById("carBg").src =
      "images/car" + (carIndex + 1) + ".png";
  }
}

function selectItem(type) {
  if (type === "player") {
    selectedPlayer = playerIndex;
    showNotice("Player निवडला!");
  } else {
    selectedCar = carIndex;
    showNotice("Car निवडली!");
  }

  setTimeout(() => go("garage"), 700);
}

/* Series selection */
function chooseSeries(name, locked) {
  if (locked) {
    showNotice(name + " सध्या LOCKED आहे.");
  } else {
    showNotice(name + " Series निवडली!");
    setTimeout(() => go("garage"), 700);
  }
}

/* Messages */
let noticeTimer;

function showNotice(message) {
  const notice = document.getElementById("notice");
  notice.textContent = message;
  notice.style.display = "block";

  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(hideNotice, 2200);
}

function hideNotice() {
  const notice = document.getElementById("notice");
  if (!notice) return;

  notice.style.display = "none";
  clearTimeout(noticeTimer);
}
