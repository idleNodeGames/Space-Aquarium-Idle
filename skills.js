// skills.js
console.log('skills.js loaded successfully');

// Skill-related DOM elements
const specialFishChanceLevelDisplay = document.getElementById('specialFishChanceLevel');
const specialFishChancePercentDisplay = document.getElementById('specialFishChancePercent');
const specialFishChanceCostDisplay = document.getElementById('specialFishChanceCost');
const upgradeSpecialFishChanceButton = document.getElementById('upgradeSpecialFishChanceButton');

const autoFeederLevelDisplay = document.getElementById('autoFeederLevel');
const autoFeederPercentDisplay = document.getElementById('autoFeederPercent');
const autoFeederCostDisplay = document.getElementById('autoFeederCost');
const upgradeAutoFeederButton = document.getElementById('upgradeAutoFeederButton');

const higherMatingChanceLevelDisplay = document.getElementById('higherMatingChanceLevel');
const higherMatingChancePercentDisplay = document.getElementById('higherMatingChancePercent');
const higherMatingChanceCostDisplay = document.getElementById('higherMatingChanceCost');
const upgradeHigherMatingChanceButton = document.getElementById('upgradeHigherMatingChanceButton');

const higherSFChanceLevelDisplay = document.getElementById('higherSFChanceLevel');
const higherSFChancePercentDisplay = document.getElementById('higherSFChancePercent');
const higherSFChanceCostDisplay = document.getElementById('higherSFChanceCost');
const upgradeHigherSFChanceButton = document.getElementById('upgradeHigherSFChanceButton');

const shellAmplifierLevelDisplay = document.getElementById('shellAmplifierLevel');
const shellAmplifierPercentDisplay = document.getElementById('shellAmplifierPercent');
const shellAmplifierCostDisplay = document.getElementById('shellAmplifierCost');
const upgradeShellAmplifierButton = document.getElementById('upgradeShellAmplifierButton');

const cosmicGrowthBoosterLevelDisplay = document.getElementById('cosmicGrowthBoosterLevel');
const cosmicGrowthBoosterPercentDisplay = document.getElementById('cosmicGrowthBoosterPercent');
const cosmicGrowthBoosterCostDisplay = document.getElementById('cosmicGrowthBoosterCost');
const upgradeCosmicGrowthBoosterButton = document.getElementById('upgradeCosmicGrowthBoosterButton');

const cosmicMatingCharmLevelDisplay = document.getElementById('cosmicMatingCharmLevel');
const cosmicMatingCharmPercentDisplay = document.getElementById('cosmicMatingCharmPercent');
const cosmicMatingCharmCostDisplay = document.getElementById('cosmicMatingCharmCost');
const upgradeCosmicMatingCharmButton = document.getElementById('upgradeCosmicMatingCharmButton');

// Skills state
let specialFishChanceLevel = 0;
let autoFeederLevel = 0;
let higherMatingChanceLevel = 0;
let higherSFChanceLevel = 0;
let shellAmplifierLevel = 0;
let cosmicGrowthBoosterLevel = 0;
let cosmicMatingCharmLevel = 0;

const specialFishChanceLevels = [0, 5, 10, 15, 20, 25, 30];
const specialFishChanceCosts = [
    { shells: 500, prestige: 5 },
    { shells: 1000, prestige: 10 },
    { shells: 2000, prestige: 20 },
    { shells: 3000, prestige: 30 },
    { shells: 4000, prestige: 40 },
    { shells: 5000, prestige: 50 }
];
const autoFeederCosts = Array.from({ length: 25 }, (_, i) => ({
    shells: (i + 1) * 100,
    prestige: i + 1
}));
const higherMatingChanceLevels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];
const higherMatingChanceCosts = Array.from({ length: 9 }, (_, i) => ({
    shells: (i + 1) * 1000,
    prestige: (i + 1) * 10
}));
const higherSFChanceLevels = [0, 10, 20, 30, 40, 50];
const higherSFChanceCosts = Array.from({ length: 5 }, (_, i) => ({
    shells: (i + 1) * 2000,
    prestige: (i + 1) * 20
}));
const shellAmplifierLevels = [0, 10, 20, 30, 40, 50];
const shellAmplifierCosts = [100, 200, 300, 400, 500];
const cosmicGrowthBoosterLevels = [0, 5, 10, 15, 20, 25];
const cosmicGrowthBoosterCosts = [150, 300, 450, 600, 750];
const cosmicMatingCharmLevels = [0, 2, 4, 6, 8, 10];
const cosmicMatingCharmCosts = [200, 400, 600, 800, 1000];

