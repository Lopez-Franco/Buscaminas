let main = document.getElementById('main');
let table_game = document.createElement('table');
table_game.id = 'table-mines';

let rows = 8;
let columns = 8;
let minas = 10;
let matriz = createMatriz(rows, columns);
let position_mines = createIndexMines(minas);

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
function createIndexMines(minas) {
    let position_mines = [];
    let count = 0;
    while (count != minas) {
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
            // let cell = table_game.rows[i].cells[j];

            if (!haveMineInPosition(i, j)) {
                for (let rowAdjacent = -1; rowAdjacent <= 1; rowAdjacent++) {
                    for (let colAdjacent = -1; colAdjacent <= 1; colAdjacent++) {
                        let newRow = i + rowAdjacent;
                        let newCol = j + colAdjacent;

                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
                            // let cellAdjacent = table_game.rows[newRow].cells[newCol];
                            if (haveMineInPosition(newRow, newCol)) {
                                proximity++;
                            }
                        }
                    }
                }
                // cell.textContent = proximity;
                matriz[i][j] = proximity;
            } else {
                matriz[i][j] = 'M'
            }
        }
    }
    console.log(matriz);
}




matriz.forEach(arreglo => {
    let tr = document.createElement('tr')
    arreglo.forEach(() => {
        let td = document.createElement('td')
        // td.dataset.hidden = "true";
        td.addEventListener('click', clickInCell)
        td.addEventListener('contextmenu', clickRightInCell);
        tr.appendChild(td)
    })
    table_game.appendChild(tr)
});



function assignMines() {
    position_mines.forEach(array => {
        table_game.rows[array[0]].cells[array[1]].innerText = 'M'
    })
}



function clickInCell(event) {
    let cell = event.target;
    let row = cell.parentNode.rowIndex;
    let col = cell.cellIndex;
    if (haveMineInPosition(row, col)) {
        showCell(row,col);
        alert('Game Over');
    } else {
        revealAdjacentCells(row, col);
    }
}
function showCell(row, col) {
    let proximity = matriz[row][col];
    table_game.rows[row].cells[col].textContent = proximity;
    return proximity === 0;
}
function clickRightInCell(event) {
    event.preventDefault(); // Evitar que aparezca el menú contextual predeterminado
    let cell = event.target; // Obtener la celda que recibió el clic derecho
    cell.classList.toggle('flag', !cell.classList.contains('flag'));

}
function revealAdjacentCells(row, col) {
    // Comprueba si la celda está dentro del tablero
    if (row >= 0 && col >= 0 && row < rows && col < columns) {
        // Obtiene la celda del tablero de juego
        let cell = table_game.rows[row].cells[col];
        console.log(cell.textContent);
        // Comprueba si la celda ya ha sido revelada
        if (cell.textContent !== '') {
            return;
        }        
        // Revela la celda
        let proximity = matriz[row][col];
        cell.textContent = proximity;
        // Si la celda tiene proximidad 0, revela las celdas adyacentes
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





// assignMines()
proximityNumberToMines()

main.appendChild(table_game)



