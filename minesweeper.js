export const TILE_STATUS = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  FLAGGED: 'flagged',
}

export function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, numberOfMines)

  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement('div')
      element.dataset.status = TILE_STATUS.HIDDEN
      const tile = {
        element,
        x,
        y,
        mine: minePositions.some((value) => isEqual(value, { x, y })),
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }
      row.push(tile)
    }
    board.push(row)
  }
  return board
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUS.HIDDEN) return

  if (tile.mine) {
    tile.status = TILE_STATUS.MINE
    return
  }

  tile.status = TILE_STATUS.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter((t) => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach((tile) => revealTile(board, tile))
  } else {
    tile.element.textContent = mines.length
  }
}

export function flagTile(tile) {
  if (
    tile.status !== TILE_STATUS.FLAGGED &&
    tile.status !== TILE_STATUS.HIDDEN
  ) {
    return
  }

  const minesLeftText = document.querySelector('[data-mines-count]')
  let minesLeft = minesLeftText && parseInt(minesLeftText.textContent)

  if (tile.status === TILE_STATUS.FLAGGED) {
    tile.status = TILE_STATUS.HIDDEN
    minesLeftText.textContent = ++minesLeft
  } else {
    tile.status = TILE_STATUS.FLAGGED
    minesLeftText.textContent = --minesLeft
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUS.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUS.HIDDEN ||
            tile.status === TILE_STATUS.FLAGGED))
      )
    })
  })
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUS.MINE
    })
  })
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = []

  while (positions.length < numberOfMines) {
    const newCoord = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    }

    if (!positions.some((value) => isEqual(value, newCoord))) {
      positions.push(newCoord)
    }
  }

  return positions
}

function nearbyTiles(board, { x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      if (tile) tiles.push(tile)
    }
  }

  return tiles
}

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}
