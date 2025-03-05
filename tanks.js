// tanks.js
console.log('tanks.js loaded successfully');

const tanks = [
    {
        id: 0,
        name: "Default Tank",
        capacity: 30,
        width: 800,
        height: 450,
        shellBonus: 0,
        matingBonus: 0,
        ccBonus: 0,
        cost: { shells: 0, prestige: 0 },
        owned: true,
        fishList: [],
        hunger: 50,
        lastMatingCheck: Date.now(),
        matingFish: null,
        matingTimer: 0,
        attractPoint: null,
        ccProductionTimer: 0,
        theme: {
            backgroundColor: '#0a0f0f',
            decorations: [],
            lightingEffect: 'none'
        }
    },
    {
        id: 1,
        name: "Bigger Tank",
        capacity: 40,
        width: 800,
        height: 450,
        shellBonus: 0.1,
        matingBonus: 0,
        ccBonus: 0,
        cost: { shells: 5000, prestige: 50 },
        owned: false,
        fishList: [],
        hunger: 50,
        lastMatingCheck: Date.now(),
        matingFish: null,
        matingTimer: 0,
        attractPoint: null,
        ccProductionTimer: 0,
        theme: {
            backgroundColor: '#1e2a44',
            decorations: [
                { type: 'coral', x: 100, y: 400, width: 50, height: 60, color: '#ff4040' },
                { type: 'coral', x: 600, y: 400, width: 40, height: 50, color: '#ff4040' }
            ],
            lightingEffect: 'glow'
        }
    },
    {
        id: 2,
        name: "Vertical Tank",
        capacity: 30,
        width: 600,
        height: 600,
        shellBonus: 0,
        matingBonus: 0.05,
        ccBonus: 0.1,
        cost: { shells: 10000, prestige: 100 },
        owned: false,
        fishList: [],
        hunger: 50,
        lastMatingCheck: Date.now(),
        matingFish: null,
        matingTimer: 0,
        attractPoint: null,
        ccProductionTimer: 0,
        bubbles: [],
        theme: {
            backgroundColor: '#0a1a2f',
            decorations: [
                { type: 'coral', x: 300, y: 550, width: 60, height: 80, color: '#ff0040' },
                { type: 'bubbles', count: 5 }
            ],
            lightingEffect: 'none'
        }
    }
];

// Draw tank decorations
function drawTankDecorations(tank, ctx, getGameSpeed) {
    ctx.fillStyle = tank.theme.backgroundColor;
    ctx.fillRect(0, 0, tank.width, tank.height);

    if (tank.theme.lightingEffect === 'glow') {
        const gradient = ctx.createLinearGradient(0, 0, 0, tank.height);
        gradient.addColorStop(0, 'rgba(30, 42, 68, 0.5)');
        gradient.addColorStop(1, 'rgba(30, 42, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, tank.width, tank.height);
    }

    tank.theme.decorations.forEach(deco => {
        if (deco.type === 'coral') {
            ctx.strokeStyle = deco.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(deco.x, deco.y);
            ctx.lineTo(deco.x, deco.y - deco.height);
            ctx.moveTo(deco.x, deco.y - deco.height * 0.7);
            ctx.lineTo(deco.x - deco.width / 2, deco.y - deco.height * 0.5);
            ctx.moveTo(deco.x, deco.y - deco.height * 0.7);
            ctx.lineTo(deco.x + deco.width / 2, deco.y - deco.height * 0.5);
            ctx.stroke();
        } else if (deco.type === 'bubbles') {
            if (tank.bubbles.length === 0) {
                for (let i = 0; i < deco.count; i++) {
                    tank.bubbles.push({
                        x: Math.random() * tank.width,
                        y: tank.height,
                        radius: Math.random() * 2 + 1
                    });
                }
            }
            tank.bubbles.forEach(bubble => {
                bubble.y -= 0.5 * getGameSpeed();
                if (bubble.y < 0) bubble.y = tank.height;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    });
}

// Switch to a different tank
function switchTank(tankId, currentTank, canvas, hungerBarContainer, updateHungerBar, updateStatistics, updateSellColorOptions) {
    const newTank = tanks.find(t => t.id === tankId);
    if (newTank && newTank.owned) {
        const oldWidth = currentTank.width;
        const oldHeight = currentTank.height;
        currentTank = newTank;
        canvas.width = currentTank.width;
        canvas.height = currentTank.height;
        hungerBarContainer.style.width = `${currentTank.width}px`;
        const widthRatio = currentTank.width / oldWidth;
        const heightRatio = currentTank.height / oldHeight;
        currentTank.fishList.forEach(fish => {
            fish.x = Math.min(fish.x * widthRatio, canvas.width - 20);
            fish.y = Math.min(fish.y * heightRatio, canvas.height - 20);
            fish.targetX = Math.min(fish.targetX * widthRatio, canvas.width - 20);
            fish.targetY = Math.min(fish.targetY * heightRatio, canvas.height - 20);
        });
        if (currentTank.id === 2 && currentTank.bubbles.length === 0) {
            const bubbleDeco = currentTank.theme.decorations.find(deco => deco.type === 'bubbles');
            if (bubbleDeco) {
                for (let i = 0; i < bubbleDeco.count; i++) {
                    currentTank.bubbles.push({
                        x: Math.random() * canvas.width,
                        y: canvas.height,
                        radius: Math.random() * 2 + 1
                    });
                }
            }
        }
        updateHungerBar();
        updateStatistics();
        updateSellColorOptions();
        console.log(`Switched to ${currentTank.name}`);
    } else {
        console.error(`Cannot switch to tank ID ${tankId}: Tank not found or not owned.`);
    }
    return currentTank;
}

// Expose functions and variables
window.tanks = tanks;
window.drawTankDecorations = drawTankDecorations;
window.switchTank = switchTank;