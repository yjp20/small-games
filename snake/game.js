/*
 * Author: Young Jin Park <youngjinpark20@gmail.com>
 */

var game_container = document.getElementById("game-container");

var ROW = 64
var COL = 64
var state = {
	timer: null,
	ticktime: 300,
	grid: [],
	data: [],
	food: [],
	pos: [Math.floor(ROW/2), Math.floor(COL/2)],
	dir: [0, 1],
	trace: [],
	length: 1,
}

function init() {
	buildGrid()
	addListeners()
}

function buildGrid() {
	for (let r=0; r<ROW; r++) {
		row = []
		row_div = document.createElement("div")
		row_div.className = "row"
		for (let c=0; c<COL; c++) {
			grid_div = document.createElement("div")
			grid_div.className = "grid"
			row_div.appendChild(grid_div)
			row.push(grid_div)
		}
		state.grid.push(row)
		game_container.appendChild(row_div)
	}
}

function addListeners() {
	document.addEventListener("keydown", function (e) {
		console.log(e.keyCode)
		if (e.keyCode == 38) state.dir = [-1, 0];
		if (e.keyCode == 37) state.dir = [0, -1];
		if (e.keyCode == 40) state.dir = [1, 0];
		if (e.keyCode == 39) state.dir = [0, 1];
	})
}

function genFood() {
	c = Math.floor(Math.random()*COL)
	r = Math.floor(Math.random()*ROW)
	state.food = [r, c]
}

function buildLogicalGrid() {
	state.data = []
	for (let r=0; r<ROW; r++) {
		row = []
		for (let c=0; c<COL; c++) {
			row.push(0)
		}
		state.data.push(row)
	}
}

function startGame() {
	state.pos = [Math.floor(ROW/2), Math.floor(COL/2)]
	buildLogicalGrid()
	state.trace = [[state.pos[0], state.pos[1]]]
	state.data[state.pos[0]][state.pos[1]] = 1
	state.length = 1
	genFood()
	draw()
	queueTick()
}

function queueTick() {
	clearTimeout(state.timer)
	state.timer = setTimeout(gameTick, state.ticktime)
}

function gameEnd() {
	clearTimeout(state.timer)
	alert("Game Over")
	startGame()
}

function gameTick() {
	state.pos[0] += state.dir[0]
	state.pos[1] += state.dir[1]

	let out_r = state.pos[0] < 0 || ROW <= state.pos[0]
	let out_c = state.pos[1] < 0 || COL <= state.pos[1]
	let overlap = !out_r && !out_c && state.data[state.pos[0]][state.pos[1]]
	if (out_r || out_c || overlap) {
		gameEnd()
		return
	}

	state.data[state.pos[0]][state.pos[1]] = 1
	state.trace.unshift([state.pos[0], state.pos[1]])

	let eat = state.pos[0] == state.food[0] && state.pos[1] == state.food[1]
	if (eat) {
		state.length ++
		genFood()
	}
	else {
		let t = state.trace[state.trace.length-1]
		state.trace.pop()
		state.data[t[0]][t[1]] = 0
		state.data[state.pos[0]][state.pos[1]] = 1
	}
	draw()
	queueTick()
}

function draw() {
	for (let r=0; r<ROW; r++) {
		for (let c=0; c<COL; c++) {
			if (state.data[r][c]) {
				state.grid[r][c].setAttribute("block", "")
			}
			else state.grid[r][c].removeAttribute("block")
		}
	}
	state.grid[state.food[0]][state.food[1]].setAttribute("block", "food")
}

init()
startGame()
