let main = document.getElementById('main');
let table_game = document.createElement('table');
table_game.id = 'table-mines';

let rows = 9; // (9-24)
let columns = 9; // (9-30)
let mines = 10; // (10-668)
let flags = mines;
let matriz = createMatriz(rows, columns);
let position_mines = createIndexMines(mines);
let revealCell = 0;

function createMatriz(rows, columns) {
    let matriz = [];
    for (let i = 0; i < rows; i++) {
        matriz[i] = new Array(columns).fill(0);
    }
    return matriz;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function createIndexMines(mines) {
    let position_mines = [];
    let count = 0;
    while (count != mines) {
        let array = [getRandomInt(0, rows - 1), getRandomInt(0, columns - 1)];
        let found = false;

        position_mines.forEach(element => {
            let currentArray = JSON.stringify(element);
            if (currentArray === JSON.stringify(array)) {
                found = true;
            }
        });
        if (!found) {
            count++;
            position_mines.push(array);
        }
    }
    return position_mines
}
function haveMineInPosition(pRow, pCol) {
    let mineExists = position_mines.some((element) => element[0] === pRow && element[1] === pCol);
    return mineExists;
}
function proximityNumberToMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let proximity = 0;

            if (!haveMineInPosition(i, j)) {
                for (let rowAdjacent = -1; rowAdjacent <= 1; rowAdjacent++) {
                    for (let colAdjacent = -1; colAdjacent <= 1; colAdjacent++) {
                        let newRow = i + rowAdjacent;
                        let newCol = j + colAdjacent;

                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
                            if (haveMineInPosition(newRow, newCol)) {
                                proximity++;
                            }
                        }
                    }
                }
                matriz[i][j] = proximity;
            } else {
                matriz[i][j] = 'M';
            }
        }
    }
}
function clickInCell(event) {
    let cell = event.target;
    let row = cell.parentNode.rowIndex;
    let col = cell.cellIndex;
    if (cell.classList.contains('flag')) return;
    if (haveMineInPosition(row, col)) {
        position_mines.forEach(array =>{
            showCell(array[0],array[1])
        })
        alert('Game Over')
    } else {
        revealAdjacentCells(row, col);
        if (revealCell == (rows*columns - mines)) {
            alert('Gano')
        }
    }
}



matriz.forEach(arreglo => {
    let tr = document.createElement('tr');
    arreglo.forEach(() => {
        let td = document.createElement('td');
        td.addEventListener('click', clickInCell)
        td.addEventListener('contextmenu', clickRightInCell);
        tr.appendChild(td)
    })
    table_game.appendChild(tr)
});

function clickRightInCell(event) {
    event.preventDefault();
    let cell = event.target;    
    if (!cell.classList.contains("clicked")) {
        if (cell.classList.contains("flag")) {
            flags++;
            cell.classList.remove('flag');
        } else if (flags > 0) {
            flags--;
            cell.classList.add("flag");
        }
    }  
}


function showCell(row, col) {
    let value = matriz[row][col];
    let cell = table_game.rows[row].cells[col];
    if(cell.classList.contains('flag')) return;
    cell.classList.add("clicked");
    if (value !== 0) {
        cell.textContent = value;
        if (value === 'M') {
            cell.textContent = ''
            cell.classList.add("mine");
        }
    }
    
    return value;
}

function revealAdjacentCells(row, col) {
    // Comprueba si la celda está dentro del tablero
    if (row >= 0 && col >= 0 && row < rows && col < columns) {
        // Obtiene la celda del tablero de juego
        let cell = table_game.rows[row].cells[col];
        
        // Comprueba si la celda ya ha sido revelada
        if (cell.classList.contains("clicked")) {
            return;
        }      
        // Revela la celda
        let proximity = showCell(row,col);
        revealCell++;

        if (proximity === 0) {
            // Itera sobre las celdas adyacentes
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    revealAdjacentCells(row + dx, col + dy);
                }
            }
        }
    }
}

proximityNumberToMines()

main.appendChild(table_game)



