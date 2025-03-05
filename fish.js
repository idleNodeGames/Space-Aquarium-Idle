// fish.js (Version 3.58)
class Fish {
    constructor(color, isSpecial = false) {
        this.x = 0; // Will be set by setPosition
        this.y = 0;
        this.baseBodyWidth = 6;
        this.baseBodyHeight = 2;
        this.baseTailWidth = 4;
        this.baseTailHeight = 8;
        this.bodyWidth = this.baseBodyWidth;
        this.bodyHeight = this.baseBodyHeight;
        this.tailWidth = this.baseTailWidth;
        this.tailHeight = this.baseTailHeight;
        this.eyeSize = 1;
        this.color = color;
        this.isSpecial = isSpecial;
        this.baseSpeed = 1.5;
        this.speed = this.baseSpeed;
        this.targetX = 0;
        this.targetY = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.isPaused = false;
        this.pauseTime = 0;
        this.maturity = 0;
        this.speedChangeTimer = Math.random() * 5000 + 5000;

        // Special Fish effect properties
        this.effect = null;
        if (isSpecial) {
            const effects = ['glow', 'particles', 'trail', 'rings', 'ripple', 'sparkle'];
            this.effect = effects[Math.floor(Math.random() * effects.length)];
            console.log(`Assigned effect "${this.effect}" to Special Fish with color ${this.color}`);
        }

        this.particles = [];
        this.particleTimer = 0;
        this.trailPositions = [];
        this.rings = [];
        this.ringTimer = 0;
        this.rippleRings = this.effect === 'ripple' ? Array(3).fill().map((_, i) => ({
            timer: (i / 3) * 2000,
            minRadius: 5,
            maxRadius: 15
        })) : [];
        this.sparkles = [];
        this.sparkleTimer = 0;

        console.log(`Fish created with color: ${color}, isSpecial: ${isSpecial}, effect: ${this.effect}`);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }

    grow(hunger, speedMultiplier) {
        if (hunger <= 0) return;

        const maxGrowthMultiplier = 2;
        const maxGrowthRate = 0.1;
        const growthRate = (maxGrowthRate * hunger / 100) * (50 / 1000) * speedMultiplier * window.getGameSpeed();

        const maxBodyWidth = this.baseBodyWidth * maxGrowthMultiplier;
        const maxBodyHeight = this.baseBodyHeight * maxGrowthMultiplier;
        const maxTailWidth = this.baseTailWidth * maxGrowthMultiplier;
        const maxTailHeight = this.baseTailHeight * maxGrowthMultiplier;

        if (this.bodyWidth < maxBodyWidth) {
            this.bodyWidth += growthRate;
            this.bodyHeight += growthRate / 3;
            this.tailWidth += growthRate / 2;
            this.tailHeight += growthRate;
        }

        this.bodyWidth = Math.min(this.bodyWidth, maxBodyWidth);
        this.bodyHeight = Math.min(this.bodyHeight, maxBodyHeight);
        this.tailWidth = Math.min(this.tailWidth, maxTailWidth);
        this.tailHeight = Math.min(this.tailHeight, maxTailHeight);

        this.maturity = Math.min(100, ((this.bodyWidth - this.baseBodyWidth) / (maxBodyWidth - this.baseBodyWidth)) * 100);
    }

    pickNewTarget(canvas, attractPoint) {
        if (attractPoint) {
            this.targetX = attractPoint.x;
            this.targetY = attractPoint.y;
        } else {
            this.targetX = Math.random() * (canvas.width - 40) + 20;
            this.targetY = Math.random() * (canvas.height - 40) + 20;
        }
        if (Math.random() < 0.3) {
            this.isPaused = true;
            this.pauseTime = Math.random() * 1000 + 500;
        }
    }

