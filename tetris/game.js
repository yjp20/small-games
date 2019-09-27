/* vim: set fdm=syntax:
 * Author: Young Jin Park <youngjinpark20@gmail.com>
 *
 * Compared to Minimal:
 *  [x] Holding
 *  [x] Next preview
 *  [x] Data showcase
 *  [x] Lock delay
 *  [ ] Modify controls
 *  [x] Hard drop
 *  [x] Hard drop preview
 *  [x] Wall-kicking
 *  [ ] Proper restarting
 *  [ ] Score handling
 *  [ ] Combo text
 */

const main_container = document.getElementById("main-container")
const hold_container = document.getElementById("hold-container")
const next_container = document.getElementById("next-container")
const level_span = document.getElementById("level-span")
const lines_span = document.getElementById("lines-span")
const score_span = document.getElementById("score-span")
const speed_span = document.getElementById("speed-span")

const cells = []
const hold_cells = []
const next_cells = []

const ROW = 24
const COL = 10
const LOCK_DELAY = 500

// SPEED is an array
// [level] => speed
// data taken from the NES tetris game
const SPEED = [
	48/60*1000,
	43/60*1000,
	38/60*1000,
	33/60*1000,
	28/60*1000,
	23/60*1000,
	18/60*1000,
	13/60*1000,
	08/60*1000,
	06/60*1000,
	05/60*1000,
	05/60*1000,
	05/60*1000,
	04/60*1000,
	04/60*1000,
	04/60*1000,
	03/60*1000,
	03/60*1000,
	03/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	02/60*1000,
	01/60*1000,
]

// POINTS is an array
// [lines] => score
// data taken from the 2009 guideline
// t-spins are ignored since it seems like a pain
const POINTS = [0, 100, 300, 500, 800]

