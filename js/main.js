
const screens = document.querySelectorAll(".screen");
const screenHistory = [];

function displayScreen(id) {
  if (!document.getElementById(id)) return;

  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  hideNotice();
}

function go(id) {
  const current = document.querySelector(".screen.active");
  if (!document.getElementById(id)) return;
  if (current && current.id === id) return;

  if (current && current.id !== "loading") {
    screenHistory.push(current.id);
  }

  displayScreen(id);
}

function backScreen() {
  const current = document.querySelector(".screen.active");

  while (screenHistory.length) {
    const previous = screenHistory.pop();

    if (current && previous !== current.id) {
      displayScreen(previous);
      return;
    }
  }

  displayScreen("garage");
}

/* Loading */
let progress = 0;
const progressEl = document.getElementById("progress");
const percentEl = document.getElementById("loadPercent");

const loader = setInterval(() => {
  progress = Math.min(100, progress + 1);

  if (progressEl) progressEl.style.width = progress + "%";
  if (percentEl) percentEl.textContent = "Loading " + progress + "%";

  if (progress >= 100) {
    clearInterval(loader);
    screenHistory.length = 0;
    setTimeout(() => displayScreen("home"), 400);
  }
}, 35);

/* Six players and six cars */
const TOTAL_PLAYERS = 6;
const TOTAL_CARS = 6;

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

/* Preload images to reduce delay */
const imageCache = {};

function preloadImages(prefix, total) {
  for (let i = 1; i <= total; i++) {
    const image = new Image();
    image.src = `images/${prefix}${i}.png`;
    imageCache[`${prefix}${i}`] = image;
  }
}

preloadImages("player", TOTAL_PLAYERS);
preloadImages("car", TOTAL_CARS);

function changeItem(type, direction) {
  if (type === "player") {
    playerIndex =
      (playerIndex + direction + TOTAL_PLAYERS) % TOTAL_PLAYERS;
  } else if (type === "car") {
    carIndex =
      (carIndex + direction + TOTAL_CARS) % TOTAL_CARS;
  } else {
    return;
  }

  updateItem(type);
}

function updateItem(type) {
  const isPlayer = type === "player";
  const index = isPlayer ? playerIndex : carIndex;
  const prefix = isPlayer ? "player" : "car";
  const imageId = isPlayer ? "playerBg" : "carBg";
  const image = document.getElementById(imageId);

  if (!image) return;

  const fileName = `${prefix}${index + 1}`;
  const cached = imageCache[fileName];

  if (cached && cached.complete && cached.naturalWidth > 0) {
    image.src = cached.src;
  } else {
    image.src = `images/${fileName}.png`;
  }
}

function selectItem(type) {
  if (type === "player") {
    selectedPlayer = playerIndex;
  } else if (type === "car") {
    selectedCar = carIndex;
  } else {
    return;
  }

  // Do not show a selection message.
  // Return to Garage without adding another history entry.
  screenHistory.length = 0;
  displayScreen("garage");
}

/* Series selection */
function chooseSeries(name, locked) {
  if (locked) {
    hideNotice();
    return;
  }

  screenHistory.length = 0;
  displayScreen("garage");
}

/* Messages */
let noticeTimer;

function showNotice(message) {
  hideNotice();
  if (!message) return;

  const notice = document.getElementById("notice");
  if (!notice) return;

  notice.textContent = message;
  notice.style.display = "block";
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
