
const screens = document.querySelectorAll(".screen");

/* Screen navigation history */
let screenHistory = [];
let noticeTimer;

function go(id) {
  const current = document.querySelector(".screen.active");

  if (current && current.id !== id) {
    screenHistory.push(current.id);
  }

  showScreen(id);
}

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });

  hideNotice();
}

function backScreen() {
  const current = document.querySelector(".screen.active");

  if (current && (current.id === "players" || current.id === "cars")) {
    go("garage");
    return;
  }

  const previous = screenHistory.pop();

  if (previous && document.getElementById(previous)) {
    // Avoid adding the current screen back to history.
    showScreen(previous);
  } else if (current && current.id === "garage") {
    showScreen("adventure");
  } else if (current && current.id === "adventure") {
    showScreen("home");
  } else {
    showScreen("garage");
  }
}

/* Loading bar */
let progress = 0;
const progressEl = document.getElementById("progress");
const percentEl = document.getElementById("loadPercent");

const loader = setInterval(() => {
  progress = Math.min(100, progress + 1);

  if (progressEl) progressEl.style.width = progress + "%";
  if (percentEl) percentEl.textContent = "Loading " + progress + "%";

  if (progress >= 100) {
    clearInterval(loader);
    setTimeout(() => showScreen("home"), 400);
  }
}, 35);

/* Player and car selection */
let playerIndex = 0;
let carIndex = 0;
let selectedPlayer = 0;
let selectedCar = 0;

/* Preload selection images in the background */
const imageCache = {};

function preloadImages() {
  const paths = [];

  for (let i = 1; i <= 6; i++) {
    paths.push(`images/player${i}.png`);
    paths.push(`images/car${i}.png`);
  }

  paths.push("images/menu-player1.png");

  paths.forEach((path) => {
    const img = new Image();
    imageCache[path] = img;
    img.src = path;
  });
}

preloadImages();

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

/* Next and Previous */
function changeItem(type, direction) {
  if (type === "player") {
    if (direction < 0 && playerIndex === 0) {
      go("garage");
      return;
    }

    playerIndex = (playerIndex + direction + 6) % 6;
  } else if (type === "car") {
    if (direction < 0 && carIndex === 0) {
      go("garage");
      return;
    }

    carIndex = (carIndex + direction + 6) % 6;
  } else {
    return;
  }

  updateItem(type);
}

/* Change image and report missing files */
function updateItem(type) {
  const isPlayer = type === "player";
  const index = isPlayer ? playerIndex : carIndex;
  const imageId = isPlayer ? "playerBg" : "carBg";
  const path = `images/${isPlayer ? "player" : "car"}${index + 1}.png`;
  const image = document.getElementById(imageId);

  if (!image) {
    showNotice(`HTML मध्ये ${imageId} image सापडली नाही.`);
    return;
  }

  image.onerror = () => {
    showNotice(`फोटो लोड होत नाही: ${path}`);
    console.error("Image failed to load:", path);
  };

  image.onload = () => {
    hideNotice();
  };

  // Use the same path as the files in the images folder.
  image.src = path;
}

/* Select current player or car */
function selectItem(type) {
  if (type === "player") {
    selectedPlayer = playerIndex;
  } else if (type === "car") {
    selectedCar = carIndex;
  } else {
    return;
  }

  go("garage");
}

/* Series selection */
function chooseSeries(name, locked) {
  if (locked) {
    showNotice(`${name} Series सध्या लॉक आहे.`);
    return;
  }

  go("garage");
}

/* Notifications */
function showNotice(message) {
  const notice = document.getElementById("notice");
  if (!notice) return;

  notice.textContent = message;
  notice.style.display = "block";

  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(hideNotice, 3000);
}

function hideNotice() {
  const notice = document.getElementById("notice");

  if (notice) {
    notice.style.display = "none";
    notice.textContent = "";
  }

  clearTimeout(noticeTimer);
    }