    swim(canvas, matingFish, matingTimer, attractPoint) {
        if (this.isPaused) {
            this.pauseTime -= 50 * window.getGameSpeed();
            if (this.pauseTime <= 0) {
                this.isPaused = false;
                this.pickNewTarget(canvas, attractPoint);
            }
            return;
        }

        this.speedChangeTimer -= 50 * window.getGameSpeed();
        if (this.speedChangeTimer <= 0) {
            this.speed = Math.random() * 1.5 + 0.5;
            this.speedChangeTimer = Math.random() * 5000 + 5000;
        }

        let targetX = this.targetX;
        let targetY = this.targetY;

        if (matingFish && (matingFish.fish1 === this || matingFish.fish2 === this) && matingTimer < 3000) {
            const partner = matingFish.fish1 === this ? matingFish.fish2 : matingFish.fish1;
            const midX = (this.x + partner.x) / 2;
            const midY = (this.y + partner.y) / 2;
            const angle = (matingTimer / 1000) * Math.PI * 2 * window.getGameSpeed();
            const radius = 20;
            targetX = midX + Math.cos(angle) * radius;
            targetY = midY + Math.sin(angle) * radius;
        }

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx !== 0) this.direction = dx > 0 ? 1 : -1;

        if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            const speed = this.speed * window.getGameSpeed();
            this.x += Math.cos(angle) * speed;
            this.y += Math.sin(angle) * speed;

