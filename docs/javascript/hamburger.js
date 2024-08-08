// javascript/hamburger.js
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('overlay');
    const overlayText = overlay.querySelector('p');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        
        if (hamburger.classList.contains('active')) {
            overlay.classList.add('active');
            setTimeout(() => {
                overlay.classList.add('show');
                overlayText.classList.add('show');
            }, 400); // ハンバーガーアニメーションの時間に合わせる
        } else {
            overlay.classList.remove('show');
            overlayText.classList.remove('show');
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 400); // ハンバーガーアニメーションの時間に合わせる
        }
    });
});
