
let screens = document.querySelectorAll(".screen");

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
  carIndex = 0;
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

/* Individual transparent arrow hit areas */
const arrowPositions = {
  car: [
    { prev: [29, 80, 7, 13], next: [65, 80, 7, 13] },
    { prev: [34, 80, 7, 13], next: [61, 80, 7, 13] },
    { prev: [57, 80, 7, 13], next: [91, 80, 7, 13] },
    { prev: [31, 83, 7, 13], next: [63, 83, 7, 13] },
    { prev: [58, 82, 7, 13], next: [92, 82, 7, 13] },
    { prev: [29, 80, 7, 13], next: [64, 80, 7, 13] }
  ],
  player: [
    { prev: [38, 78, 8, 14], next: [76, 78, 8, 14] },
    { prev: [36, 78, 8, 14], next: [76, 78, 8, 14] },
    { prev: [28, 78, 8, 14], next: [70, 78, 8, 14] },
    { prev: [29, 82, 8, 14], next: [68, 82, 8, 14] },
    { prev: [29, 82, 8, 14], next: [67, 82, 8, 14] },
    { prev: [28, 82, 8, 14], next: [67, 82, 8, 14] }
  ]
};

function positionArrows(type, index) {
  const positions = arrowPositions[type][index];
  const prefix = type === "car" ? "car" : "player";

  [["Prev", positions.prev], ["Next", positions.next]]
    .forEach(([suffix, values]) => {
      const button = document.getElementById(prefix + suffix);
      if (!button) return;

      const [left, top, width, height] = values;
      button.style.left = left + "%";
      button.style.top = top + "%";
      button.style.width = width + "%";
      button.style.height = height + "%";
      button.style.bottom = "auto";
      button.style.zIndex = "10";
    });
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
  positionArrows(type, index);
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
    showNotice(`${name} Series is currently locked.`);
    return;
  }

  const seriesImages = {
    Village: "images/village-level-screens.png",
    City: "images/city-level-screens.png",
    Mountain: "images/mountain-level-screens.png",
    Desert: "images/desert-level-screens.png",
    Forest: "images/forest-level-screens.png"
  };

  const imagePath = seriesImages[name];

  if (!imagePath) {
    showNotice("Series not found.");
    return;
  }

  showSeriesScreen(imagePath, name);
}
function showSeriesScreen(imagePath, name) {
  let seriesScreen = document.getElementById("seriesLevels");

  if (!seriesScreen) {
    seriesScreen = document.createElement("section");
    seriesScreen.id = "seriesLevels";
    seriesScreen.className = "screen";

    const image = document.createElement("img");
    image.id = "seriesLevelImage";
    image.className = "bg";
    image.alt = "Series Levels";

    seriesScreen.appendChild(image);

    const backButton = document.createElement("button");
    backButton.className = "hit";
    backButton.setAttribute("aria-label", "Back");
    backButton.style.cssText =
      "left:0;top:0;width:10%;height:20%;";
    backButton.onclick = backScreen;

    seriesScreen.appendChild(backButton);

    document.body.appendChild(seriesScreen);
    screens = document.querySelectorAll(".screen");
  }

  const image = document.getElementById("seriesLevelImage");

  image.onerror = () => {
    showNotice(`Image not found: ${imagePath}`);
  };

  image.onload = () => {
    hideNotice();
  };

  image.src = imagePath;
  go("seriesLevels");
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
