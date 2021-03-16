/*
 * Author: Young Jin Park <youngjinpark20@gmail.com>
 */


const main_container = document.getElementById("main-container")
const cells = []

const ROW = 24
const COL = 10

// BLOCKS is a 4D array
// [block][orientation][row][column]
const BLOCKS = [
	[
		[
			[0, 0, 0 ,0],
			[3, 3, 3, 3],
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 3 ,0],
			[0, 0, 3 ,0],
			[0, 0, 3, 0],
			[0, 0, 3 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[3, 3, 3, 3],
			[0, 0, 0 ,0],
		],
		[
			[0, 3, 0 ,0],
			[0, 3, 0 ,0],
			[0, 3, 0, 0],
			[0, 3, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[2, 2, 0 ,0],
			[0, 2, 2, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 2 ,0],
			[0, 2, 2, 0],
			[0, 2, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[2, 2, 0, 0],
			[0, 2, 2 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 2, 0 ,0],
			[2, 2, 0, 0],
			[2, 0, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 1, 1 ,0],
			[1, 1, 0, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 1, 0 ,0],
			[0, 1, 1, 0],
			[0, 0, 1 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[0, 1, 1, 0],
			[1, 1, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[1, 0, 0 ,0],
			[1, 1, 0, 0],
			[0, 1, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 4, 0 ,0],
			[4, 4, 4, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 4, 0 ,0],
			[0, 4, 4, 0],
			[0, 4, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[4, 4, 4, 0],
			[0, 4, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 4, 0 ,0],
			[4, 4, 0, 0],
			[0, 4, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[5, 5, 0 ,0],
			[0, 5, 0, 0],
			[0, 5, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 5 ,0],
			[5, 5, 5, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 5, 0 ,0],
			[0, 5, 0, 0],
			[0, 5, 5 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[5, 5, 5, 0],
			[5, 0, 0 ,0],
		],
	],
	[
		[
			[0, 6, 6 ,0],
			[0, 6, 0 ,0],
			[0, 6, 0, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 6, 6 ,6],
			[0, 0, 0, 6],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 6 ,0],
			[0, 0, 6, 0],
			[0, 6, 6 ,0],
		],
		[
			[0, 0, 0 ,0],
			[6, 0, 0 ,0],
			[6, 6, 6, 0],
			[0, 0, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 7, 7 ,0],
			[0, 7, 7, 0],
			[0, 0, 0 ,0],
		],
	],
]

var state = {
	current: null,
	orient: 0,
	orients: null,
	posX: 0,
	posY: 0,
	rows: [],
	speed: 250,
	timer: 0,
}

function init() {
	// first, we will build up the DOM to play tetris
	for (var i=0; i<ROW; i++) {
		var cellRow = []
		var row = document.createElement("div")
		row.className = "tetris-row"
		for (var j=0; j<COL; j++) {
			var cell = document.createElement("div")
			cell.className = "tetris-cell"
			row.appendChild(cell)
			cellRow.push(cell)
		}
		cells.push(cellRow)
		main_container.appendChild(row)
	}

	// add key listeners
	document.addEventListener("keydown", function(e) {
		if (e.isComposing) return
		if (e.code === "ArrowLeft") moveBlock(-1, 0, 0)
		if (e.code === "ArrowRight") moveBlock(1, 0, 0)
		if (e.code === "ArrowDown") moveBlock(0, 1, 0)
		if (e.code === "ArrowUp") moveBlock(0, 0, 1)
	})
}

function startGame() {
	// clear data
	state.rows = []
	for (var i=0; i<ROW; i++) {
		state.rows.push([0,0,0,0,0,0,0,0,0,0])
	}

	// start blocks
	gameTick()
}

function gameTick() {
	// pick one of the blocks by random
	if (state.current == null) {
		var randomIndex = Math.floor(Math.random() * BLOCKS.length)
		state.posY = 0
		state.posX = 3
		state.current = BLOCKS[randomIndex][0]
		state.orients = BLOCKS[randomIndex]
		state.orient = 0
	}

	moveBlock(0, 1, 0)
}

function moveBlock(shiftx, shifty, orientshift) {
	if (state.current == null) return

	var result = detectCollision(shiftx, shifty, orientshift)

	if (result == 0 || result == 1 && shifty) {
		clearTimeout(state.timer)
		state.timer = setTimeout(() => {gameTick()}, state.speed)
	}

	if (result == 0) {
		state.posY += shifty
		state.posX += shiftx
		state.orient += orientshift
		state.orient %= state.orients.length
		state.current = state.orients[state.orient]
	}

	if (result == 1) {
		// collides
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				var xx = j+state.posX
				var yy = i+state.posY
				if (yy < 24) {
					state.rows[yy][xx] |= state.current[i][j]
				}
			}
		}
		state.current = null
	}

	removeCompletedLines()

	if (isGameOver()) {
		clearTimeout(state.timer)
		alert("GAME OVER")
	}

	draw()
}

function detectCollision(shiftx, shifty, orientshift) {
	var tmporient = (orientshift + state.orient) % state.orients.length
	var tmpcurrent = state.orients[tmporient]

	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			var xx = j+state.posX+shiftx
			var yy = i+state.posY+shifty

			if (yy < 24) {
				if (tmpcurrent[i][j] && state.rows[yy][xx]) {
					if (shifty) return 1
					else return 2
				}
			}
			if (24 <= yy) {
				if (tmpcurrent[i][j]) {
					return 1
				}
			}
			if (xx < 0 && tmpcurrent[i][j]) return 2
			if (COL-1 < xx && tmpcurrent[i][j]) return 2
		}
	}

	return 0;
}

function removeCompletedLines() {
	for (var i=0; i<ROW; i++) {
		var complete = true
		for (var j=0; j<COL; j++) {
		  if (!(complete = complete && state.rows[i][j]))
				break;
		}
		if (complete) {
			state.rows.splice(i,1)
			state.rows.unshift([0,0,0,0,0,0,0,0,0,0])
		}
	}
}

function isGameOver() {
	for (var i=0; i<4; i++) {
		for (var j=0; j<COL; j++) {
			if (state.rows[i][j]) return 1;
		}
	}
	return 0
}

function draw() {
	for (var i=0; i<ROW; i++) {
		for (var j=0; j<COL; j++) {
			// initally set cell value as the background
			cellValue = state.rows[i][j]
			var xx = j-state.posX
			var yy = i-state.posY

			if (
				0 <= yy && yy < 4 &&
				0 <= xx && xx < 4 &&
				state.current != null
			) {
				// set cell background to that of the moving block if
				// the moving block > 0. The bitwise-or is a shortcut in this case
				cellValue |= state.current[yy][xx]
			}

			cells[i][j].setAttribute("color", cellValue)
		}
	}
}

init()
startGame()
