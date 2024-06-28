document.addEventListener('DOMContentLoaded', () => {
    const tetris = document.querySelector('.tetris');
    const width = 10;
    let squares = Array.from(document.querySelectorAll('.tetris div'));

    // テトロミノの形を定義
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    let currentPosition = 4;
    let currentRotation = 0;
    let current = lTetromino[currentRotation];

    // テトロミノを描画する
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block');
        });
    }

    // テトロミノを消す
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block');
        });
    }

    // テトロミノを下に移動させる
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // テトロミノが底に達したかどうかをチェックする
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('block2'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('block2'));
            currentPosition = 4;
            current = lTetromino[currentRotation];
            draw();
        }
    }

    // テトロミノを一定時間ごとに下に移動させる
    timerId = setInterval(moveDown, 1000);
});
