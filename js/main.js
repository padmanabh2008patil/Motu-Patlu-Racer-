
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

  if (progressEl) progressEl.style.width = progress + "%";
  if (percentEl) percentEl.textContent = "Loading " + progress + "%";

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

/* Move through all 6 players or cars */
function changeItem(type, direction) {
  if (type === "player") {
    playerIndex = (playerIndex + direction + 6) % 6;
  } else if (type === "car") {
    carIndex = (carIndex + direction + 6) % 6;
  }

  updateItem(type);
}

/* Display the current player or car */
function updateItem(type) {
  if (type === "player") {
    const image = document.getElementById("playerBg");
    if (image) {
      image.src = `images/player${playerIndex + 1}.png`;
    }
  } else if (type === "car") {
    const image = document.getElementById("carBg");
    if (image) {
      image.src = `images/car${carIndex + 1}.png`;
    }
  }
}

/* Select silently: no message in any language */
function selectItem(type) {
  if (type === "player") {
    selectedPlayer = playerIndex;
  } else if (type === "car") {
    selectedCar = carIndex;
  }

  hideNotice();
  go("garage");
}

/* Series selection */
function chooseSeries(name, locked) {
  if (locked) {
    hideNotice();
    return;
  }

  hideNotice();
  go("garage");
}

/* Messages */
let noticeTimer;

function showNotice(message) {
  const notice = document.getElementById("notice");
  if (!notice) return;

  notice.textContent = message;
  notice.style.display = "block";

  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(hideNotice, 2200);
}

function hideNotice() {
  const notice = document.getElementById("notice");
  if (notice) {
    notice.style.display = "none";
    notice.textContent = "";
  }

  clearTimeout(noticeTimer);
}
