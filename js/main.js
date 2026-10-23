
"use strict";

// ========================================
// Race Ka Raja: Rocket Buggy Racer
// Main JavaScript
// ========================================

const screens = document.querySelectorAll(".screen");
const screenHistory = [];

// ----------------------------------------
// Screen Management
// ----------------------------------------

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

  if (current && current.id === id) {
    return;
  }

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
      previous !== (current ? current.id : "") &&
      document.getElementById(previous)
    ) {
      displayScreen(previous);
      return;
    }
  }

  // Fallback screen
  if (document.getElementById("garage")) {
    displayScreen("garage");
  } else {
    displayScreen("home");
  }
}

// ----------------------------------------
// Loading Screen: 0% to 100%
// ----------------------------------------

let progress = 0;

const progressEl = document.getElementById("progress");
const percentEl = document.getElementById("loadPercent");

function startLoading() {
  const loadingScreen = document.getElementById("loading");

  if (!loadingScreen) {
    displayScreen("home");
    return;
  }

  progress = 0;

  if (progressEl) {
    progressEl.style.width = "0%";
  }

  if (percentEl) {
    percentEl.textContent = "Loading 0%";
  }

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

      setTimeout(() => {
        displayScreen("home");
      }, 400);
    }
  }, 35);
}

// ----------------------------------------
// Player and Car Selection
// ----------------------------------------

const TOTAL_PLAYERS = 6;
const TOTAL_CARS = 6;

let playerIndex = 0;
let carIndex = 0;

let selectedPlayer = 0;
let selectedCar = 0;

// Open Player Selection
function openPlayers() {
  playerIndex = selectedPlayer;
  updateItem("player");
  go("players");
}

// Open Car Selection
function openCars() {
  carIndex = selectedCar;
  updateItem("car");
  go("cars");
}

// Previous / Next Player or Car
function changeItem(type, direction) {
  if (type === "player") {
    playerIndex =
      (playerIndex + direction + TOTAL_PLAYERS) % TOTAL_PLAYERS;

    updateItem("player");
    return;
  }

  if (type === "car") {
    carIndex =
      (carIndex + direction + TOTAL_CARS) % TOTAL_CARS;

    updateItem("car");
  }
}

// Update the displayed image
function updateItem(type) {
  const isPlayer = type === "player";

  const index = isPlayer ? playerIndex : carIndex;
  const total = isPlayer ? TOTAL_PLAYERS : TOTAL_CARS;
  const prefix = isPlayer ? "player" : "car";
  const imageId = isPlayer ? "playerBg" : "carBg";

  const image = document.getElementById(imageId);

  if (!image) {
    console.error("Image element not found:", imageId);
    return;
  }

  // Keep the index within the available image range
  const safeIndex = ((index % total) + total) % total;

  if (isPlayer) {
    playerIndex = safeIndex;
  } else {
    carIndex = safeIndex;
  }

  const fileName = prefix + (safeIndex + 1);

  // Clear any previous error handler
  image.onerror = null;

  // Show a message if the image fails to load
  image.onerror = function () {
    showNotice(fileName + ".png इमेज लोड होत नाही.");
    console.error("Could not load image:", image.src);
  };

  // Update the image and refresh its URL to avoid stale cache
  image.src = "images/" + fileName + ".png?v=" + Date.now();
}

// Select Player or Car and return to Garage
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

// ----------------------------------------
// Choose Series
// ----------------------------------------

function chooseSeries(name, locked) {
  if (locked) {
    hideNotice();
    return;
  }

  displayScreen("garage");
}

// ----------------------------------------
// On-screen Notice
// ----------------------------------------

let noticeTimer = null;

function showNotice(message) {
  hideNotice();

  if (!message) {
    return;
  }

  const notice = document.getElementById("notice");

  if (!notice) {
    console.warn(message);
    return;
  }

  notice.textContent = message;
  notice.style.display = "block";

  noticeTimer = setTimeout(() => {
    hideNotice();
  }, 2500);
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

// ----------------------------------------
// Start Game
// ----------------------------------------

startLoading();
