const grid = document.querySelector('.grid');
const flagsLeft = document.querySelector('.flagsleft');
const mineorfree = document.querySelector('.mineorfree');
const mine = document.querySelector('.mine');
const free = document.querySelector('.free');
const result = document.querySelector('.result');
const x = document.querySelector('.x');
let width = 10;
let squares = [];
let bombAmount = 15;
let alreadyclicked = false;
let isGameOver = false;
let firstselect = true;
let exit = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pulse = 0;
let increasing = true;

const titleFont = "48px Kalnia Glaze"; 
const bylineFont = "24px Kalnia Glaze";

function drawBackground() {
    const pulseValue = 150 + Math.sin(pulse) * 55;
    ctx.fillStyle = `rgb(${pulseValue * 0.5}, ${pulseValue * 0.7}, ${pulseValue * 0.5})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTitle() {
    // Title text
    ctx.font = titleFont;
    ctx.fontWeight = "bold";
    ctx.fillStyle = "cyan";
    ctx.textAlign = "center";
    ctx.fillText("MINESWEEPER", canvas.width / 2, canvas.height / 2 - 50);
}

function drawByline() {
    // Byline text
    ctx.font = bylineFont;
    ctx.fillStyle = "cyan";
    ctx.textAlign = "right";
    ctx.fillText("By ChimbroDaPro", canvas.width - 10, canvas.height - 10);
}

function updatePulse() {
    if (increasing) {
        pulse += Math.PI / 60;
        if (pulse >= Math.PI * 2) {
            pulse -= Math.PI * 2;
        }
    }
}

function render() {
    
    if (!exit) {
        drawBackground();
        drawTitle();
        drawByline();
        updatePulse();
    }
    requestAnimationFrame(render);
}

render();


const shuffle = (array) => { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
}; 

function createBoard() {
    flagsLeft.innerText = 'Flags left: ' + bombAmount;
    const bombArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * width - bombAmount).fill('valid');
    const gameArray = bombArray.concat(emptyArray);
    const shuffledArray = shuffle(gameArray);
    console.log(shuffledArray);

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        grid.appendChild(square);
        square.classList.add(shuffledArray[i]);
        square.style.animation = `appear ${i / 20}s ease-in-out`;
        squares.push(square);
        setTimeout(function() {
                for (let j = 0; j < squares.length; j++) {
                    if (squares[j].classList.contains('checked')) {
                        squares[j].style.borderColor = '#abedce';
                        squares[j].style.backgroundColor = '#4a9e9b';
                    } else {
                        squares[j].style.borderColor = '#aceca1';
                        squares[j].style.backgroundColor = '#629460';
                    }
                }
            
        }, 2000);

        square.addEventListener('click', function() {
            if (square.classList.contains('checked')) return;

            currentsquare = square;
            mineorfree.style.display = 'block';
            square.style.borderColor = '#c9f2c7';
            square.style.backgroundColor = '#ccf768';
            mine.style.animation = 'flyup 1s';
            free.style.animation = 'flyup 1s';
            x.style.animation = 'flyup 1s';
            mine.style.top = '80%';
            free.style.top = '80%';
            x.style.top = '80%';
            mineorfree.style.display = 'block';
            mine.addEventListener('click', function() {
                alreadyclicked = false;
                addFlag(currentsquare);
                mine.style.animation = 'flydown 1s';
                free.style.animation = 'flydown 1s';
                x.style.animation = 'flydown 1s';
                //square.style.borderColor = '#abedce';
                //square.style.backgroundColor = '#4a9e9b';
                mine.style.top = '100%';
                free.style.top = '100%';
                x.style.top = '100%';

            });
            free.addEventListener('click', function() {
                alreadyclicked = false;
                click(currentsquare);
                mine.style.animation = 'flydown 1s';
                free.style.animation = 'flydown 1s';
                x.style.animation = 'flydown 1s';
                mine.style.top = '100%';
                free.style.top = '100%';
                x.style.top = '100%';
            });
            x.addEventListener('click', function() {
                currentsquare = null;
                alreadyclicked = false;
                mine.style.animation = 'flydown 1s';
                free.style.animation = 'flydown 1s';
                x.style.animation = 'flydown 1s';
                mine.style.top = '100%';
                free.style.top = '100%';
                x.style.top = '100%';
                square.style.borderColor = '#aceca1';
                square.style.backgroundColor = '#629460';
            });
            
        });
    }
   // checkNeighborMines();
}


canvas.addEventListener('click', function() {
    exit = true;
    ctx.fillStyle = '#243119';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = bylineFont;
    ctx.fillStyle = "cyan";
    ctx.textAlign = "right";
    ctx.fillText("Loading...", canvas.width - 10, canvas.height - 10);
    setTimeout(function() {
        canvas.remove();
        createBoard();
    }, 1500);
});

function checkNeighborMines(obj) {
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeftEdge = (i % width === 0);
        const isRightEdge = (i % width === width - 1);

        if (squares[i].classList.contains('valid')) {
            if (squares[i].classList.contains('one')) squares[i].classList.remove('one');
            if (squares[i].classList.contains('two')) squares[i].classList.remove('two');
            if (squares[i].classList.contains('three')) squares[i].classList.remove('three');
            if (squares[i].classList.contains('four')) squares[i].classList.remove('four');
            if (squares[i].classList.contains('five')) squares[i].classList.remove('five');
            if (squares[i].classList.contains('six')) squares[i].classList.remove('six');
            if (squares[i].classList.contains('seven')) squares[i].classList.remove('seven');
            if (squares[i].classList.contains('eight')) squares[i].classList.remove('eight');
            if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
            if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
            if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
            if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) total++;
            if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
            if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
            if (i <= 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
            if (i < 89 && squares[i + width].classList.contains('bomb')) total++;
            squares[i].setAttribute('data', total);
            if (total != 0) {
                if (total === 1) squares[i].classList.add('one');
                if (total === 2) squares[i].classList.add('two');
                if (total === 3) squares[i].classList.add('three');
                if (total === 4) squares[i].classList.add('four');
                if (total === 5) squares[i].classList.add('five');
                if (total === 6) squares[i].classList.add('six');
                if (total === 7) squares[i].classList.add('seven');
                if (total === 8) squares[i].classList.add('eight');
            }
        }
    }
}

function click(square) {
    if (isGameOver || square.classList.contains('checked') || square.classList.contains('flagged')) {
        return;
    }
    square.style.borderColor = '#abedce';
    square.style.backgroundColor = '#4a9e9b';
    if (square.classList.contains('bomb')) {
        gameOver();
    } else {
        let total = square.getAttribute('data');
        if (firstselect) {
            firstselect = false;
            square.classList.add('firstselect');
            total = 0;
        }

        if (total != 0) {
            square.classList.add('checked');

            checkNeighborMines(square);
            checkNeighborMines(square);
            checkNeighborMines(square);
            square.innerText = total;
            return;
        }
        checkSquare(square);
    }
    square.classList.add('checked');
}

function addFlag(square) {
    if (square.classList.contains('checked')) return;
    if (bombAmount <= 0) return;
    if (square.classList.contains('flagged')) {
        return;
    }
    bombAmount--;
    flagsLeft.innerText = 'Flags left: ' + bombAmount;
    square.classList.add('flagged');
    square.style.borderColor = '#03fca5';
    square.style.backgroundColor = '#fc4503';
    let image = document.createElement('img');
    image.src = 'IMG_5903.png';
    image.classList.add('imag')
    square.style.display = 'flex';
    square.style.alignItems = 'center';
    square.style.justifyContent = 'center';
    square.append(image);
}

function gameOver() {
    result.innerText = 'Hehe you lost!';
    document.body.style.backgroundColor = '#f57242';
    isGameOver = true;

    squares.forEach(function(square) {
        if (square.classList.contains('bomb')) {
            let image = document.createElement('img');
            image.src = 'IMG_5906.png';
            square.style.display = 'flex';
            square.style.alignItems = 'center';
            square.style.justifyContent = 'center';
            square.style.backgroundColor = 'black';
            square.classList.remove('bomb');
            square.classList.add('checked');
            square.append(image);
        }
    });
}

function checkSquare(square) {
    const currentId = square.id;
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);
    square.style.borderColor = '#abedce';
    square.style.backgroundColor = '#4a9e9b';

    setTimeout(function() {
        if (currentId > 0 && !isLeftEdge) {
            const newId = parseInt(currentId) - 1;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);

            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId > 9 && !isRightEdge) {
            const newId = parseInt(currentId) + 1 - width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId > 10) {
            const newId = parseInt(currentId) - width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId > 11 && !isLeftEdge) {
            const newId = parseInt(currentId) - 1 - width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId < 99 && !isRightEdge) {
            const newId = parseInt(currentId) + 1;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId < 90 && !isLeftEdge) {
            const newId = parseInt(currentId) - 1 + width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId < 88 && !isRightEdge) {
            const newId = parseInt(currentId) + 1 + width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
        if (currentId < 89) {
            const newId = parseInt(currentId) + width;
            const newSquare = document.getElementById(newId);
            if (!newSquare.classList.contains('bomb')) {
                checkNeighborMines(newSquare);
                click(newSquare);
            } else {
                if (square.classList.contains('firstselect')) {
                    square.classList.remove('firstselect');
                    square.classList.add('checked');
                    newSquare.classList.remove('bomb');
                    newSquare.classList.add('valid');
                    newSquare.setAttribute('data', 0);
                    checkNeighborMines(newSquare);
                    click(newSquare);
                }
            }
        }
    });
}