
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
  const current = document.querySelector(".screen.active");

  while (screenHistory.length > 0) {
    const previous = screenHistory.pop();

    if (
      document.getElementById(previous) &&
      (!current || previous !== current.id)
    ) {
      displayScreen(previous);
      return;
    }
  }

  displayScreen("garage");
}

// ========================================
// LOADING SCREEN
// ========================================

function startLoading() {
  const loadingScreen = document.getElementById("loading");
  const progressEl = document.getElementById("progress");
  const percentEl = document.getElementById("loadPercent");

  if (!loadingScreen) {
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
// OPEN PLAYER AND CAR SELECTION
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
// PREVIOUS / NEXT
// ========================================

function changeItem(type, direction) {
  const step = Number(direction);

  if (step !== 1 && step !== -1) return;

  if (type === "car") {
    carIndex = (carIndex + step + TOTAL_CARS) % TOTAL_CARS;
    updateItem("car");
    return;
  }

  if (type === "player") {
    playerIndex = (playerIndex + step + TOTAL_PLAYERS) % TOTAL_PLAYERS;
    updateItem("player");
  }
}

// ========================================
// CHANGE IMAGE
// ========================================

function updateItem(type) {
  const isCar = type === "car";
  const isPlayer = type === "player";

  if (!isCar && !isPlayer) return;

  const total = isCar ? TOTAL_CARS : TOTAL_PLAYERS;
  const index = isCar ? carIndex : playerIndex;
  const prefix = isCar ? "car" : "player";
  const imageId = isCar ? "carBg" : "playerBg";
  const image = document.getElementById(imageId);

  if (!image) {
    console.error("Missing image element:", imageId);
    showNotice("इमेज दाखवण्याची जागा सापडली नाही.");
    return;
  }

  const safeIndex = ((index % total) + total) % total;
  const fileName = prefix + (safeIndex + 1) + ".png";

  if (isCar) carIndex = safeIndex;
  if (isPlayer) playerIndex = safeIndex;

  // Remove old error handler
  image.onerror = null;

  // Report missing images
  image.onerror = function () {
    showNotice(fileName + " लोड होत नाही. GitHub वरील फाइल तपासा.");
    console.error("Image failed to load:", image.src);
  };

  // Force the browser to request the current image URL
  image.src = "images/" + fileName + "?v=" + Date.now();

  console.log("Showing image:", fileName);
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

  displayScreen("garage");
}

// ========================================
// SERIES
// ========================================

function chooseSeries(name, locked) {
  if (locked) {
    hideNotice();
    return;
  }

  displayScreen("garage");
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

  noticeTimer = setTimeout(() => {
    hideNotice();
  }, 3000);
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
// START
// ========================================

startLoading();
