function drawBoard() {
    var s = '<table class="table">\n'

    for (var row = 0; row < 9; ++row) {
        s += '<tr>';
        for (var col = 0; col < 9; ++col) {
            var c = 'cell';
            s += '<td class="' + c + '"><input class="input" type="text" size="1" maxlength="1" id="c' + (row.toString() + col.toString()) + '"></td>'
        }
        s += '</tr>\n';
    }

    s += '</table>'
    document.getElementById('board').innerHTML = s
}

function resetBoardColor() {
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            sudokuBoard[row][col].style.backgroundColor = '#ffffff'
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
            if (number == 0)
                number = ''

            sudokuBoard[row][col].value = number
            sudokuBoard[row][col].style.backgroundColor = '#ffffff'
            sudokuBoard[row][col].disabled = false
            if (sudokuBoard[row][col].value != '') {
                sudokuBoard[row][col].style.backgroundColor = '#cccccc'
                sudokuBoard[row][col].disabled = true
            }

        }
    }
}

function populateEasy() {
    populateBoard("026730941571492638349168275195384762762951384438627519914573826257816493683249157")
}

function populateNormal() {
    populateBoard("820005041001492600340100075105304060700050384038620500014073020207800403080049107")
}

function populateDifficult() {
    populateBoard("320000080000700506000081070000008362000090000653100000030210000908007000010000039")
}


function initBoardDOM() {
    for (var row = 0; row < 9; ++row) {
        var subgrid = 0
        if (row > 2 && row < 6)
            subgrid = 3
        else if (row > 5)
            subgrid = 6

        for (var col = 0; col < 9; ++col) {
            if ((col % 3) == 0) {
                subgrid++
            }
            sudokuBoard[row][col] = document.getElementById('c' + row.toString() + col.toString())
            sudokuBoard[row][col].classList.add('G' + subgrid)
        }
    }
}


function getSudokuBoardIntoText() {
    var text = ''
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var cellValue = sudokuBoard[row][col].value
            if (cellValue >= 1 && cellValue <= 9) {
                text += '' + cellValue
            } else {
                text += '.'
            }
        }
    }
    return text
}


function addButtonListeners() {
    document.getElementById('btnSolve').addEventListener('click', solve)
    document.getElementById('btnEasy').addEventListener('click', populateEasy)
    document.getElementById('btnNormal').addEventListener('click', populateNormal)
    document.getElementById('btnDifficult').addEventListener('click', populateDifficult)
}

function addBoardListeners() {
    for (var row = 0; row < 9; ++row) {
        for (var col = 0; col < 9; ++col) {
            var elem = sudokuBoard[row][col]
            elem.indexRow = elem.id.substr(1, 1)
            elem.indexCol = elem.id.substr(2, 3)
            elem.addEventListener('input', checkIfInsertedValueIsValid)
            elem.addEventListener('click', changeCurrentFocusedCell)
        }
    }
}

function changeCurrentFocusedCell(evt) {
    currentFocusedCellRow = evt.target.indexRow
    currentFocusedCellCol = evt.target.indexCol
}


function checkIfInsertedValueIsValid(evt) {
    console.log("insid")
    if (document.getElementById('autoValidation').checked) {
        var indexRow = evt.target.indexRow
        var indexCol = evt.target.indexCol
        var num = evt.target.value

        if (num == '') {
            sudokuBoard[indexRow][indexCol].style.backgroundColor = '#ffffff'
        } else {
            if (validateCell(num, indexRow, indexCol)) {
                sudokuBoard[indexRow][indexCol].style.backgroundColor = '#ffffff'
            } else {
                sudokuBoard[indexRow][indexCol].style.backgroundColor = '#774444'
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
    if (text.includes('.')) {
        return false
    }
    return true
}

function checkWinCondition() {
    if (isAllCellPopulated()) {
        var won = true
        for (var row = 0; row < 9; ++row) {
            for (var col = 0; col < 9; ++col) {
                var num = sudokuBoard[row][col].value
                if (validateCell(num, row, col) == false) {
                    won = false
                    sudokuBoard[row][col].style.backgroundColor = '#774444'
                }
            }
        }
        return won
    }
}

function validateCell(num, indexRow, indexCol) {
    return validateRow(num, indexRow, indexCol) &
        validateCol(num, indexRow, indexCol) &
        validateBox(num, indexRow, indexCol)
}


function validateRow(num, indexRow, indexCol) {
    for (var col = 0; col < 9; col++) {
        if (sudokuBoard[indexRow][col].value == num && col != indexCol)
            return false;
    }
    return true;
}


function validateCol(num, indexRow, indexCol) {
    for (var row = 0; row < 9; row++) {
        if (sudokuBoard[row][indexCol].value == num && row != indexRow)
            return false;
    }
    return true;
}


function validateBox(num, indexRow, indexCol) {
    var subgrid = sudokuBoard[indexRow][indexCol].classList[1]
    var subgridMembers = document.getElementsByClassName(subgrid)
    for (var i = 0; i < 9; i++) {
        if (subgridMembers[i].value == num && (subgridMembers[i].id != ('c' + indexRow.toString() + indexCol.toString()))) {
            return false
        }
    }
    return true
}


function inputIntoCell(str) {
    if (currentFocusedCellRow != '' && currentFocusedCellCol != '') {
        sudokuBoard[currentFocusedCellRow][currentFocusedCellCol].value = str
        sudokuBoard[currentFocusedCellRow][currentFocusedCellCol].target.indexRow = currentFocusedCellRow
        sudokuBoard[currentFocusedCellRow][currentFocusedCellCol].target.indexCol = currentFocusedCellCol
        var customEvent = new CustomEvent("newMessage", {
            detail: {
                message: "Hello World!",
                time: new Date(),
            },
            bubbles: true,
            cancelable: true
        }
    )
        checkIfInsertedValueIsValid(sudokuBoard[currentFocusedCellRow][currentFocusedCellCol])
    }
}

function addInputListener() {
    document.getElementById('nbrInput1').addEventListener("click", function(){inputIntoCell('1')})
    document.getElementById('nbrInput2').addEventListener("click", function(){inputIntoCell('2')})
    document.getElementById('nbrInput3').addEventListener("click", function(){inputIntoCell('3')})
    document.getElementById('nbrInput4').addEventListener("click", function(){inputIntoCell('4')})
    document.getElementById('nbrInput5').addEventListener("click", function(){inputIntoCell('5')})
    document.getElementById('nbrInput6').addEventListener("click", function(){inputIntoCell('6')})
    document.getElementById('nbrInput7').addEventListener("click", function(){inputIntoCell('7')})
    document.getElementById('nbrInput8').addEventListener("click", function(){inputIntoCell('8')})
    document.getElementById('nbrInput9').addEventListener("click", function(){inputIntoCell('9')})
    document.getElementById('nbrInputDel').addEventListener("click", function(){inputIntoCell('')})
}

function solve() {
    var x = solver.solve(getSudokuBoardIntoText())
    populateBoard(x)
}

var currentFocusedCellRow = ''
var currentFocusedCellCol = ''
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
// addInputListener()
