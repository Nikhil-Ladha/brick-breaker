const startBtn = document.querySelector("#start");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.querySelector("#main-menu");
let canvasWidth = 1100;
let canvasHeight = 800;
let triggerCanvas;
const ballRadius = 15;
let board = {
    x1: 0,
    x2: 100
};
let ball = {
    x: 15,
    y: 15
};
let dx = 2, dy = -2;
let direction = "";
let bricksMatrix = [];
const brickWidth = 95;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColumn = 10;
const brickRow = 6;
let timeout;

for(let i = 0; i < brickRow; i++) {
    bricksMatrix[i] = [];
    for(let j = 0; j< brickColumn; j++) {
        bricksMatrix[i][j] = {
            x: 0,
            y: 0,
            show: 1
        }
    }
}

startBtn.addEventListener("click", () => {
    mainMenu.style.display = "none";
    canvas.style.display = "block";
    startGame();
})

const paintBoard = () => {
    ctx.fillStyle = "red"
    ctx.fillRect(board.x1, canvasHeight - 50, 200, 20);
    ctx.strokeStyle = "black";
    ctx.strokeRect(board.x1, canvasHeight - 50, 200, 20);
}

const paintBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black"
    ctx.stroke();
    ctx.closePath();
}

const paintBricks = () => {

    for(let i = 0; i < brickRow; i++) {
        let yPos = brickOffsetTop + i*(brickHeight + brickPadding);
        for(let j = 0; j< brickColumn; j++) {
            let xPos = brickOffsetLeft + j*(brickWidth + brickPadding);
            ctx.fillStyle = "orange";
            ctx.fillRect(xPos, yPos, brickWidth, brickHeight);
            ctx.strokeStyle = "black";
            ctx.strokeRect(xPos, yPos, brickWidth, brickHeight);
            bricksMatrix[i][j] = {
                x: xPos,
                y: yPos,
                show: 1
            }
        }
    }
}

const checkCollision = () => {

    for(let i = 0; i < brickRow; i++) {
        for(let j = 0; j < brickColumn; j++) {
            let brick = bricksMatrix[i][j];
            if(brick.show && ball.x > brick.x && ball.x < (brick.x + brickWidth) &&
               ball.y > brick.y && ball.y < (brick.y + brickHeight)) {
                    dy = -dy;
                    brick.show = 0;
            }
            if(brick.show) {
                ctx.fillStyle = "orange";
                ctx.fillRect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.strokeStyle = "black";
                ctx.strokeRect(brick.x, brick.y, brickWidth, brickHeight);
            }
        }
    }
}

const paintCanvas = () => {

    // Clear the canvas before next render
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Paint board
    paintBoard();

    // Paint ball
    paintBall();

    // Check collision and repaint bricks
    checkCollision();

    // Update board x1, x2 values based on direction and position
    if(direction && direction == "right" && board.x2 < canvasWidth) {
        board.x1 = board.x1 + 10;
        board.x2 = board.x2 + 10;
    } else if(direction && direction == "left" && board.x1 > 0) {
        board.x1 = board.x1 - 10;
        board.x2 = board.x2 - 10;
    }

    // Update ball position
    if((ball.y - ballRadius) <= 0 || (ball.y + ballRadius) >= canvasHeight)  {
        dy = -dy;
    }

    if((ball.x - ballRadius) <= 0 || (ball.x + ballRadius) >= canvasWidth) {
        dx = -dx;
    }

    // If ball touches the board
    if(((ball.y + ballRadius) > canvasHeight - 50) && ((ball.y - ballRadius) < canvasHeight - 30)) {
        if((ball.x + ballRadius > board.x1) && (ball.x + ballRadius < board.x2)) {
            dy = -dy;
        } else if((ball.x + ballRadius == board.x1) || (ball.x + ballRadius == board.x2)) {
            dy = -dy;
            dx = -dx;
        }
    }

    // Game over if ball goes below the board
    if((ball.y + 15) > canvasHeight - 30 && !((ball.x + ballRadius > board.x1) && (ball.x + ballRadius < board.x2))) {
        gameOver();
    }

    // Update ball position
    ball.x += dx;
    ball.y += dy;
}

const gameOver = () => {
    clearInterval(timer);
    dx = 2;
    dy = -2;
    startGame();
}

const startGame = () => {

    // Initialize board position
    board = {
        x1: canvasWidth/2 - 100,
        x2: canvasWidth/2 + 100,
    }

    // Inititalise ball position
    ball = {
        x: canvasWidth/2,
        y: canvasHeight - 65
    };

    // Paint initial bricks
    paintBricks();

    timer = setInterval(paintCanvas, 5);

    document.addEventListener("keydown", (event) => {
        const keyCode = event.code || event.key;

        switch(keyCode) {
            case 'ArrowLeft':
                    direction = "left"
                    event.preventDefault()
                break

            case 'ArrowRight':
                    direction = "right"
                    event.preventDefault()
                break
        }
    })

    document.addEventListener("keyup", (event) => {
        const keyCode = event.code || event.key;

        switch(keyCode) {
            case 'ArrowLeft':
            case 'ArrowRight':
                    direction = ""
                    event.preventDefault()
                break
        }
    })
}

