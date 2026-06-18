const board = document.getElementById("board");
const movesElement = document.getElementById("moves");
const timerElement = document.getElementById("timer");
const winMessage = document.getElementById("winMessage");
const winMoves = document.getElementById("winMoves");
const winTime = document.getElementById("winTime");
const themeToggle = document.getElementById("themeToggle");
const newGameBtn = document.getElementById("newGameBtn");

let list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
const winList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
let moves = 0;
let seconds = 0;
let timerId = null;
let gameStarted = false;
let gameOver = false;

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light mode";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark mode";
    }
});

newGameBtn.addEventListener("click", startNewGame);

startNewGame();

function drawBoard() {
    board.innerHTML = "";

    for (let i = 0; i < list.length; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (list[i] === "") {
            cell.classList.add("empty");
        } else {
            cell.textContent = list[i];
        }

        cell.addEventListener("click", function (e) {
            const index = Array.from(board.children).indexOf(e.currentTarget);
            moveTile(index);
        });

        board.appendChild(cell);
    }
}

function startNewGame() {
    list = winList.slice();
    moves = 0;
    gameOver = false;
    movesElement.textContent = 0;
    winMessage.classList.add("hidden");
    resetTimer();
    shuffle();
    drawBoard();
}

function shuffle() {
    do {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
    } while (!isSolvable() || isSolved());
}

function isSolvable() {
    const nums = list.filter(function (n) { return n !== ""; });
    let inversions = 0;

    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] > nums[j]) {
                inversions++;
            }
        }
    }

    const emptyIndex = list.indexOf("");
    const emptyRow = 4 - Math.floor(emptyIndex / 4);

    if (emptyRow % 2 === 0) {
        return inversions % 2 !== 0;
    } else {
        return inversions % 2 === 0;
    }
}

function moveTile(index) {
    if (gameOver || list[index] === "") return;

    const emptyIndex = list.indexOf("");

    const left = index === emptyIndex - 1 && emptyIndex % 4 !== 0;
    const right = index === emptyIndex + 1 && index % 4 !== 0;
    const up = index === emptyIndex - 4;
    const down = index === emptyIndex + 4;

    if (left || right || up || down) {
        if (!gameStarted) {
            gameStarted = true;
            timerId = setInterval(function () {
                seconds++;
                timerElement.textContent = formatTime(seconds);
            }, 1000);
        }

        list[emptyIndex] = list[index];
        list[index] = "";

        moves++;
        movesElement.textContent = moves;

        drawBoard();
        checkWin();
    }
}

function checkWin() {
    if (!isSolved()) return;

    gameOver = true;
    clearInterval(timerId);
    gameStarted = false;
    winTime.textContent = formatTime(seconds);
    winMoves.textContent = moves;
    winMessage.classList.remove("hidden");
}

function isSolved() {
    for (let i = 0; i < list.length; i++) {
        if (list[i] !== winList[i]) return false;
    }
    return true;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    gameStarted = false;
    seconds = 0;
    timerElement.textContent = "00:00";
    winTime.textContent = "00:00";
}

function formatTime(total) {
    let m = Math.floor(total / 60);
    let s = total % 60;
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    return m + ":" + s;
}
