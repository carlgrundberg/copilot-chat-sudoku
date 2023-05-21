import Head from 'next/head'
import { useState, useEffect } from 'react'

function NumberSelector({ onSelect }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [selectedNumber, setSelectedNumber] = useState(null)

  const handleNumberClick = (number) => {
    setSelectedNumber(number)
    onSelect(number)
  }

  return (
    <div className="flex justify-center mb-4">
      {numbers.map((number) => (
        <button
          key={number}
          className={`w-8 h-8 rounded-full border border-gray-300 mx-1 ${
            selectedNumber === number ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleNumberClick(number)}
        >
          {number}
        </button>
      ))}
    </div>
  )
}

export default function Sudoku() {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ])

  const [selectedNumber, setSelectedNumber] = useState(null)
  const [conflictingCells, setConflictingCells] = useState([])

  useEffect(() => {
    // Check for conflicts in each row
    const rowConflicts = board.map((row, rowIndex) =>
      row.reduce((conflicts, cell, colIndex) => {
        if (cell !== 0 && row.indexOf(cell) !== colIndex) {
          conflicts.push([rowIndex, colIndex])
        }
        return conflicts
      }, [])
    )
    // Check for conflicts in each column
    const colConflicts = board[0].map((_, colIndex) =>
      board.reduce((conflicts, row, rowIndex) => {
        const cell = row[colIndex]
        if (cell !== 0 && board.map((row) => row[colIndex]).indexOf(cell) !== rowIndex) {
          conflicts.push([rowIndex, colIndex])
        }
        return conflicts
      }, [])
    )
    // Check for conflicts in each 3x3 square
    const squareConflicts = []
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const square = board.slice(i, i + 3).map((row) => row.slice(j, j + 3)).flat()
        const squareConflictsInSquare = square.reduce((conflicts, cell, index, arr) => {
          if (cell !== 0 && arr.indexOf(cell) !== index) {
            conflicts.push([i + Math.floor(index / 3), j + (index % 3)])
          }
          return conflicts
        }, [])
        squareConflicts.push(...squareConflictsInSquare)
      }
    }

    const conflicts = [...rowConflicts.flat(), ...colConflicts.flat(), ...squareConflicts]
    setConflictingCells(conflicts)
  }, [board])

  const handleCellClick = (row, col) => {
    if (selectedNumber !== null) {
      const newBoard = [...board]
      newBoard[row][col] = selectedNumber
      setBoard(newBoard)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Head>
        <title>Sudoku Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-4 text-center">Sudoku Game</h1>
        <NumberSelector onSelect={setSelectedNumber} />
        <table className="table-fixed mx-auto border-4 border-gray-900">
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 py-2 text-center align-middle border border-gray-300 rounded-lg bg-white shadow-md transition-colors duration-300 hover:bg-gray-100 ${
                      (rowIndex + 1) % 3 === 0 && 'border-b-4'
                    } ${(colIndex + 1) % 3 === 0 && 'border-r-4'} ${
                      conflictingCells.some((c) => c[0] === rowIndex && c[1] === colIndex) && 'bg-red-500'
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell !== 0 ? cell : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}