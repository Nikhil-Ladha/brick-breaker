const startBtn = document.querySelector("#start");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.querySelector("#main-menu");
let canvasWidth = 0;
let canvasHeight = 0;
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

const resize = () => {
    // Subtracting 2 for border width
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

// Initialise the canvas widht, height
resize();

window.addEventListener('resize', () => {
    resize();

    if (canvas.style.display == "block")
        startGame();
});

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
    ball.x += dx;
    ball.y += dy;
}

const paintCanvas = () => {

    // Clear the canvas before next render
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update board x1, x2 values based on direction and position
    if(direction && direction == "right" && board.x2 < canvasWidth) {
        board.x1 = board.x1 + 10;
        board.x2 = board.x2 + 10;
    } else if(direction && direction == "left" && board.x1 > 0) {
        board.x1 = board.x1 - 10;
        board.x2 = board.x2 - 10;
    }

    // Update ball position
    if((ball.y - 15) <= 0 || (ball.y + 15) >= canvasHeight)  {
        dy = -dy;
    }

    if((ball.x - 15) <= 0 || (ball.x + 15) >= canvasWidth) {
        dx = -dx;
    }

    // If ball touches the board
    if(((ball.y + 15) > canvasHeight - 50) && ((ball.y - 15) < canvasHeight - 30)) {
        if((ball.x + 15 > board.x1) && (ball.x + 15 < board.x2)) {
            dy = -dy;
        } else if((ball.x + 15 == board.x1) || (ball.x + 15 == board.x2)) {
            dy = -dy;
            dx = -dx;
        }
    }

    // Paint board
    paintBoard();

    // Paint ball
    paintBall();

    setTimeout(paintCanvas, 10);
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

    paintCanvas();

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

