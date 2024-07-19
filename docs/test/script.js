const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');

const text = 'ノイズで消える文字';
const fontSize = 48;
const fontFamily = 'Arial, sans-serif';

canvas.width = 800;
canvas.height = 200;

ctx.font = `${fontSize}px ${fontFamily}`;
ctx.fillStyle = 'black';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(text, canvas.width / 2, canvas.height / 2);

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const originalPixels = new Uint32Array(imageData.data.buffer);

function applyNoiseToChar(charIndex, noiseLevel) {
    const charWidth = ctx.measureText(text[charIndex]).width;
    const startX = (canvas.width - ctx.measureText(text).width) / 2 + 
                   text.slice(0, charIndex).split('').reduce((acc, char) => acc + ctx.measureText(char).width, 0);
    const endX = startX + charWidth;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = startX; x < endX; x++) {
            const i = y * canvas.width + x;
            if (originalPixels[i] !== 0) {
                const noise = Math.random() * noiseLevel;
                if (noise > 0.5) {
                    imageData.data[i * 4 + 3] = 0; // Set alpha to 0 (transparent)
                }
            }
        }
    }
}

function animate() {
    let charIndex = 0;
    let noiseLevel = 0;

    function frame() {
        if (charIndex >= text.length) return;

        applyNoiseToChar(charIndex, noiseLevel);
        ctx.putImageData(imageData, 0, 0);

        noiseLevel += 0.01;
        if (noiseLevel >= 1) {
            noiseLevel = 0;
            charIndex++;
        }

        requestAnimationFrame(frame);
    }

    frame();
}

// アニメーションを開始
setTimeout(animate, 1000);