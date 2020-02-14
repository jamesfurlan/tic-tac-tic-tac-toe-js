let board = [];
let currentPlayer = "X";

initGame();

window.onclick = function(event) {
    if (event.target === document.getElementById('winnerDiv')) {
        document.getElementById('winnerDiv').style.display = "none";
        window.addEventListener('click', newGame);
    }
};

function newGame(event) {
    window.removeEventListener('click', newGame);
    initGame();
}


function initGame() {
    board = [];
    currentPlayer = "X";
    for (let i = 0; i < 3; i++) {
        board[i] = new Array(3);
        for (let j = 0; j < 3; j++) {
            board[i][j] = {local: new Array(3), winner: ""};
            const outer = document.getElementById('outer'+i+j);
            outer.classList.remove("crossTrans", "naughtTrans", "stalemateTile");
            outer.classList.add("selectCross");
            document.getElementById("localInfo"+i+j).style.display = "none";
            document.getElementById("localInfo"+i+j).classList.remove("naughtTile", "crossTile");
            for (let k = 0; k < 3; k++) {
                board[i][j].local[k] = new Array(3);
                for (let l = 0; l < 3; l++) {
                    board[i][j].local[k][l] = "";
                    const grid = document.getElementById('inner'+i+j+k+l);
                    grid.classList.remove("cross", "naught", "hollowO", "hollowX");
                    grid.innerText = "";
                    grid.classList.add("hoverCross");
                    grid.addEventListener('click', press);
                }
            }
        }
    }
}

function press(event) {
    const i = parseInt(event.target.id[5]);
    const j = parseInt(event.target.id[6]);
    const k = parseInt(event.target.id[7]);
    const l = parseInt(event.target.id[8]);

    board[i][j].local[k][l] = currentPlayer;
    event.target.innerText = currentPlayer;
    if (currentPlayer == "X") {
        event.target.classList.add("cross");
        if (checkWin(i,j)) {
            document.getElementById("outer"+i+j).classList.add("crossTrans");
            document.getElementById("localInfo"+i+j).innerText = "X";
            document.getElementById("localInfo"+i+j).classList.add("crossTile");
            document.getElementById("localInfo"+i+j).style.display = "block";
            for (let m = 0; m < 3; m++) {
                for (let n = 0; n < 3; n++) {
                    if (board[i][j].local[m][n] === "X") {
                        document.getElementById('inner'+i+j+m+n).classList.add("hollowX");
                    }
                    if (board[i][j].local[m][n] === "O") {
                        document.getElementById('inner'+i+j+m+n).classList.add("hollowO");
                    }
                }
            }
        }
        const wholeCheck = checkTotal();
        if (wholeCheck === 1) {
            const winBox = document.getElementById("winnerContainer");
            winBox.innerText = "Crosses wins";
            winBox.style.color = "blue";
            document.getElementById('winnerDiv').style.display = "block";
            endGame();
            return;
        } else if (wholeCheck === -1) {
            endGame();
            return;
        }
        currentPlayer = "O";
    }
    else if (currentPlayer == "O") {
        event.target.classList.add("naught");
        if (checkWin(i,j)) {
            document.getElementById("outer"+i+j).classList.add("naughtTrans");
            document.getElementById("localInfo"+i+j).innerText = "O";
            document.getElementById("localInfo"+i+j).classList.add("naughtTile");
            document.getElementById("localInfo"+i+j).style.display = "block";
            for (let m = 0; m < 3; m++) {
                for (let n = 0; n < 3; n++) {
                    if (board[i][j].local[m][n] === "X") {
                        document.getElementById('inner'+i+j+m+n).classList.add("hollowX");
                    }
                    if (board[i][j].local[m][n] === "O") {
                        document.getElementById('inner'+i+j+m+n).classList.add("hollowO");
                    }
                }
            }
        }
        const wholeCheck = checkTotal();
        if (wholeCheck === 1) {
            const winBox = document.getElementById("winnerContainer");
            winBox.innerText = "Naughts wins";
            winBox.style.color = "red";
            document.getElementById('winnerDiv').style.display = "block";
            endGame();
            return;
        } else if (wholeCheck === -1) {
            endGame();
            return;
        }
        currentPlayer = "X";
    }
    removeListeners();
    changeBox(k,l);
}