// Update skills display
function updateSkillsDisplay(shells, prestigePoints, cosmicCoins) {
    specialFishChanceLevelDisplay.textContent = specialFishChanceLevel;
    specialFishChancePercentDisplay.textContent = `${specialFishChanceLevels[specialFishChanceLevel]}%`;
    if (specialFishChanceLevel < 6) {
        const cost = specialFishChanceCosts[specialFishChanceLevel];
        specialFishChanceCostDisplay.textContent = `${cost.shells} Shells + ${cost.prestige} Prestige`;
        upgradeSpecialFishChanceButton.disabled = shells < cost.shells || prestigePoints < cost.prestige;
    } else {
        specialFishChanceCostDisplay.textContent = 'Max Level';
        upgradeSpecialFishChanceButton.disabled = true;
    }

    autoFeederLevelDisplay.textContent = autoFeederLevel;
    autoFeederPercentDisplay.textContent = `${(autoFeederLevel * 0.1).toFixed(1)}%`;
    if (autoFeederLevel < 25) {
        const cost = autoFeederCosts[autoFeederLevel];
        autoFeederCostDisplay.textContent = `${cost.shells} Shells + ${cost.prestige} Prestige`;
        upgradeAutoFeederButton.disabled = shells < cost.shells || prestigePoints < cost.prestige;
    } else {
        autoFeederCostDisplay.textContent = 'Max Level';
        upgradeAutoFeederButton.disabled = true;
    }

    higherMatingChanceLevelDisplay.textContent = higherMatingChanceLevel;
    higherMatingChancePercentDisplay.textContent = `${higherMatingChanceLevels[higherMatingChanceLevel]}%`;
    if (higherMatingChanceLevel < 9) {
        const cost = higherMatingChanceCosts[higherMatingChanceLevel];
        higherMatingChanceCostDisplay.textContent = `${cost.shells} Shells + ${cost.prestige} Prestige`;
        upgradeHigherMatingChanceButton.disabled = shells < cost.shells || prestigePoints < cost.prestige;
    } else {
        higherMatingChanceCostDisplay.textContent = 'Max Level';
        upgradeHigherMatingChanceButton.disabled = true;
    }

    higherSFChanceLevelDisplay.textContent = higherSFChanceLevel;
    higherSFChancePercentDisplay.textContent = `${higherSFChanceLevels[higherSFChanceLevel]}%`;
    if (higherSFChanceLevel < 5) {
        const cost = higherSFChanceCosts[higherSFChanceLevel];
        higherSFChanceCostDisplay.textContent = `${cost.shells} Shells + ${cost.prestige} Prestige`;
        upgradeHigherSFChanceButton.disabled = shells < cost.shells || prestigePoints < cost.prestige;
    } else {
        higherSFChanceCostDisplay.textContent = 'Max Level';
        upgradeHigherSFChanceButton.disabled = true;
    }

    shellAmplifierLevelDisplay.textContent = shellAmplifierLevel;
    shellAmplifierPercentDisplay.textContent = `${shellAmplifierLevels[shellAmplifierLevel]}%`;
    if (shellAmplifierLevel < 5) {
        const cost = shellAmplifierCosts[shellAmplifierLevel];
        shellAmplifierCostDisplay.textContent = `${cost} Cosmic Coins`;
        upgradeShellAmplifierButton.disabled = cosmicCoins < cost;
    } else {
        shellAmplifierCostDisplay.textContent = 'Max Level';
        upgradeShellAmplifierButton.disabled = true;
    }

    cosmicGrowthBoosterLevelDisplay.textContent = cosmicGrowthBoosterLevel;
    cosmicGrowthBoosterPercentDisplay.textContent = `${cosmicGrowthBoosterLevels[cosmicGrowthBoosterLevel]}%`;
    if (cosmicGrowthBoosterLevel < 5) {
        const cost = cosmicGrowthBoosterCosts[cosmicGrowthBoosterLevel];
        cosmicGrowthBoosterCostDisplay.textContent = `${cost} Cosmic Coins`;
        upgradeCosmicGrowthBoosterButton.disabled = cosmicCoins < cost;
    } else {
        cosmicGrowthBoosterCostDisplay.textContent = 'Max Level';
        upgradeCosmicGrowthBoosterButton.disabled = true;
    }

    cosmicMatingCharmLevelDisplay.textContent = cosmicMatingCharmLevel;
    cosmicMatingCharmPercentDisplay.textContent = `${cosmicMatingCharmLevels[cosmicMatingCharmLevel]}%`;
    if (cosmicMatingCharmLevel < 5) {
        const cost = cosmicMatingCharmCosts[cosmicMatingCharmLevel];
        cosmicMatingCharmCostDisplay.textContent = `${cost} Cosmic Coins`;
        upgradeCosmicMatingCharmButton.disabled = cosmicCoins < cost;
    } else {
        cosmicMatingCharmCostDisplay.textContent = 'Max Level';
        upgradeCosmicMatingCharmButton.disabled = true;
    }
}

