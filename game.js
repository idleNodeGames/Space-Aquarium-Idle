// Version 3.58: Restore Hunger naming, adjust decay rate to 0.048
console.log('game.js loaded successfully');

window.onload = () => {
    console.log('window.onload triggered');

    const introScreen = document.getElementById('introScreen');
    const introStory = document.getElementById('introStory');
    const startGameButton = document.getElementById('startGameButton');
    const gameContainer = document.getElementById('gameContainer');
    const canvas = document.getElementById('aquariumCanvas');
    const ctx = canvas.getContext('2d');
    const cleanButton = document.getElementById('cleanButton');
    const feedButton = document.getElementById('feedButton');
    const buyRedButton = document.getElementById('buyRedButton');
    const buyBlueButton = document.getElementById('buyBlueButton');
    const buyYellowButton = document.getElementById('buyYellowButton');
    const toggleMaturityButton = document.getElementById('toggleMaturityButton');
    const statisticsButton = document.getElementById('statisticsButton');
    const statisticsOverlay = document.getElementById('statisticsOverlay');
    const closeStatisticsButton = document.getElementById('closeStatisticsButton');
    const shellCounter = document.getElementById('shellCounter');
    const prestigeCounter = document.getElementById('prestigeCounter');
    const cosmicCoinCounter = document.getElementById('cosmicCoinCounter');
    const hungerBar = document.getElementById('hungerBar');
    const hungerText = document.getElementById('hungerText');
    const hungerContainer = document.getElementById('hungerContainer');
    const sellColorSelect = document.getElementById('sellColorSelect');
    const sell1Button = document.getElementById('sell1Button');
    const sell3Button = document.getElementById('sell3Button');
    const sell5Button = document.getElementById('sell5Button');
    const sellAllButton = document.getElementById('sellAllButton');
    const sellFishButton = document.getElementById('sellFishButton');
    const toggleSoundButton = document.getElementById('toggleSoundButton');
    const toggleTipsButton = document.getElementById('toggleTipsButton');
    const tankList = document.getElementById('tankList');
    const gameTip = document.getElementById('gameTip');
    const tipContainer = document.getElementById('tipContainer');
    const firstBabyFishSplash = document.getElementById('firstBabyFishSplash');
    const firstSpecialFishSplash = document.getElementById('firstSpecialFishSplash');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Game state
    let shells = 0;
    let prestigePoints = 0;
    let cosmicCoins = 0;
    let baseMatingChance = 0.2;
    let showMaturity = false;
    let selectedSellNumber = 1;
    let hasFirstBabyFish = false;
    let hasFirstSpecialFish = false;
    let isSoundOn = true;
    let areTipsOn = true;

    // Current tank state
    let currentTank = tanks[0];

    let colorsUnlocked = ['#ff0000', '#0000ff', '#ffff00'];
    let fishCosts = {
        '#ff0000': { base: 10, increment: 1, current: 10 },
        '#0000ff': { base: 20, increment: 2, current: 20 },
        '#ffff00': { base: 30, increment: 3, current: 30 }
    };
    const feedCost = 1;
    const defaultInterval = 50;
    let gameLoopInterval = null;

    // Tips for in-game
    const tips = [
        "Click the tank to attract fish!",
        "Special Fish produce Cosmic Coins over time.",
        "Upgrade Higher Mating Chance to spawn more fish.",
        "Sell fully mature fish to earn Prestige Points.",
        "The Vertical Tank increases Cosmic Coin production by 10%.",
        "Use Cosmic Coins to buy powerful upgrades!"
    ];
    let currentTipIndex = 0;
    let tipTimer = 0;

    // Toggle sound button logic
    toggleSoundButton.addEventListener('click', () => {
        if (isSoundOn) {
            backgroundMusic.pause();
            toggleSoundButton.textContent = 'Toggle Sound: Off';
            isSoundOn = false;
        } else {
            backgroundMusic.play().catch(error => {
                console.log('Background music playback failed:', error);
            });
            toggleSoundButton.textContent = 'Toggle Sound: On';
            isSoundOn = true;
        }
    });

    // Toggle tips button logic
    toggleTipsButton.addEventListener('click', () => {
        if (areTipsOn) {
            tipContainer.style.display = 'none';
            toggleTipsButton.textContent = 'Toggle Tips: Off';
            areTipsOn = false;
        } else {
            tipContainer.style.display = 'block';
            toggleTipsButton.textContent = 'Toggle Tips: On';
            areTipsOn = true;
        }
    });

    startGameButton.addEventListener('click', () => {
        introScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        const trackIndex = Math.floor(Math.random() * 2);
        backgroundMusic.src = `music/space-aquarium-idle-BgSound-0${trackIndex + 1}.mp3`;
        backgroundMusic.play().catch(error => {
            console.log('Background music playback failed:', error);
        });
        gameLoopInterval = setInterval(gameLoop, defaultInterval / getGameSpeed());
        showRandomTip(gameTip);
    });

    // Pop-up menu logic
    const sectionHeaders = document.querySelectorAll('.sectionHeader');
    const popups = document.querySelectorAll('.popupOverlay');
    const closePopupButtons = document.querySelectorAll('.closePopupButton');
    let lastOpenedPopup = null;
    let parentPopup = null;

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-target');
            const targetPopup = document.getElementById(targetId);

            if (lastOpenedPopup && lastOpenedPopup !== targetPopup && !parentPopup) {
                lastOpenedPopup.classList.remove('active');
            }

            if (targetPopup.classList.contains('active')) {
                targetPopup.classList.remove('active');
                lastOpenedPopup = parentPopup;
                parentPopup = null;
            } else {
                targetPopup.classList.add('active');
                lastOpenedPopup = targetPopup;

                if (targetId === 'sellFishPopup') {
                    updateSellColorOptions();
                } else if (targetId === 'tankManagementPopup') {
                    updateBuyButtons();
                } else if (targetId === 'skillsPopup') {
                    updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
                } else if (targetId === 'tankSelectionPopup') {
                    updateTankList();
                }
            }
        });
    });

    closePopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popupOverlay');
            popup.classList.remove('active');
            if (popup === lastOpenedPopup) {
                lastOpenedPopup = parentPopup;
                parentPopup = null;
            }
        });
    });

    gameContainer.addEventListener('click', (event) => {
        if (lastOpenedPopup && !lastOpenedPopup.contains(event.target) && !event.target.classList.contains('sectionHeader')) {
            lastOpenedPopup.classList.remove('active');
            lastOpenedPopup = parentPopup;
            parentPopup = null;
        }
    });

    let tankListNeedsUpdate = true;
    let lastTankListState = null;
    function updateTankList() {
        const currentState = JSON.stringify(tanks.map(tank => ({
            id: tank.id,
            owned: tank.owned,
            shells: shells,
            prestigePoints: prestigePoints,
            currentTankId: currentTank.id
        })));
        if (currentState === lastTankListState && !tankListNeedsUpdate) {
            return;
        }
        lastTankListState = currentState;
        tankListNeedsUpdate = false;

        tankList.innerHTML = '';
        tanks.forEach(tank => {
            const tankDiv = document.createElement('div');
            if (tank.owned) {
                const tankButton = document.createElement('button');
                tankButton.className = 'tankButton';
                tankButton.textContent = tank.name;
                tankButton.addEventListener('click', () => {
                    currentTank = switchTank(tank.id, currentTank, canvas, hungerContainer, updateHungerBar, updateStatistics, updateSellColorOptions);
                    tankListNeedsUpdate = true;
                    updateTankList();
                });
                if (currentTank.id === tank.id) {
                    tankButton.classList.add('active');
                }
                tankDiv.appendChild(tankButton);
            } else {
                const tankInfo = document.createElement('p');
                tankInfo.textContent = `${tank.name}: ${tank.cost.shells} Shells + ${tank.cost.prestige} Prestige`;
                const buyButton = document.createElement('button');
                buyButton.className = 'menuButton';
                buyButton.textContent = 'Buy';
                buyButton.disabled = shells < tank.cost.shells || prestigePoints < tank.cost.prestige;
                buyButton.addEventListener('click', () => {
                    if (shells >= tank.cost.shells && prestigePoints >= tank.cost.prestige) {
                        shells -= tank.cost.shells;
                        prestigePoints -= tank.cost.prestige;
                        tank.owned = true;
                        updateShellCounter();
                        tankListNeedsUpdate = true;
                        updateTankList();
                        console.log(`Purchased ${tank.name}`);
                    } else {
                        console.error(`Cannot purchase ${tank.name}: Insufficient resources. Need ${tank.cost.shells} Shells and ${tank.cost.prestige} Prestige, but have ${shells} Shells and ${prestigePoints} Prestige.`);
                    }
                });
                tankDiv.appendChild(tankInfo);
                tankDiv.appendChild(buyButton);
            }
            tankList.appendChild(tankDiv);
        });
    }

    const colorNames = {
        '#ff0000': 'Red',
        '#0000ff': 'Blue',
        '#ffff00': 'Yellow',
        '#800080': 'Purple',
        '#ff8000': 'Orange',
        '#008000': 'Green',
        '#b30059': 'Red-Purple',
        '#ff4040': 'Red-Orange',
        '#4b0082': 'Blue-Purple',
        '#006666': 'Blue-Green',
        '#ffbf00': 'Yellow-Orange',
        '#80c000': 'Yellow-Green'
    };

    function updateSellColorOptions() {
        console.log('Updating sell color options...');
        console.log('Fish list for current tank:', currentTank.fishList.map(fish => ({ color: fish.color, isSpecial: fish.isSpecial, effect: fish.effect, maturity: fish.maturity })));
        
        const currentSelectedValue = sellColorSelect.value;

        while (sellColorSelect.firstChild) {
            sellColorSelect.removeChild(sellColorSelect.firstChild);
        }

        const fullyMatureFish = currentTank.fishList.filter(fish => fish.maturity >= 100);
        console.log('Fully mature fish:', fullyMatureFish.map(fish => ({ color: fish.color, isSpecial: fish.isSpecial, effect: fish.effect, maturity: fish.maturity })));
        
        const colorsInTank = [...new Set(fullyMatureFish.map(fish => fish.color))];
        console.log('Colors in tank (fully mature):', colorsInTank);
        
        if (colorsInTank.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No mature fish available';
            sellColorSelect.appendChild(option);
            updateSellNumberButtons(0);
            return;
        }

        colorsInTank.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            const colorName = colorNames[color] || `Mixed (${color})`;
            option.innerHTML = `${colorName} <span class="fish-icon" style="color: ${color};">🐟</span>`;
            sellColorSelect.appendChild(option);
        });

        if (currentSelectedValue && colorsInTank.includes(currentSelectedValue)) {
            sellColorSelect.value = currentSelectedValue;
        } else {
            sellColorSelect.value = colorsInTank[0];
        }

        const selectedColor = sellColorSelect.value;
        const fishCount = currentTank.fishList.filter(fish => fish.color === selectedColor && fish.maturity >= 100).length;
        updateSellNumberButtons(fishCount);
    }

    sellColorSelect.addEventListener('change', () => {
        console.log('Selected color changed to:', sellColorSelect.value);
        const selectedColor = sellColorSelect.value;
        const fishCount = currentTank.fishList.filter(fish => fish.color === selectedColor && fish.maturity >= 100).length;
        updateSellNumberButtons(fishCount);
    });

    function updateBuyButtons() {
        buyRedButton.innerHTML = `Buy Red (${fishCosts['#ff0000'].current} Shells) <svg width="12" height="12" style="vertical-align: middle; margin-left: 5px;"><rect x="0" y="4" width="6" height="4" fill="#ff0000" /><polygon points="6,4 9,2 9,6 6,4" fill="#ff0000" /></svg>`;
        buyBlueButton.innerHTML = `Buy Blue (${fishCosts['#0000ff'].current} Shells) <svg width="12" height="12" style="vertical-align: middle; margin-left: 5px;"><rect x="0" y="4" width="6" height="4" fill="#0000ff" /><polygon points="6,4 9,2 9,6 6,4" fill="#0000ff" /></svg>`;
        buyYellowButton.innerHTML = `Buy Yellow (${fishCosts['#ffff00'].current} Shells) <svg width="12" height="12" style="vertical-align: middle; margin-left: 5px;"><rect x="0" y="4" width="6" height="4" fill="#ffff00" /><polygon points="6,4 9,2 9,6 6,4" fill="#ffff00" /></svg>`;
    }

    function updateSellNumberButtons(maxFish) {
        console.log(`Updating sell number buttons: maxFish = ${maxFish}`);
        const buttons = [sell1Button, sell3Button, sell5Button, sellAllButton];
        buttons.forEach(button => {
            const value = button.id === 'sellAllButton' ? maxFish : parseInt(button.textContent);
            if (value > maxFish) {
                button.disabled = true;
                button.classList.remove('active');
            } else {
                button.disabled = false;
            }
        });
        if (selectedSellNumber > maxFish) {
            selectedSellNumber = 1;
            deactivateAllSellButtons();
            if (maxFish >= 1) {
                sell1Button.classList.add('active');
            }
        }
        if (maxFish === 0) {
            selectedSellNumber = 0;
            deactivateAllSellButtons();
        }
    }

    function deactivateAllSellButtons() {
        sell1Button.classList.remove('active');
        sell3Button.classList.remove('active');
        sell5Button.classList.remove('active');
        sellAllButton.classList.remove('active');
    }

    sell1Button.addEventListener('click', () => {
        deactivateAllSellButtons();
        sell1Button.classList.add('active');
        selectedSellNumber = 1;
    });

    sell3Button.addEventListener('click', () => {
        deactivateAllSellButtons();
        sell3Button.classList.add('active');
        selectedSellNumber = 3;
    });

    sell5Button.addEventListener('click', () => {
        deactivateAllSellButtons();
        sell5Button.classList.add('active');
        selectedSellNumber = 5;
    });

    sellAllButton.addEventListener('click', () => {
        const selectedColor = sellColorSelect.value;
        const fishCount = currentTank.fishList.filter(fish => fish.color === selectedColor && fish.maturity >= 100).length;
        deactivateAllSellButtons();
        sellAllButton.classList.add('active');
        selectedSellNumber = fishCount;
    });

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        currentTank.attractPoint = { x, y };
        setTimeout(() => {
            currentTank.attractPoint = null;
        }, 5000 / getGameSpeed());
    });

    function updateHungerBar() {
        if (isAlwaysFed()) {
            currentTank.hunger = 100;
        } else {
            const autoFeederEffect = getAutoFeederLevel() * 0.1 * (50 / 1000) * getGameSpeed();
            currentTank.hunger += autoFeederEffect;
            const baseDecayRate = 0.048 * (50 / 1000) * getGameSpeed(); // Adjusted from 0.1 to 0.048
            const decayRate = baseDecayRate * currentTank.fishList.length;
            currentTank.hunger -= decayRate;
        }
        currentTank.hunger = Math.max(0, Math.min(100, currentTank.hunger));
        hungerBar.style.width = `${currentTank.hunger}%`;
        hungerText.textContent = `Hunger: ${Math.floor(currentTank.hunger)}%`;
        if (currentTank.hunger < 20) {
            hungerBar.classList.add('low-hunger');
        } else {
            hungerBar.classList.remove('low-hunger');
        }
    }

    function updateShellCounter() {
        shellCounter.textContent = `Shells: ${Math.floor(shells)}`;
        prestigeCounter.textContent = `Prestige Points: ${Math.floor(prestigePoints)}`;
        cosmicCoinCounter.textContent = `Cosmic Coins: ${Math.floor(cosmicCoins)}`;
        updateBuyButtons();
        updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
        console.log('Shells updated:', shells, 'Cosmic Coins updated:', cosmicCoins);
    }

    cleanButton.addEventListener('click', () => {
        console.log('Clean button clicked');
        shells += 1;
        updateShellCounter();
        updateStatistics();
    });

    feedButton.addEventListener('click', () => {
        if (shells >= feedCost) {
            shells -= feedCost;
            currentTank.hunger += 10;
            updateHungerBar();
            updateShellCounter();
            updateStatistics();
        }
    });

    buyRedButton.addEventListener('click', () => {
        const color = '#ff0000';
        const cost = fishCosts[color].current;
        if (shells >= cost && currentTank.fishList.length < currentTank.capacity) {
            shells -= cost;
            const newFish = new Fish(color);
            newFish.setPosition(canvas.width / 2, canvas.height / 2);
            currentTank.fishList.push(newFish);
            fishCosts[color].current += fishCosts[color].increment;
            updateShellCounter();
            updateStatistics();
            updateSellColorOptions();
        }
    });

    buyBlueButton.addEventListener('click', () => {
        const color = '#0000ff';
        const cost = fishCosts[color].current;
        if (shells >= cost && currentTank.fishList.length < currentTank.capacity) {
            shells -= cost;
            const newFish = new Fish(color);
            newFish.setPosition(canvas.width / 2, canvas.height / 2);
            currentTank.fishList.push(newFish);
            fishCosts[color].current += fishCosts[color].increment;
            updateShellCounter();
            updateStatistics();
            updateSellColorOptions();
        }
    });

    buyYellowButton.addEventListener('click', () => {
        const color = '#ffff00';
        const cost = fishCosts[color].current;
        if (shells >= cost && currentTank.fishList.length < currentTank.capacity) {
            shells -= cost;
            const newFish = new Fish(color);
            newFish.setPosition(canvas.width / 2, canvas.height / 2);
            currentTank.fishList.push(newFish);
            fishCosts[color].current += fishCosts[color].increment;
            updateShellCounter();
            updateStatistics();
            updateSellColorOptions();
        }
    });

    sellFishButton.addEventListener('click', () => {
        const colorToSell = sellColorSelect.value;
        const numberToSell = selectedSellNumber;
        if (numberToSell <= 0 || !colorToSell) return;

        const fishOfColor = currentTank.fishList.filter(fish => fish.color === colorToSell && fish.maturity >= 100);
        const actualNumberToSell = Math.min(numberToSell, fishOfColor.length);

        if (actualNumberToSell > 0) {
            const colorName = colorNames[colorToSell] || `Mixed (${colorToSell})`;
            const confirmMessage = `Are you sure you want to sell ${actualNumberToSell} fish of color ${colorName}? This will earn you ${actualNumberToSell} Prestige Points.`;
            if (window.confirm(confirmMessage)) {
                let removed = 0;
                currentTank.fishList = currentTank.fishList.filter(fish => {
                    if (fish.color === colorToSell && fish.maturity >= 100 && removed < actualNumberToSell) {
                        removed++;
                        return false;
                    }
                    return true;
                });

                prestigePoints += actualNumberToSell;
                updateShellCounter();
                updateStatistics();
                updateSellColorOptions();
                console.log(`Sold ${actualNumberToSell} fish of color ${colorToSell}`);
            }
        }
    });

    toggleMaturityButton.addEventListener('click', () => {
        showMaturity = !showMaturity;
    });

    statisticsButton.addEventListener('click', (event) => {
        event.stopPropagation();
        parentPopup = lastOpenedPopup;
        statisticsOverlay.classList.add('active');
        lastOpenedPopup = statisticsOverlay;
        updateStatistics();
    });

    closeStatisticsButton.addEventListener('click', () => {
        statisticsOverlay.classList.remove('active');
        lastOpenedPopup = parentPopup;
        parentPopup = null;
    });

    function updateStatistics() {
        document.getElementById('statsNumTanks').textContent = `Number of Tanks: ${tanks.filter(t => t.owned).length}`;
        document.getElementById('statsFishInTank').textContent = `Fish in Current Tank: ${currentTank.fishList.length}`;
        const totalFish = tanks.reduce((sum, tank) => sum + tank.fishList.length, 0);
        document.getElementById('statsTotalFish').textContent = `Total Fish Overall: ${totalFish}`;
        document.getElementById('statsSpecialFish').textContent = `Special Fish in Tank: ${currentTank.fishList.filter(fish => fish.isSpecial).length}`;
        document.getElementById('statsTankCapacity').textContent = `Tank Capacity: ${currentTank.fishList.length}/${currentTank.capacity}`;
        const matingChance = getTotalMatingChance();
        const matingPercent = currentTank.hunger > 0 ? (matingChance * (currentTank.hunger / 100) * 100).toFixed(1) : 0;
        document.getElementById('statsMatingChance').textContent = `Mating Chance: ${matingPercent}% (per 30s)`;
        updateSellColorOptions();
    }

    function getTotalMatingChance() {
        let totalMatingBonus = tanks.reduce((sum, tank) => sum + (tank.owned ? tank.matingBonus : 0), 0);
        let higherMatingBonus = getHigherMatingChanceLevel() / 100;
        let cosmicMatingBonus = getCosmicMatingCharmLevel() / 100;
        return baseMatingChance + totalMatingBonus + higherMatingBonus + cosmicMatingBonus;
    }

    function getTotalSFChance() {
        let baseSFChance = getSpecialFishChanceLevel() / 100;
        let higherSFChance = getHigherSFChanceLevel() / 100;
        return baseSFChance + higherSFChance;
    }

    function gameLoop() {
        if (areTipsOn) {
            tipTimer += 50 * getGameSpeed();
            if (tipTimer >= 30000) {
                currentTipIndex = (currentTipIndex + 1) % tips.length;
                gameTip.textContent = `Tip: ${tips[currentTipIndex]}`;
                tipTimer = 0;
            }
        }

        tanks.forEach(tank => {
            if (!isAlwaysFed()) {
                const autoFeederEffect = getAutoFeederLevel() * 0.1 * (50 / 1000) * getGameSpeed();
                tank.hunger += autoFeederEffect;
                const baseDecayRate = 0.048 * (50 / 1000) * getGameSpeed(); // Adjusted from 0.1 to 0.048
                const decayRate = baseDecayRate * tank.fishList.length;
                tank.hunger -= decayRate;
                tank.hunger = Math.max(0, Math.min(100, tank.hunger));
            } else {
                tank.hunger = 100;
            }

            tank.fishList.forEach(fish => {
                const growthBonus = getCosmicGrowthBoosterLevel() / 100;
                fish.grow(tank.hunger, getGameSpeed() * (1 + growthBonus));
                fish.swim(tank.id === currentTank.id ? canvas : { width: tank.width, height: tank.height }, tank.matingFish, tank.matingTimer, tank.attractPoint);
            });

            if (tank.matingFish) {
                tank.matingTimer += 50 * getGameSpeed();
                if (tank.matingTimer >= 3000 * getGameSpeed()) {
                    const { fish1, fish2 } = tank.matingFish;
                    const mixedColor = mixColors(fish1.color, fish2.color);
                    if (tank.fishList.length < tank.capacity) {
                        const totalSFChance = getTotalSFChance();
                        const isSpecial = Math.random() < totalSFChance;
                        const newFish = new Fish(mixedColor, isSpecial);
                        newFish.setPosition(tank.width / 2, tank.height / 2);
                        tank.fishList.push(newFish);
                        console.log(`New offspring in ${tank.name} with color ${mixedColor}, isSpecial: ${isSpecial}, effect: ${newFish.effect}! Total fish: ${tank.fishList.length}`);
                        if (!hasFirstBabyFish) {
                            hasFirstBabyFish = true;
                            firstBabyFishSplash.style.display = 'block';
                            setTimeout(() => {
                                firstBabyFishSplash.style.display = 'none';
                            }, 3000 / getGameSpeed());
                        }
                        if (isSpecial && !hasFirstSpecialFish) {
                            hasFirstSpecialFish = true;
                            firstSpecialFishSplash.style.display = 'block';
                            setTimeout(() => {
                                firstSpecialFishSplash.style.display = 'none';
                            }, 3000 / getGameSpeed());
                        }
                    }
                    tank.matingFish = null;
                    if (tank.id === currentTank.id) {
                        updateSellColorOptions();
                    }
                }
            }

            const matingChance = getTotalMatingChance();
            if (tank.fishList.length >= 2 && tank.hunger > 0 && !tank.matingFish) {
                const now = Date.now();
                if (now - tank.lastMatingCheck >= 30000 / getGameSpeed()) {
                    tank.lastMatingCheck = now;
                    const fullyGrownFish = tank.fishList.filter(fish => fish.maturity >= 100);
                    if (fullyGrownFish.length >= 2) {
                        const chance = matingChance * (tank.hunger / 100);
                        if (Math.random() < chance) {
                            let fish1 = fullyGrownFish[Math.floor(Math.random() * fullyGrownFish.length)];
                            let fish2 = fullyGrownFish[Math.floor(Math.random() * fullyGrownFish.length)];
                            while (fish2 === fish1) {
                                fish2 = fullyGrownFish[Math.floor(Math.random() * fullyGrownFish.length)];
                            }
                            tank.matingFish = { fish1, fish2 };
                            tank.matingTimer = 0;
                            console.log(`Fish are mating in ${tank.name}!`);
                        }
                    }
                }
            }

            tank.ccProductionTimer += 50 * getGameSpeed();
            if (tank.ccProductionTimer >= 60000) {
                const sfCount = tank.fishList.filter(fish => fish.isSpecial).length;
                const baseCCProduction = sfCount * 1;
                const ccProduction = baseCCProduction * (1 + tank.ccBonus);
                cosmicCoins += ccProduction;
                tank.ccProductionTimer = 0;
                console.log(`Tank ${tank.name} produced ${ccProduction} Cosmic Coins from ${sfCount} Special Fish`);
            }

            let totalShellProduction = 0;
            tank.fishList.forEach(fish => {
                const shellRate = 0.1 * (fish.maturity / 100);
                const shellAmplifierBonus = getShellAmplifierLevel() / 100;
                totalShellProduction += shellRate * (50 / 1000) * getGameSpeed() * (1 + tank.shellBonus) * (1 + shellAmplifierBonus);
            });
            shells += totalShellProduction;
        });

        drawTankDecorations(currentTank, ctx, getGameSpeed);
        updateHungerBar();
        currentTank.fishList.forEach(fish => {
            fish.draw(ctx, showMaturity);
        });

        updateShellCounter();
        updateStatistics();
    }

    const initialFish = new Fish(colorsUnlocked[0]);
    initialFish.setPosition(currentTank.width / 2, currentTank.height / 2);
    currentTank.fishList.push(initialFish);
    console.log('Initial fish added to Default Tank. Fish list length:', currentTank.fishList.length);

    updateSellColorOptions();
    updateSkillsDisplay(shells, prestigePoints, cosmicCoins);
    setupSkillUpgrades(updateShellCounter, updateStatistics);
    updateTankList();
    updateHungerBar();
    updateShellCounter();
    updateStatistics();

    window.modifyShells = (amount) => {
        shells += amount;
        updateShellCounter();
        updateStatistics();
        tankListNeedsUpdate = true;
        if (lastOpenedPopup && lastOpenedPopup.id === 'tankSelectionPopup') {
            updateTankList();
        }
    };
    window.modifyPrestige = (amount) => {
        prestigePoints += amount;
        updateShellCounter();
        updateStatistics();
        tankListNeedsUpdate = true;
        if (lastOpenedPopup && lastOpenedPopup.id === 'tankSelectionPopup') {
            updateTankList();
        }
    };
    window.gameLoop = gameLoop;
    window.spawnSpecialFish = () => {
        if (currentTank.fishList.length < currentTank.capacity) {
            const newFish = new Fish('#ff00ff', true);
            newFish.setPosition(canvas.width / 2, canvas.height / 2);
            currentTank.fishList.push(newFish);
            console.log(`Spawned Special Fish with color #ff00ff, effect: ${newFish.effect} in ${currentTank.name}`);
            updateStatistics();
            updateSellColorOptions();
            if (!hasFirstSpecialFish) {
                hasFirstSpecialFish = true;
                firstSpecialFishSplash.style.display = 'block';
                setTimeout(() => {
                    firstSpecialFishSplash.style.display = 'none';
                }, 3000 / getGameSpeed());
            }
        } else {
            console.log(`Tank ${currentTank.name} is full, cannot spawn Special Fish`);
        }
    };

    function showRandomTip(element) {
        const tip = tips[Math.floor(Math.random() * tips.length)];
        element.textContent = `Tip: ${tip}`;
    }
};