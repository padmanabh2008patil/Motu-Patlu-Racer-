// ===============================
// MOTU-PATLU-RACER GAME
// ===============================

let selectedCharacter = "";

const characters = {
    Motu: {
        unlocked: true,
        emoji: "🏎️",
        unlockLevel: 0
    },

    Patlu: {
        unlocked: false,
        emoji: "🚗",
        unlockLevel: 5
    },

    "Dr. Jhatka": {
        unlocked: false,
        emoji: "🚙",
        unlockLevel: 10
    },

    Singham: {
        unlocked: false,
        emoji: "🚓",
        unlockLevel: 15
    },

    Don: {
        unlocked: false,
        emoji: "🏁",
        unlockLevel: 20
    }
};


// ===============================
// SELECT CHARACTER
// ===============================

function selectCharacter(name) {

    const character = characters[name];

    if (!character.unlocked) {

        alert(
            name +
            " is locked!\nComplete Level " +
            character.unlockLevel +
            " to unlock this racer."
        );

        return;
    }

    selectedCharacter = name;

    document.querySelectorAll(".character-card").forEach(card => {
        card.classList.remove("selected");
    });

    const selectedCard = document.getElementById(name);

    if (selectedCard) {
        selectedCard.classList.add("selected");
    }

    console.log("Selected Racer:", name);
}


// ===============================
// START GAME
// ===============================

function startGame() {

    if (selectedCharacter === "") {

        alert("Please select a racer first!");

        return;
    }

    // Save selected racer
    localStorage.setItem(
        "selectedCharacter",
        selectedCharacter
    );

    // Start Level 1
    localStorage.setItem(
        "currentLevel",
        "1"
    );

    // Open racing screen
    window.location.href = "race.html";
}


// ===============================
// UNLOCK SYSTEM
// ===============================

function checkUnlocks(completedLevel) {

    for (let name in characters) {

        if (
            !characters[name].unlocked &&
            completedLevel >= characters[name].unlockLevel
        ) {

            characters[name].unlocked = true;

            localStorage.setItem(
                name + "_unlocked",
                "true"
            );

            alert(
                "🎉 New Racer Unlocked!\n\n" +
                name
            );
        }
    }
}


// ===============================
// LOAD SAVED UNLOCKS
// ===============================

function loadUnlocks() {

    for (let name in characters) {

        const saved =
            localStorage.getItem(name + "_unlocked");

        if (saved === "true") {
            characters[name].unlocked = true;
        }
    }
}


// ===============================
// GAME START
// ===============================

window.onload = function () {

    loadUnlocks();

    console.log(
        "🏎️ Motu-Patlu-Racer Loaded!"
    );

};