// BLOCKS is a 4D array
// [block][orientation][row][column] => cellColor
const BLOCKS = [
	[
		[
			[0, 0, 0 ,0],
			[1, 1, 1, 1],
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 1 ,0],
			[0, 0, 1 ,0],
			[0, 0, 1, 0],
			[0, 0, 1 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[1, 1, 1, 1],
			[0, 0, 0 ,0],
		],
		[
			[0, 1, 0 ,0],
			[0, 1, 0 ,0],
			[0, 1, 0, 0],
			[0, 1, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 2, 2 ,0],
			[0, 2, 2, 0],
			[0, 0, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 3, 0 ,0],
			[3, 3, 3, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 3, 0 ,0],
			[0, 3, 3, 0],
			[0, 3, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[3, 3, 3, 0],
			[0, 3, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 3, 0 ,0],
			[3, 3, 0, 0],
			[0, 3, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[0, 4, 4 ,0],
			[4, 4, 0, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 4, 0 ,0],
			[0, 4, 4, 0],
			[0, 0, 4 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[0, 4, 4, 0],
			[4, 4, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[4, 0, 0 ,0],
			[4, 4, 0, 0],
			[0, 4, 0 ,0],
		],
	],
	[
		[
			[0, 0, 0 ,0],
			[5, 5, 0 ,0],
			[0, 5, 5, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 5 ,0],
			[0, 5, 5, 0],
			[0, 5, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[5, 5, 0, 0],
			[0, 5, 5 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 5, 0 ,0],
			[5, 5, 0, 0],
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
			[7, 7, 0 ,0],
			[0, 7, 0, 0],
			[0, 7, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 7 ,0],
			[7, 7, 7, 0],
			[0, 0, 0 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 7, 0 ,0],
			[0, 7, 0, 0],
			[0, 7, 7 ,0],
		],
		[
			[0, 0, 0 ,0],
			[0, 0, 0 ,0],
			[7, 7, 7, 0],
			[7, 0, 0 ,0],
		],
	],
]

var state = {
	current: null,
	next: null,
	hold: null,
	orients: null,

	hodl: false,
	lines: 0,
	orient: 0,
	posX: 0,
	posY: 0,
	rows: [],
	score: 0,
	speed: 125,
	timeout: 0,
	timer: 0,
}

function init() {
	// first, we will build up the DOM to play tetris
	createGrid(COL, ROW, main_container, cells)
	createGrid(4, 4, hold_container, hold_cells)
	createGrid(4, 4, next_container, next_cells)

	// add key listeners
	document.addEventListener("keydown", function(e) {
		if (e.isComposing) return

		// movement
		if (e.code === "ArrowLeft") moveBlock(-1, 0, 0)
		if (e.code === "ArrowRight") moveBlock(1, 0, 0)
		if (e.code === "ArrowDown") moveBlock(0, 1, 0, 1)

		// rotation
		// this rotation system is a discount SRS since I wanted it to be relatively simple.
		if (e.code === "KeyZ")                         moveBlock(0,0,-1)||moveBlock(1,0,-1)||moveBlock(-1,0,-1)||moveBlock(0,-1,-1)||moveBlock(0,-2,-1)
		if (e.code === "KeyX" || e.code === "ArrowUp") moveBlock(0,0,1) ||moveBlock(1,0,1) ||moveBlock(-1,0,1) ||moveBlock(0,-1,1) ||moveBlock(0,-2,1)

		// special
		if (e.code === "Space") hardDrop()
		if (e.code === "KeyC" || e.code === "ShiftLeft") holdSwitch()
	})
}

function createGrid(x, y, par, logicalCells) {
	for (var i=0; i<y; i++) {
		var cellRow = []
		var row = document.createElement("div")
		row.className = "tetris-row"
		for (var j=0; j<x; j++) {
			var cell = document.createElement("div")
			cell.className = "tetris-cell"
			row.appendChild(cell)
			cellRow.push(cell)
		}
		logicalCells.push(cellRow)
		par.appendChild(row)
	}
}

function startGame() {
	// start blocks
	state = {
		current: null,
		next: null,
		hold: null,
		orients: null,

		hodl: false,
		lines: 0,
		orient: 0,
		posX: 0,
		posY: 0,
		score: 0,
		speed: 1000,
		rows: [],
		timeout: 0,
		timer: 0,
		starttime: (new Date).getTime(),
	}

	for (var i=0; i<ROW; i++) {
		state.rows.push([0,0,0,0,0,0,0,0,0,0])
	}

	gameTick()
}

function queueTick(time) {
	time = time || state.speed
	clearTimeout(state.timeout)
	state.timeout = setTimeout(() => {gameTick()}, time)
}

function generateRandomNext() {
	var randomIndex = Math.floor(Math.random() * BLOCKS.length)
	state.next = BLOCKS[randomIndex]
}

function gameTick() {
	if (state.next == null) generateRandomNext()
	if (state.current == null) {
		state.posY = 0
		state.posX = 3
		state.orient = 0
		state.current = state.next
		generateRandomNext()
		draw()
		queueTick()
	}
	else {moveBlock(0, 1, 0)}
}

function holdSwitch() {
	if (state.hodl) return
	[state.hold, state.current] = [state.current, state.hold]
	state.posY = 0
	state.posX = 3
	state.orient = 0
	state.hodl = true
	gameTick()
}

function hardDrop() {
	var k = getYShiftUntilCollision()
	moveBlock(0, k, 0, 2*k)
	moveBlock(0, 1, 0)
}

function moveBlock(shiftx, shifty, orientshift, points) {
	// returns 'true' if successful
	if (state.current == null) return

	var result = detectCollision(shiftx, shifty, orientshift)

	// Move i
	if (result == 0 && shifty > 0 || result == 1 && shifty > 0) queueTick()

	// Successful change in orientation or move sideways
	if (result == 0) {
		state.posY += shifty
		state.posX += shiftx
		state.orient += orientshift + state.current.length
		state.orient %= state.current.length
		draw()
		if (detectCollision(0, 1, 0) == 1) queueTick(LOCK_DELAY)
		if (points) state.score += points
		return true
	}
	else {
		if (result == 1) {
			// collides and so we set without moving
			for (var i=0; i<4; i++) {
				for (var j=0; j<4; j++) {
					var xx = j+state.posX
					var yy = i+state.posY
					if (yy < 24) {
						state.rows[yy][xx] |= state.current[state.orient][i][j]
					}
				}
			}
			state.hodl = false
			state.current = null
			gameTick()
		}

		// if result == 2 don't do anything

		removeCompletedLines()

		if (isGameOver()) {
			clearTimeout(state.timeout)
			alert("GAME OVER")
		}

		draw()
		return false
	}
}

function detectCollision(shiftx, shifty, orientshift) {
	// Returns 0 if the move is sucessful.
	// Returns 1 if the move collides due to a vertical shift and should be set.
	// Returns 2 if the move is invalid due to moving out of bounds or colliding with another block.

	if (state.current == null) return
	var tmporient = (orientshift + state.orient + state.current.length) % state.current.length
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			var xx = j+state.posX+shiftx
			var yy = i+state.posY+shifty

			// Case where the tetrimino collides with another block
			if (yy < 24) {
				if (state.current[tmporient][i][j] && state.rows[yy][xx]) {
					if (shifty) return 1
					else return 2
				}
			}

			// Case where the tetrimino would be below the playing space
			if (24 <= yy) {
				if (state.current[tmporient][i][j]) {
					if (shifty) return 1
					else return 2
				}
			}

			// Cases where the tetrimino would be horizontally outside the playing area
			if (xx < 0 && state.current[tmporient][i][j]) return 2
			if (COL-1 < xx && state.current[tmporient][i][j]) return 2
		}
	}

	return 0;
}

function removeCompletedLines() {
	var ct = 0
	for (var i=0; i<ROW; i++) {
		var complete = true
		for (var j=0; j<COL; j++) {
		  if (!(complete = complete && state.rows[i][j]))
				break;
		}
		if (complete) {
			ct ++
			state.lines ++
			state.rows.splice(i,1)
			state.rows.unshift([0,0,0,0,0,0,0,0,0,0])
		}
	}

	state.score += POINTS[ct]*(state.level+1)
}

function isGameOver() {
	for (var i=0; i<4; i++) {
		for (var j=0; j<COL; j++) {
			if (state.rows[i][j]) return 1;
		}
	}
	return 0
}

function getYShiftUntilCollision() {
	var k = 0
	for (k=0; k<24; k++) {
		if (detectCollision(0, k, 0)) break
	}
	return k-1
}

function draw() {
	var k = getYShiftUntilCollision()

	// draw main-container
	for (var i=0; i<ROW; i++) {
		for (var j=0; j<COL; j++) {
			// initally set cell value as the background
			var cellColor = state.rows[i][j]
			var cellOutline = 0
			var xx = j-state.posX
			var yy = i-state.posY
			var kk = yy-k

			if (
				0 <= yy && yy < 4 &&
				0 <= xx && xx < 4 &&
				state.current != null
			) {
				// set cell background to that of the moving block if
				// the moving block > 0. The bitwise-or is a shortcut in this case
				cellColor |= state.current[state.orient][yy][xx]
			}

			if (
				0 <= kk && kk < 4 &&
				0 <= xx && xx < 4 &&
				state.current != null
			) {
				// set cell background to that of the moving block if
				// the moving block > 0. The bitwise-or is a shortcut in this case
				cellOutline |= state.current[state.orient][kk][xx]
			}

			cells[i][j].setAttribute("color", cellColor)
			cells[i][j].setAttribute("outline", cellOutline)
		}
	}

	// draw next-container
	for (var i=0; i<4; i++) {
		for (var j=0; j<4; j++) {
			next_cells[i][j].setAttribute("color", state.next[0][i][j])
		}
	}

	// draw hold-container
	if (state.hold != null) {
		for (var i=0; i<4; i++) {
			for (var j=0; j<4; j++) {
				hold_cells[i][j].setAttribute("color", state.hold[0][i][j])
			}
		}
	}

	score_span.innerText = state.score
	lines_span.innerText = state.lines
	level_span.innerText = state.level = Math.min(Math.floor(state.lines/10), 29)
	speed_span.innerText = Math.round(state.speed = SPEED[state.level])
}

init()
startGame()