// Skill upgrade handlers
function setupSkillUpgrades(updateShellCounter, updateStatistics) {
    upgradeSpecialFishChanceButton.addEventListener('click', () => {
        if (specialFishChanceLevel >= 6) return;
        const cost = specialFishChanceCosts[specialFishChanceLevel];
        if (shells >= cost.shells && prestigePoints >= cost.prestige) {
            shells -= cost.shells;
            prestigePoints -= cost.prestige;
            specialFishChanceLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            console.log(`Upgraded Special Fish Chance to level ${specialFishChanceLevel} (${specialFishChanceLevels[specialFishChanceLevel]}%)`);
        }
    });

    upgradeAutoFeederButton.addEventListener('click', () => {
        if (autoFeederLevel >= 25) return;
        const cost = autoFeederCosts[autoFeederLevel];
        if (shells >= cost.shells && prestigePoints >= cost.prestige) {
            shells -= cost.shells;
            prestigePoints -= cost.prestige;
            autoFeederLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            console.log(`Upgraded Auto Feeder to level ${autoFeederLevel} (${(autoFeederLevel * 0.1).toFixed(1)}%)`);
        }
    });

    upgradeHigherMatingChanceButton.addEventListener('click', () => {
        if (higherMatingChanceLevel >= 9) return;
        const cost = higherMatingChanceCosts[higherMatingChanceLevel];
        if (shells >= cost.shells && prestigePoints >= cost.prestige) {
            shells -= cost.shells;
            prestigePoints -= cost.prestige;
            higherMatingChanceLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            updateStatistics();
            console.log(`Upgraded Higher Mating Chance to level ${higherMatingChanceLevel} (${higherMatingChanceLevels[higherMatingChanceLevel]}%)`);
        }
    });

    upgradeHigherSFChanceButton.addEventListener('click', () => {
        if (higherSFChanceLevel >= 5) return;
        const cost = higherSFChanceCosts[higherSFChanceLevel];
        if (shells >= cost.shells && prestigePoints >= cost.prestige) {
            shells -= cost.shells;
            prestigePoints -= cost.prestige;
            higherSFChanceLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            console.log(`Upgraded Higher SF Chance to level ${higherSFChanceLevel} (${higherSFChanceLevels[higherSFChanceLevel]}%)`);
        }
    });

    upgradeShellAmplifierButton.addEventListener('click', () => {
        if (shellAmplifierLevel >= 5) return;
        const cost = shellAmplifierCosts[shellAmplifierLevel];
        if (cosmicCoins >= cost) {
            cosmicCoins -= cost;
            shellAmplifierLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            console.log(`Upgraded Shell Amplifier to level ${shellAmplifierLevel} (${shellAmplifierLevels[shellAmplifierLevel]}%)`);
        }
    });

    upgradeCosmicGrowthBoosterButton.addEventListener('click', () => {
        if (cosmicGrowthBoosterLevel >= 5) return;
        const cost = cosmicGrowthBoosterCosts[cosmicGrowthBoosterLevel];
        if (cosmicCoins >= cost) {
            cosmicCoins -= cost;
            cosmicGrowthBoosterLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            console.log(`Upgraded Cosmic Growth Booster to level ${cosmicGrowthBoosterLevel} (${cosmicGrowthBoosterLevels[cosmicGrowthBoosterLevel]}%)`);
        }
    });

    upgradeCosmicMatingCharmButton.addEventListener('click', () => {
        if (cosmicMatingCharmLevel >= 5) return;
        const cost = cosmicMatingCharmCosts[cosmicMatingCharmLevel];
        if (cosmicCoins >= cost) {
            cosmicCoins -= cost;
            cosmicMatingCharmLevel++;
            updateShellCounter();
            updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
            updateStatistics();
            console.log(`Upgraded Cosmic Mating Charm to level ${cosmicMatingCharmLevel} (${cosmicMatingCharmLevels[cosmicMatingCharmLevel]}%)`);
        }
    });
}

// Getters for skill levels (for use in game logic)
function getSpecialFishChanceLevel() {
    return specialFishChanceLevels[specialFishChanceLevel];
}

function getAutoFeederLevel() {
    return autoFeederLevel;
}

function getHigherMatingChanceLevel() {
    return higherMatingChanceLevels[higherMatingChanceLevel];
}

function getHigherSFChanceLevel() {
    return higherSFChanceLevels[higherSFChanceLevel];
}

function getShellAmplifierLevel() {
    return shellAmplifierLevels[shellAmplifierLevel];
}

function getCosmicGrowthBoosterLevel() {
    return cosmicGrowthBoosterLevels[cosmicGrowthBoosterLevel];
}

function getCosmicMatingCharmLevel() {
    return cosmicMatingCharmLevels[cosmicMatingCharmLevel];
}

// Expose functions and variables
window.updateSkillsDisplay = updateSkillsDisplay;
window.setupSkillUpgrades = setupSkillUpgrades;
window.getSpecialFishChanceLevel = getSpecialFishChanceLevel;
window.getAutoFeederLevel = getAutoFeederLevel;
window.getHigherMatingChanceLevel = getHigherMatingChanceLevel;
window.getHigherSFChanceLevel = getHigherSFChanceLevel;
window.getShellAmplifierLevel = getShellAmplifierLevel;
window.getCosmicGrowthBoosterLevel = getCosmicGrowthBoosterLevel;
window.getCosmicMatingCharmLevel = getCosmicMatingCharmLevel;