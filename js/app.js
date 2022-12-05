'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'

const BALL = 'BALL'
const GAMER = 'GAMER'

const CANDY = 'CANDY'

const GAMER_IMG = '\n\t\t<img src="img/gamer.png">\n'
const BALL_IMG = '\n\t\t<img src="img/ball.png">\n'
const CANDY_IMG = '\n\t\t<img src="img/candy.png">\n'

// Model:
var gBoard
var gGamerPos
var gScore
var gInterval
var gIntervalCandy
var gCollectedBalls
var gBallCount 
var gIsGlued 


function initGame() {
    gScore = 0
    gCollectedBalls = 0
    gBallCount = 2
    gIsGlued = false
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    gIntervalCandy = setInterval(addCandy, 5000);
    gInterval = setInterval(addBall, 3000);
    restartGame()
    document.querySelector('button').style.display = 'none'

}


function gameOver() {
    clearInterval(gIntervalCandy)
    clearInterval(gInterval)
    document.querySelector('button').style.display = 'block'
    var elWin = document.querySelector('.score')
    var strHTML1 = `WON!`
    elWin.innerHTML = strHTML1
    // audio1()
}



function buildBoard() {
    var board = []

    // TODO: Create the Matrix 10 * 12 
    board = createMat(10, 12)

    // TODO: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === board.length - 1) board[i][j].type = WALL
            else if (j === 0 || j === board[i].length - 1) board[i][j].type = WALL
        }
    }

    // TODO: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[4][7].gameElement = BALL
    board[3][3].gameElement = BALL

    // Add the passages
    board[0][Math.floor(board[0].length / 2)].type = FLOOR
    board[board.length - 1][Math.floor(board[0].length / 2)].type = FLOOR
    board[Math.floor(board.length / 2)][0].type = FLOOR
    board[Math.floor(board.length / 2)][board[0].length - 1].type = FLOOR

    
    return board;
}


// Render the board to an HTML table
function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i}, ${j})">`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG;
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG;
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function addBall() {
    var location = getEmptyCell()

    if (!location) return //{
    gBallCount++

    // UPDATE THE MODEL
    gBoard[location.i][location.j].gameElement = BALL
    // UPDATE THE DOM
    renderCell(location, BALL_IMG)
    // }

}

function addCandy() {
  var location = getEmptyCell()
  if (!location) return // {
    // UPDATE THE MODEL
    gBoard[location.i][location.j].gameElement = CANDY
    // UPDATE THE DOM
    renderCell(location, CANDY_IMG)

    setTimeout(() => {
        if(gBoard[location.i][location.j].gameElement === CANDY) {
          // UPDATE THE MODEL
          gBoard[location.i][location.j].gameElement = null
          // UPDATE THE DOM
          renderCell(location, '')
        }
    }, 3000)
  //}
}



function getEmptyCell() {
    var positions = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]
            if (cell.type !== WALL && cell.gameElement === null) {
                positions.push({ i, j })
            }

        }

    }



    return positions[getRandomInt(0, positions.length)]
}

function restartGame() {
    gScore = 1
    var elBallcounter = document.querySelector('.score')
    elBallcounter.innerHTML = gScore
}


// Move the player to a specific location
function moveTo(i, j) {
    if(gIsGlued) return 
    var targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i)
    var jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || 
        (jAbsDiff === 1 && iAbsDiff === 0) ||
        // Checking if crossing the passages
        iAbsDiff === gBoard.length - 1 || 
        jAbsDiff === gBoard[0].length - 1
        // works but has bugs
        // i === 0 || i === gBoard.length -1 || j === 0 || j === gBoard[0].length - 1
        ) {
        if (targetCell.gameElement === BALL) {
            // Model Update
            gCollectedBalls++
            console.log('Collecting!')
            // renderscore()
            // audio()
            // updating DOM
            var elScore = document.querySelector('.score')
            elScore.innerText = `${gCollectedBalls}`

            if (gCollectedBalls === gBallCount) {
                gameOver()
                // audio1()
            }

        } else if (targetCell.gameElement === CANDY) {
            gIsGlued = true
            setTimeout(() => gIsGlued = false, 3000)
        }

        // TODO: Move the gamee
        // Update the Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null

        // DOM:
        renderCell(gGamerPos, '')

        // Update the Model:
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }

        // DOM:
        renderCell(gGamerPos, GAMER_IMG)

    } else console.log('TOO FAR', iAbsDiff, jAbsDiff)

}



function audio() {
    var audioWin = new Audio('mixkit-arcade-retro-changing-tab-206 (1).wav');
    audioWin.play()
}
function audio1() {
    var audioWin1 = new Audio('TB7L64W-winning.mp3');
    audioWin1.play()
}


function renderscore() {
    var elScore = document.querySelector('.score')
    elScore.innerHTML = gScore
    gScore += 1
}
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i
    var j = gGamerPos.j


    switch (event.key) {
        case 'ArrowLeft':
            if(j === 0) j = gBoard[0].length -1
            else j--
            // moveTo(i, j - 1)
            break;
        case 'ArrowRight':
            if (j === gBoard[0].length - 1) j = 0
            else j++
            // moveTo(i, j + 1)
            break;
        case 'ArrowUp':
            if(i === 0) i = gBoard.length - 1
            else i--
            // moveTo(i - 1, j)
            break;
        case 'ArrowDown':
            if (i === gBoard.length - 1) i = 0
            else i++
            // moveTo(i + 1, j)
            break;

    }

    moveTo(i, j)

}


// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}