function changeBox(i, j) {
    if (board[i][j].winner !== "") {
        allAvailable();
        return;
    }
    const outer = document.getElementById('outer'+i+j);
    if (currentPlayer === "X") outer.classList.add("selectCross");
    if (currentPlayer === "O") outer.classList.add("selectNaught");
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            if (board[i][j].local[k][l] !== "") continue;
            const grid = document.getElementById('inner'+i+j+k+l);
            if (currentPlayer === "X") grid.classList.add("hoverCross");
            if (currentPlayer === "O") grid.classList.add("hoverNaught");
            grid.addEventListener('click', press);
        }
    }
}

function removeListeners() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const outer = document.getElementById('outer'+i+j);
            outer.classList.remove("selectCross", "selectNaught");
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    const grid = document.getElementById('inner'+i+j+k+l);
                    grid.classList.remove("hoverCross", "hoverNaught");
                    grid.removeEventListener('click', press);
                }
            }
        }
    }
}

function checkWin(i, j) {
    const checkBoard = board[i][j].local;
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            for (let index = 0; index < 3; index++) {
                if (l + index >= 3) break;
                if (checkBoard[k][l+index] !== currentPlayer) break;
                if (index === 2) {
                    board[i][j].winner = currentPlayer;
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (k + index >= 3) break;
                if (checkBoard[k+index][l] !== currentPlayer) break;
                if (index === 2) {
                    board[i][j].winner = currentPlayer;
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (l + index >= 3 || k + index >= 3) break;
                if (checkBoard[k+index][l+index] !== currentPlayer) break;
                if (index === 2) {
                    board[i][j].winner = currentPlayer;
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (l + index >= 3 || k - index < 0) break;
                if (checkBoard[k-index][l+index] !== currentPlayer) break;
                if (index === 2) {
                    board[i][j].winner = currentPlayer;
                    return 1;
                }
            }
        }
    }
    for (let k = 0; k < 3; k++) {
        for (let l = 0; l < 3; l++) {
            if (checkBoard[k][l] == "") return 0;
        }
    }
    document.getElementById("outer"+i+j).classList.add("stalemateTile");
    board[i][j].winner = "Z"; 
}

function allAvailable() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j].winner !== "") continue;
            const outer = document.getElementById('outer'+i+j);
            if (currentPlayer === "X")
                outer.classList.add("selectCross");
            else
                outer.classList.add("selectNaught");
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    if (board[i][j].local[k][l] === "") {
                        const grid = document.getElementById('inner'+i+j+k+l);
                        if (currentPlayer === "X") grid.classList.add("hoverCross");
                        if (currentPlayer === "O") grid.classList.add("hoverNaught");
                        grid.addEventListener('click', press);
                    }
                }
            }
        }
    }
}

function checkTotal() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let index = 0; index < 3; index++) {
                if (j + index >= 3) break;
                if (board[i][j+index].winner !== currentPlayer) break;
                if (index === 2) {
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (i + index >= 3) break;
                if (board[i+index][j].winner !== currentPlayer) break;
                if (index === 2) {
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (i + index >= 3 || j + index >= 3) break;
                if (board[i+index][j+index].winner !== currentPlayer) break;
                if (index === 2) {
                    return 1;
                }
            }
            for (let index = 0; index < 3; index++) {
                if (j + index >= 3 || i - index < 0) break;
                if (board[i-index][j+index].winner !== currentPlayer) break;
                if (index === 2) {
                    return 1;
                }
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j].winner == "") return 0;
        }
    }
    const winBox = document.getElementById("winnerContainer");
    winBox.innerText = "Stalemate";
    winBox.style.color = "#474747";
    document.getElementById('winnerDiv').style.display = "block";
    return -1;
}

function endGame() {
    removeListeners();
}