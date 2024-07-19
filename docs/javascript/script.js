const raindrops = [];
        const mouseRadius = 50;
        let mouseX = 0;
        let mouseY = 0;

        function createRaindrop() {
            const raindrop = document.createElement('div');
            raindrop.className = 'raindrop';
            raindrop.textContent = '雨';
            raindrop.style.left = Math.random() * window.innerWidth + 'px';
            raindrop.style.top = '-30px';
            document.body.appendChild(raindrop);

            const speed = 1 + Math.random() * 3;
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
            }
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