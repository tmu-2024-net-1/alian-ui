const canvas = document.getElementById('noiseCanvas');
const ctx = canvas.getContext('2d');

const text = '雨が静かに降り続ける夜、彼の心は深い闇に包まれていた。窓の外に広がる景色は、雨の音とともに静けさをまとい、まるでこの世の全てが一瞬で消えてしまうかのような錯覚を覚えさせた。彼は机に向かい、古びた日記帳を開いた。ページをめくると、過去の記憶が鮮明に蘇る。消えゆく時間の中で、彼の思い出は一つ一つ、まるで水滴が大地に吸い込まれるように、記憶の底に沈んでいく。ふと、彼は一つの詩を書き留めた。「消えることこそ美しさ。消えゆくことで、心は新たな希望を見いだす。」その言葉には、彼自身の哀愁と希望が織り交ぜられていた。人は皆、何かを失いながら生きていく。しかし、その喪失の中でこそ、新たな出会いや発見が生まれるのだと、彼は信じていた。夜が更けるにつれ、雨音は次第に小さくなり、静寂が再び部屋を包み込んだ。彼は深い息をつき、消えゆく時間の中で、己の存在を再確認した。そして、心の奥底に眠る夢や希望が、消えることなく輝き続けることを願った。';
const fontSize = 18;
const fontFamily = 'serif';

canvas.width = 800;
canvas.height = 600;

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

        noiseLevel += 0.05;
        if (noiseLevel >= 1) {
            noiseLevel = 0;
            charIndex++;
        }

        requestAnimationFrame(frame);
    }

    frame();
}

// アニメーションを開始
setTimeout(animate, 10);