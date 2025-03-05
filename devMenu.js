// Dev Menu functions for Idle Aquarium (Version 3.47)
const addShellsButton = document.getElementById('addShellsButton');
const addPrestigeButton = document.getElementById('addPrestigeButton');
const speed2xButton = document.getElementById('speed2xButton');
const speed5xButton = document.getElementById('speed5xButton');
const alwaysFedButton = document.getElementById('alwaysFedButton');
const spawnSpecialFishButton = document.getElementById('spawnSpecialFishButton');

// Dev Menu state
let gameSpeed = 1;
let isSpeed2xActive = false;
let isSpeed5xActive = false;
let isAlwaysFedActive = false;
const defaultInterval = 50;
let gameLoopInterval = null;

// Exported functions for game.js to access
window.getGameSpeed = () => gameSpeed;
window.isAlwaysFed = () => isAlwaysFedActive;

// Dev Menu: Add shells
addShellsButton.addEventListener('click', () => {
    window.modifyShells(100);
    console.log('Added 100 shells');
});

// Dev Menu: Add Prestige Points
addPrestigeButton.addEventListener('click', () => {
    window.modifyPrestige(100);
    console.log('Added 100 Prestige Points');
});

// Dev Menu: Toggle Speed 2x
speed2xButton.addEventListener('click', () => {
    if (isSpeed2xActive) {
        isSpeed2xActive = false;
        gameSpeed = 1;
        speed2xButton.classList.remove('active');
    } else {
        isSpeed2xActive = true;
        isSpeed5xActive = false;
        gameSpeed = 2;
        speed2xButton.classList.add('active');
        speed5xButton.classList.remove('active');
    }
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(window.gameLoop, defaultInterval / gameSpeed);
    console.log(`Game speed set to ${gameSpeed}x`);
});

// Dev Menu: Toggle Speed 5x
speed5xButton.addEventListener('click', () => {
    if (isSpeed5xActive) {
        isSpeed5xActive = false;
        gameSpeed = 1;
        speed5xButton.classList.remove('active');
    } else {
        isSpeed5xActive = true;
        isSpeed2xActive = false;
        gameSpeed = 5;
        speed5xButton.classList.add('active');
        speed2xButton.classList.remove('active');
    }
    clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(window.gameLoop, defaultInterval / gameSpeed);
    console.log(`Game speed set to ${gameSpeed}x`);
});

// Dev Menu: Toggle Always Fed
alwaysFedButton.addEventListener('click', () => {
    if (isAlwaysFedActive) {
        isAlwaysFedActive = false;
        alwaysFedButton.classList.remove('active');
    } else {
        isAlwaysFedActive = true;
        alwaysFedButton.classList.add('active');
    }
    console.log(`Always Fed set to ${isAlwaysFedActive}`);
});

// Dev Menu: Spawn Special Fish
spawnSpecialFishButton.addEventListener('click', () => {
    window.spawnSpecialFish();
});