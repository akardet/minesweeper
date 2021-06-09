import {
  revealTile,
  createBoard,
  flagTile,
  checkWin,
  checkLose,
  TILE_STATUS,
} from './minesweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeftText = document.querySelector('[data-mines-count]')
const messageText = document.querySelector('.subtext')
const resetButton = document.querySelector('#reset-btn')
resetButton.onclick = reset

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element)
    tile.element.addEventListener('click', () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      flagTile(tile)
    })
  })
})

boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener('click', stopProp, { capture: true })
    boardElement.addEventListener('contextmenu', stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = 'You Win'
  }

  if (lose) {
    messageText.textContent = 'You Lose'
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUS.FLAGGED) flagTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}

function reset() {
  location.reload()
}
