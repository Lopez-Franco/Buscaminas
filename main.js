let main = document.getElementById('main');
let table_game = document.createElement('table');
table_game.id = 'table-mines';

let rows = 9;
let columns = 9;
let minas = 10;
let matriz = createMatriz(rows, columns);
let position_mines = createIndexMines(minas);

matriz.forEach(arreglo => {
    let tr = document.createElement('tr')
    arreglo.forEach(e => {
        let td = document.createElement('td')
        td.dataset.hidden = "true";
        td.addEventListener('click', clickInCell)
        td.addEventListener('contextmenu', clickRightInCell);
        tr.appendChild(td)
    })
    table_game.appendChild(tr)
});

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
function assignMines() {
    position_mines.forEach(array => {
        table_game.rows[array[0]].cells[array[1]].innerText = 'M'
    })
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function createMatriz(rows, columns) {
    let matriz = [];
    for (let i = 0; i < rows; i++) {
        matriz[i] = new Array(columns).fill(0);
    }
    return matriz;
}
function proximityNumberToMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let proximity = 0;
            let cell = table_game.rows[i].cells[j];

            if (cell.textContent != 'M') {
                for (let rowAdjacent = -1; rowAdjacent <= 1; rowAdjacent++) {
                    for (let colAdjacent = -1; colAdjacent <= 1; colAdjacent++) {
                        let newRow = i + rowAdjacent;
                        let newCol = j + colAdjacent;

                        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
                            let cellAdjacent = table_game.rows[newRow].cells[newCol];
                            if (cellAdjacent.textContent == 'M') {
                                proximity++;
                            }
                        }
                    }
                }
                cell.textContent = proximity;
            }
            
        }
    }
}
function clickInCell(event){
    let cell = event.target;
    let row = cell.parentNode.rowIndex; // Obtener el índice de la fila
    let col = cell.cellIndex; // Obtener el índice de la columna
    showCell(cell)
    releaseAdjacentCells(row,col)

}
function showCell(cell){
    let hidden = cell.dataset.hidden;
    if (hidden === "true"){
        cell.dataset.hidden = "false";
    }
}
function clickRightInCell(event){
    event.preventDefault(); // Evitar que aparezca el menú contextual predeterminado
    let cell = event.target; // Obtener la celda que recibió el clic derecho
    cell.classList.toggle('flag', !cell.classList.contains('flag'));

}
function releaseAdjacentCells(row, col){
    if(table_game.rows[row].cells[col].textContent === '0'){
        for (let i = row - 1; i <= row + 1 ; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < rows && j >= 0 && j < columns) {                   
                    let hidden = table_game.rows[i].cells[j].dataset.hidden;
                    console.log(hidden);
                    if (!hidden === "true") {
                        showCell(table_game.rows[i].cells[j])
                        releaseAdjacentCells(i,j)
                    }
                }
            }            
        }
    }
}
assignMines()
proximityNumberToMines()
main.appendChild(table_game)