function drawBoard() {
    var s = '<table class="table">\n'

    for (var row = 0; row < 9; ++row) {
        s += "<tr>"
        for (var col = 0; col < 9; ++col) {
            var c = "cell"
            s +=
                '<td class="' +
                c +
                '"><input class="input" type="text" size="1" maxlength="1" id="c' +
                (row.toString() + col.toString()) +
                '"></td>'
        }
        s += "</tr>\n"
    }

    s += "</table>"
    document.getElementById("board").innerHTML = s
}

function resetBoardColor() {
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            sudokuBoard[row][col].style.backgroundColor = "#ffffff";
        }
    }
}

function populateBoard(text) {
    var chars = text.split("")
    var counter = 0
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var number = chars[counter++]
            // Do not show zeros
            if (number == 0) number = ""

            sudokuBoard[row][col].value = number
            sudokuBoard[row][col].style.backgroundColor = "#ffffff"
            sudokuBoard[row][col].disabled = false
            if (sudokuBoard[row][col].value != "") {
                sudokuBoard[row][col].style.backgroundColor = "#cccccc"
                sudokuBoard[row][col].disabled = true
            }
        }
    }
}

var BACKEND_URI = "https://sudoku-backend-dot-sudoku-253800.appspot.com"

function populateDifficulty(difficulty) {
    fetch(BACKEND_URI + "/" + difficulty)
        .then(function (response) {
            return response.text()
        })
        .then(function (board) {
            populateBoard(board)
        })
}

function initBoardDOM() {
    for (var row = 0; row < 9; ++row) {
        var subgrid = 0
        if (row > 2 && row < 6)
            subgrid = 3;
        else if (row > 5)
            subgrid = 6
        for (var col = 0; col < 9; ++col) {
            if (col % 3 == 0) {
                subgrid++
            }
            sudokuBoard[row][col] = document.getElementById(
                "c" + row.toString() + col.toString()
            )
            sudokuBoard[row][col].classList.add("G" + subgrid)
        }
    }
}

function getSudokuBoardIntoText() {
    var text = ""
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var cellValue = sudokuBoard[row][col].value;
            if (cellValue >= 1 && cellValue <= 9) {
                text += "" + cellValue
            } else {
                text += "."
            }
        }
    }
    return text
}

function addButtonListeners() {
    document.getElementById("btnSolve").addEventListener("click", solve)
    document.getElementById("btnEasy").addEventListener("click", function () {
        populateDifficulty("easy")
    })
    document.getElementById("btnNormal").addEventListener("click", function () {
        populateDifficulty("medium")
    })
    document.getElementById("btnHard").addEventListener("click", function () {
        populateDifficulty("hard")
    })
}

function addBoardListeners() {
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var elem = sudokuBoard[row][col]
            elem.indexRow = elem.id.substr(1, 1)
            elem.indexCol = elem.id.substr(2, 3)
            elem.addEventListener("input", checkIfInsertedValueIsValid)
        }
    }
}

function checkIfInsertedValueIsValid(evt) {
    if (document.getElementById("autoValidation").checked) {
        var indexRow = evt.target.indexRow
        var indexCol = evt.target.indexCol
        var num = evt.target.value

        if (num == "") {
            sudokuBoard[indexRow][indexCol].style.backgroundColor = "#ffffff"
        } else {
            if (validateCell(num, indexRow, indexCol)) {
                sudokuBoard[indexRow][indexCol].style.backgroundColor = "#ffffff"
            } else {
                sudokuBoard[indexRow][indexCol].style.backgroundColor = "#774444"
            }
        }
    }
    if (checkWinCondition()) {
        resetBoardColor()
        alert("Good job! You completed the Sudoku!")
    }
}

function isAllCellPopulated() {
    var text = getSudokuBoardIntoText()
    if (text.includes(".")) {
        return false
    }
    return true
}

function checkWinCondition() {
    if (isAllCellPopulated()) {
        var won = true
        for (var row = 0; row < 9; ++row) {
            for (var col = 0; col < 9; ++col) {
                var num = sudokuBoard[row][col].value;
                if (validateCell(num, row, col) == false) {
                    won = false
                    sudokuBoard[row][col].style.backgroundColor = "#774444"
                }
            }
        }
        return won
    }
}

function validateCell(num, indexRow, indexCol) {
    return (
        validateRow(num, indexRow, indexCol) &
        validateCol(num, indexRow, indexCol) &
        validateBox(num, indexRow, indexCol)
    )
}

function validateRow(num, indexRow, indexCol) {
    for (var col = 0; col < 9; col++) {
        if (sudokuBoard[indexRow][col].value == num && col != indexCol)
            return false
    }
    return true
}

function validateCol(num, indexRow, indexCol) {
    for (var row = 0; row < 9; row++) {
        if (sudokuBoard[row][indexCol].value == num && row != indexRow)
            return false
    }
    return true
}

function validateBox(num, indexRow, indexCol) {
    var subgrid = sudokuBoard[indexRow][indexCol].classList[1]
    var subgridMembers = document.getElementsByClassName(subgrid)
    for (var i = 0; i < 9; i++) {
        if (
            subgridMembers[i].value == num &&
            subgridMembers[i].id != "c" + indexRow.toString() + indexCol.toString()
        ) {
            return false
        }
    }
    return true
}

function solve() {
    var x = solver.solve(getSudokuBoardIntoText())
    populateBoard(x)
}


var solver = new SudokuSolver()
var sudokuBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

drawBoard()
initBoardDOM()
addButtonListeners()
addBoardListeners()