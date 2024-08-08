const raindrops = [];
const mouseRadius = 35;
let mouseX = 0;
let mouseY = 0;

function createRaindrop() {
    const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.textContent = '雨';
        raindrop.style.left = Math.random() * window.innerWidth + 'px';
        raindrop.style.top = '-30px';
        raindrop.style.fontFamily = 'serif';
    document.body.appendChild(raindrop);

    const speed = 7.0 + Math.random() * 3;
    const x = parseFloat(raindrop.style.left);
    let y = -30;

    raindrops.push({ element: raindrop, x, y, speed });
}

function updateRaindrops() {
    for (let i = raindrops.length - 1; i >= 0; i--) {
        const raindrop = raindrops[i];
        raindrop.y += raindrop.speed;

        const dx = raindrop.x - mouseX;
        const dy = raindrop.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
            const angle = Math.atan2(dy, dx);
            raindrop.x = mouseX + Math.cos(angle) * mouseRadius;
            raindrop.y = mouseY + Math.sin(angle) * mouseRadius;
        }

        raindrop.element.style.top = raindrop.y + 'px';
        raindrop.element.style.left = raindrop.x + 'px';

        if (raindrop.y > window.innerHeight) {
            document.body.removeChild(raindrop.element);
            raindrops.splice(i, 1);
        }

        // 雨粒がキャンバス内の文字を通過するかチェックして不透明度を減少させる
        reduceOpacityOnRainDrop(raindrop);
    }
}

function reduceOpacityOnRainDrop(raindrop) {
    const raindropX = Math.floor(raindrop.x);
    const raindropY = Math.floor(raindrop.y);

    for (let y = raindropY - 5; y <= raindropY + 5; y++) {
        for (let x = raindropX - 5; x <= raindropX + 5; x++) {
            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                const index = (y * canvas.width + x) * 4 + 3; // alphaチャンネルのインデックス
                if (imageData.data[index] > 0) {
                    imageData.data[index] = Math.max(imageData.data[index] - 25.5, 0); // 不透明度を10%減少
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}


function animate() {
    if (Math.random() < 0.2) createRaindrop();
    updateRaindrops();
    requestAnimationFrame(animate);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

animate();
