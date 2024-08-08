const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');

const text = '雨が静かに降り続ける夜、彼の心は深い闇に包まれていた。窓の外に広がる景色は、雨の音とともに静けさをまとい、まるでこの世の全てが一瞬で消えてしまうかのような錯覚を覚えさせた。彼は机に向かい、古びた日記帳を開いた。ページをめくると、過去の記憶が鮮明に蘇る。消えゆく時間の中で、彼の思い出は一つ一つ、まるで水滴が大地に吸い込まれるように、記憶の底に沈んでいく。ふと、彼は一つの詩を書き留めた。「消えることこそ美しさ。消えゆくことで、心は新たな希望を見いだす。」その言葉には、彼自身の哀愁と希望が織り交ぜられていた。人は皆、何かを失いながら生きていく。しかし、その喪失の中でこそ、新たな出会いや発見が生まれるのだと、彼は信じていた。夜が更けるにつれ、雨音は次第に小さくなり、静寂が再び部屋を包み込んだ。彼は深い息をつき、消えゆく時間の中で、己の存在を再確認した。そして、心の奥底に眠る夢や希望が、消えることなく輝き続けることを願った。';
const fontSize = 18;
const fontFamily = 'serif';

canvas.width = 580;
canvas.height = 400;

ctx.font = `${fontSize}px ${fontFamily}`;
ctx.fillStyle = 'gray';
ctx.textAlign = 'left';
ctx.textBaseline = 'top';

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split('');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n];
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    return lines;
}

const maxWidth = canvas.width - 40;
const lineHeight = fontSize * 1.5;
const lines = wrapText(ctx, text, 20, 20, maxWidth, lineHeight);

lines.forEach((line, index) => {
    ctx.fillText(line, 20, 20 + (index * lineHeight));
});

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const originalPixels = new Uint32Array(imageData.data.buffer);

const raindrops = [];
const mouseRadius = 30;
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

    const speed = 5.5 + Math.random() * 3;
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
