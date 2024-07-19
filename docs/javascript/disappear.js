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

function applyNoiseToChar(lineIndex, charIndex) {
    const startY = 20 + (lineIndex * lineHeight);
    const endY = startY + lineHeight;
    const charWidth = ctx.measureText(lines[lineIndex][charIndex]).width;
    const startX = 20 + ctx.measureText(lines[lineIndex].substring(0, charIndex)).width;
    const endX = startX + charWidth;

    let allTransparent = true;

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const i = y * canvas.width + x;
            if (originalPixels[i] !== 0) {
                const alphaIndex = i * 4 + 3;
                if (imageData.data[alphaIndex] > 0) {
                    if (Math.random() < 0.07) { // 40%の確率で透明化
                        imageData.data[alphaIndex] = 0;
                    } else {
                        allTransparent = false;
                    }
                }
            }
        }
    }

    return allTransparent;
}

function selectRandomChar(lineIndex) {
    const line = lines[lineIndex];
    const visibleChars = [];
    
    for (let i = 0; i < line.length; i++) {
        const startX = 20 + ctx.measureText(line.substring(0, i)).width;
        const charWidth = ctx.measureText(line[i]).width;
        const startY = 20 + (lineIndex * lineHeight);
        
        let isVisible = false;
        for (let y = startY; y < startY + lineHeight; y++) {
            for (let x = startX; x < startX + charWidth; x++) {
                const pixelIndex = (y * canvas.width + x) * 4 + 3;
                if (imageData.data[pixelIndex] > 0) {
                    isVisible = true;
                    break;
                }
            }
            if (isVisible) break;
        }
        
        if (isVisible) {
            visibleChars.push(i);
        }
    }
    
    return visibleChars.length > 0 ? visibleChars[Math.floor(Math.random() * visibleChars.length)] : -1;
}

function animate() {
    const selectedChars = [];

    function selectChars() {
        selectedChars.length = 0;
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const selectedChar = selectRandomChar(lineIndex);
            if (selectedChar !== -1) {
                selectedChars.push({ lineIndex, charIndex: selectedChar });
            }
        }
    }

    function frame() {
        if (selectedChars.length === 0) {
            selectChars();
        }

        if (selectedChars.length === 0) {
            return; // アニメーション終了
        }

        let allComplete = true;
        for (let i = 0; i < selectedChars.length; i++) {
            const { lineIndex, charIndex } = selectedChars[i];
            const allTransparent = applyNoiseToChar(lineIndex, charIndex);
            if (!allTransparent) {
                allComplete = false;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        if (allComplete) {
            selectChars();
        }

        requestAnimationFrame(frame);
    }

    frame();
}

// アニメーションを開始
setTimeout(animate, 1000);