            // Update Special Fish effects
            if (this.isSpecial) {
                if (this.effect === 'particles') {
                    this.particleTimer += 50 * window.getGameSpeed();
                    if (this.particleTimer >= 300) {
                        const rgb = hexToRgb(this.color);
                        const colorVariation = 20;
                        const variedR = Math.min(255, Math.max(0, rgb.r + (Math.random() * colorVariation * 2 - colorVariation)));
                        const variedG = Math.min(255, Math.max(0, rgb.g + (Math.random() * colorVariation * 2 - colorVariation)));
                        const variedB = Math.min(255, Math.max(0, rgb.b + (Math.random() * colorVariation * 2 - colorVariation)));
                        for (let i = 0; i < 3; i++) {
                            this.particles.push({
                                x: this.x + (Math.random() - 0.5) * this.bodyWidth,
                                y: this.y + (Math.random() - 0.5) * this.bodyHeight,
                                radius: Math.random() * 2 + 1,
                                alpha: 1,
                                vx: (Math.random() - 0.5) * 2,
                                vy: (Math.random() - 0.5) * 2,
                                r: variedR,
                                g: variedG,
                                b: variedB
                            });
                        }
                        this.particleTimer = 0;
                    }
                    this.particles.forEach(p => {
                        p.x += p.vx * window.getGameSpeed();
                        p.y += p.vy * window.getGameSpeed();
                        p.alpha -= 0.02 * window.getGameSpeed();
                    });
                    this.particles = this.particles.filter(p => p.alpha > 0);
                }

                if (this.effect === 'trail') {
                    const rgb = hexToRgb(this.color);
                    const colorVariation = 20;
                    const variedR = Math.min(255, Math.max(0, rgb.r + (Math.random() * colorVariation * 2 - colorVariation)));
                    const variedG = Math.min(255, Math.max(0, rgb.g + (Math.random() * colorVariation * 2 - colorVariation)));
                    const variedB = Math.min(255, Math.max(0, rgb.b + (Math.random() * colorVariation * 2 - colorVariation)));
                    const tailX = this.direction === 1 ? this.x - this.bodyWidth / 2 - this.tailWidth : this.x + this.bodyWidth / 2 + this.tailWidth;
                    this.trailPositions.push({ x: tailX, y: this.y, alpha: 1, r: variedR, g: variedG, b: variedB });
                    if (this.trailPositions.length > 50) this.trailPositions.shift();
                    this.trailPositions.forEach((pos, index) => {
                        pos.alpha -= 0.02 * (1 - (index / this.trailPositions.length)) * window.getGameSpeed();
                    });
                    this.trailPositions = this.trailPositions.filter(pos => pos.alpha > 0);
                }

                if (this.effect === 'rings') {
                    this.ringTimer += 50 * window.getGameSpeed();
                    if (this.ringTimer >= 1000) {
                        this.rings.push({ x: this.x, y: this.y, radius: 0, alpha: 1 });
                        this.ringTimer = 0;
                    }
                    this.rings.forEach(ring => {
                        ring.radius += 0.5 * window.getGameSpeed();
                        ring.alpha -= 0.01 * window.getGameSpeed();
                    });
                    this.rings = this.rings.filter(ring => ring.alpha > 0);
                }

                if (this.effect === 'ripple') {
                    this.rippleRings.forEach(ring => {
                        ring.timer += 50 * window.getGameSpeed();
                        if (ring.timer >= 2000) ring.timer = 0;
                    });
                }

                if (this.effect === 'sparkle') {
                    this.sparkleTimer += 50 * window.getGameSpeed();
                    if (this.sparkleTimer >= 300) {
                        this.sparkles.push({
                            x: this.x + (Math.random() - 0.5) * this.bodyWidth,
                            y: this.y + (Math.random() - 0.5) * this.bodyHeight,
                            radius: Math.random() * 1 + 1,
                            alpha: 1,
                            lifetime: 1500
                        });
                        this.sparkleTimer = 0;
                    }
                    this.sparkles.forEach(sparkle => {
                        sparkle.alpha -= 0.015 * window.getGameSpeed();
                        sparkle.radius = sparkle.radius * (1 + 0.1 * Math.sin(sparkle.lifetime / 100));
                        sparkle.lifetime -= 50 * window.getGameSpeed();
                    });
                    this.sparkles = this.sparkles.filter(sparkle => sparkle.alpha > 0);
                }
            }
        } else if (!matingFish || (matingFish.fish1 !== this && matingFish.fish2 !== this)) {
            this.pickNewTarget(canvas, attractPoint);
        }

        this.x = Math.max(this.bodyWidth / 2, Math.min(this.x, canvas.width - this.bodyWidth / 2));
        this.y = Math.max(this.bodyHeight / 2, Math.min(this.y, canvas.height - this.bodyHeight / 2));
    }

    draw(ctx, showMaturity) {
        ctx.save();

        if (this.isSpecial && this.effect === 'trail') {
            ctx.beginPath();
            for (let i = 0; i < this.trailPositions.length; i++) {
                const pos = this.trailPositions[i];
                ctx.strokeStyle = `rgba(${pos.r}, ${pos.g}, ${pos.b}, ${pos.alpha})`;
                ctx.lineWidth = this.bodyHeight * (i + 1) / this.trailPositions.length;
                if (i === 0) ctx.moveTo(pos.x, pos.y);
                else ctx.lineTo(pos.x, pos.y);
            }
            ctx.stroke();
        }

        if (this.isSpecial && this.effect === 'rings') {
            this.rings.forEach(ring => {
                ctx.strokeStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${ring.alpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        if (this.isSpecial && this.effect === 'ripple') {
            this.rippleRings.forEach(ring => {
                const t = (ring.timer / 2000) * Math.PI * 2;
                const radius = ring.minRadius + (ring.maxRadius - ring.minRadius) * (Math.sin(t) + 1) / 2;
                ctx.strokeStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, 0.5)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
                ctx.stroke();
            });
        }

        if (this.isSpecial && this.effect === 'glow') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.bodyWidth / 2, this.y - this.bodyHeight / 2, this.bodyWidth, this.bodyHeight);

        ctx.beginPath();
        if (this.direction === 1) {
            ctx.moveTo(this.x - this.bodyWidth / 2, this.y);
            ctx.lineTo(this.x - this.bodyWidth / 2 - this.tailWidth, this.y - this.tailHeight / 2);
            ctx.lineTo(this.x - this.bodyWidth / 2 - this.tailWidth, this.y + this.tailHeight / 2);
        } else {
            ctx.moveTo(this.x + this.bodyWidth / 2, this.y);
            ctx.lineTo(this.x + this.bodyWidth / 2 + this.tailWidth, this.y - this.tailHeight / 2);
            ctx.lineTo(this.x + this.bodyWidth / 2 + this.tailWidth, this.y + this.tailHeight / 2);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#000000';
        if (this.direction === 1) {
            ctx.fillRect(this.x + this.bodyWidth / 2 - this.eyeSize - 1, this.y - this.eyeSize / 2, this.eyeSize, this.eyeSize);
        } else {
            ctx.fillRect(this.x - this.bodyWidth / 2 + 1, this.y - this.eyeSize / 2, this.eyeSize, this.eyeSize);
        }

        if (showMaturity) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px Exo 2';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.floor(this.maturity)}%`, this.x, this.y - this.bodyHeight - 5);
        }

        if (this.isSpecial && this.effect === 'particles') {
            this.particles.forEach(p => {
                ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        if (this.isSpecial && this.effect === 'sparkle') {
            this.sparkles.forEach(sparkle => {
                ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.alpha})`;
                ctx.beginPath();
                ctx.arc(sparkle.x, sparkle.y, sparkle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        ctx.restore();
    }
}

// Helper functions for color mixing (from Version 3.44)
function hexToRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0');
}

function mixColors(color1, color2) {
    const primaries = {
        '#ff0000': 'Red',
        '#0000ff': 'Blue',
        '#ffff00': 'Yellow'
    };
    const secondaries = {
        '#800080': 'Purple',
        '#ff8000': 'Orange',
        '#008000': 'Green'
    };
    const tertiaries = {
        '#b30059': 'Red-Purple',
        '#ff4040': 'Red-Orange',
        '#4b0082': 'Blue-Purple',
        '#006666': 'Blue-Green',
        '#ffbf00': 'Yellow-Orange',
        '#80c000': 'Yellow-Green'
    };

    const color1Type = primaries[color1] || secondaries[color1] || tertiaries[color1] || 'Mixed';
    const color2Type = primaries[color2] || secondaries[color2] || tertiaries[color2] || 'Mixed';

    if (color1Type in primaries && color2Type in primaries) {
        if ((color1 === '#ff0000' && color2 === '#0000ff') || (color1 === '#0000ff' && color2 === '#ff0000')) return '#800080';
        if ((color1 === '#ff0000' && color2 === '#ffff00') || (color1 === '#ffff00' && color2 === '#ff0000')) return '#ff8000';
        if ((color1 === '#0000ff' && color2 === '#ffff00') || (color1 === '#ffff00' && color2 === '#0000ff')) return '#008000';
        return color1;
    }

    if ((color1Type in primaries && color2Type in secondaries) || (color1Type in secondaries && color2Type in primaries)) {
        const primary = color1Type in primaries ? color1 : color2;
        const secondary = color1Type in secondaries ? color1 : color2;
        if (primary === '#ff0000' && secondary === '#800080') return '#b30059';
        if (primary === '#ff0000' && secondary === '#ff8000') return '#ff4040';
        if (primary === '#0000ff' && secondary === '#800080') return '#4b0082';
        if (primary === '#0000ff' && secondary === '#008000') return '#006666';
        if (primary === '#ffff00' && secondary === '#ff8000') return '#ffbf00';
        if (primary === '#ffff00' && secondary === '#008000') return '#80c000';
    }

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    return rgbToHex(
        Math.floor((rgb1.r + rgb2.r) / 2),
        Math.floor((rgb1.g + rgb2.g) / 2),
        Math.floor((rgb1.b + rgb2.b) / 2)
    );
}

window.Fish = Fish;
window.hexToRgb = hexToRgb;
window.rgbToHex = rgbToHex;
window.mixColors = mixColors;