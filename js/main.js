
"use strict";

// ========================================
// Race Ka Raja: Rocket Buggy Racer
// ========================================

const screens = document.querySelectorAll(".screen");
const screenHistory = [];

const TOTAL_PLAYERS = 6;
const TOTAL_CARS = 6;

let playerIndex = 0;
let carIndex = 0;
let selectedPlayer = 0;
let selectedCar = 0;

let noticeTimer = null;

// ========================================
// SCREEN MANAGEMENT
// ========================================

function displayScreen(id) {
  const target = document.getElementById(id);

  if (!target) {
    console.error("Screen not found:", id);
    return;
  }

  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === id);
  });

  hideNotice();
}

function go(id) {
  const target = document.getElementById(id);
  const current = document.querySelector(".screen.active");

  if (!target) {
    console.error("Screen not found:", id);
    return;
  }

  if (current && current.id === id) return;

  if (current && current.id !== "loading") {
    screenHistory.push(current.id);
  }

  displayScreen(id);
}

function backScreen() {
  while (screenHistory.length > 0) {
    const previous = screenHistory.pop();

    if (document.getElementById(previous)) {
      displayScreen(previous);
      return;
    }
  }

  displayScreen("home");
}

// ========================================
// LOADING SCREEN
// ========================================

function startLoading() {
  const progressEl = document.getElementById("progress");
  const percentEl = document.getElementById("loadPercent");

  if (!document.getElementById("loading")) {
    displayScreen("home");
    return;
  }

  let progress = 0;

  if (progressEl) progressEl.style.width = "0%";
  if (percentEl) percentEl.textContent = "Loading 0%";

  const loader = setInterval(() => {
    progress = Math.min(progress + 1, 100);

    if (progressEl) {
      progressEl.style.width = progress + "%";
    }

    if (percentEl) {
      percentEl.textContent = "Loading " + progress + "%";
    }

    if (progress >= 100) {
      clearInterval(loader);
      screenHistory.length = 0;

      setTimeout(() => displayScreen("home"), 400);
    }
  }, 35);
}

// ========================================
// PRELOAD IMAGES
// ========================================

const imageCache = {};

function preloadImages(prefix, total) {
  for (let i = 1; i <= total; i++) {
    const name = prefix + i;
    const img = new Image();

    img.onload = function () {
      console.log("Image ready:", name);
    };

    img.onerror = function () {
      console.error("Image failed to load:", name + ".png");
    };

    img.src = "images/" + name + ".png";
    imageCache[name] = img;
  }
}

// Start loading all player and car images
preloadImages("player", TOTAL_PLAYERS);
preloadImages("car", TOTAL_CARS);

// ========================================
// OPEN PLAYER / CAR SELECTION
// ========================================

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

// ========================================
// NEXT / PREVIOUS
// ========================================

function changeItem(type, direction) {
  const step = Number(direction);

  if (step !== 1 && step !== -1) return;

  if (type === "car") {
    // Car 1 + Previous returns to Garage
    if (step === -1 && carIndex === 0) {
      returnToGarage();
      return;
    }

    carIndex = (carIndex + step + TOTAL_CARS) % TOTAL_CARS;
    updateItem("car");
    return;
  }

  if (type === "player") {
    // Player 1 + Previous returns to Garage
    if (step === -1 && playerIndex === 0) {
      returnToGarage();
      return;
    }

    playerIndex = (playerIndex + step + TOTAL_PLAYERS) % TOTAL_PLAYERS;
    updateItem("player");
  }
}

// ========================================
// RETURN TO GARAGE / MENU
// ========================================

function returnToGarage() {
  // Remove the selection screen's history entry if it points to Garage
  if (
    screenHistory.length > 0 &&
    screenHistory[screenHistory.length - 1] === "garage"
  ) {
    screenHistory.pop();
  }

  displayScreen("garage");
}

// ========================================
// UPDATE IMAGE
// ========================================

function updateItem(type) {
  const isCar = type === "car";
  const isPlayer = type === "player";

  if (!isCar && !isPlayer) return;

  const index = isCar ? carIndex : playerIndex;
  const prefix = isCar ? "car" : "player";
  const imageId = isCar ? "carBg" : "playerBg";
  const image = document.getElementById(imageId);

  if (!image) {
    console.error("Image element not found:", imageId);
    showNotice("इमेज दाखवण्याची जागा सापडली नाही.");
    return;
  }

  const total = isCar ? TOTAL_CARS : TOTAL_PLAYERS;
  const safeIndex = ((index % total) + total) % total;
  const fileName = prefix + (safeIndex + 1);
  const cachedImage = imageCache[fileName];

  if (isCar) carIndex = safeIndex;
  if (isPlayer) playerIndex = safeIndex;

  image.onerror = function () {
    showNotice(fileName + ".png लोड होत नाही. GitHub वरील फाइल तपासा.");
  };

  image.onload = null;

  if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
    image.src = cachedImage.src;
  } else {
    image.src = "images/" + fileName + ".png";
  }
}

// ========================================
// SELECT PLAYER / CAR
// ========================================

function selectItem(type) {
  if (type === "player") {
    selectedPlayer = playerIndex;
  } else if (type === "car") {
    selectedCar = carIndex;
  } else {
    return;
  }

  returnToGarage();
}

// ========================================
// CHOOSE SERIES
// ========================================

function chooseSeries(name, locked) {
  if (locked) {
    hideNotice();
    return;
  }

  returnToGarage();
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotice(message) {
  hideNotice();

  const notice = document.getElementById("notice");

  if (!notice) {
    console.warn(message);
    return;
  }

  notice.textContent = message;
  notice.style.display = "block";

  noticeTimer = setTimeout(hideNotice, 3000);
}

function hideNotice() {
  const notice = document.getElementById("notice");

  if (notice) {
    notice.style.display = "none";
    notice.textContent = "";
  }

  if (noticeTimer !== null) {
    clearTimeout(noticeTimer);
    noticeTimer = null;
  }
}

// ========================================
// START GAME
// ========================================

startLoading();
