let main = document.getElementById('main');
let table_game = document.createElement('table');
table_game.id = 'tabla-minas';

filas = 10
columnas = 10
let minas = 3;
position_mines = createIndexMines(minas);







let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

matrix.forEach(arreglo => {
    let tr = document.createElement('tr')
    arreglo.forEach(e => {
        let td = document.createElement('td')
        td.innerText = e
        tr.appendChild(td)
    })
    table_game.appendChild(tr)
});

function createIndexMines(minas) {
    let position_mines = [];
    let count = 0;
    while(count != minas){
        let array = [getRandomInt(0, 2), getRandomInt(0, 2)]
        let arrayString = JSON.stringify(array)
        if (!position_mines.includes(arrayString)) {
            count++
            position_mines.push(array)
        }
    }
    return position_mines
}

function assignMines() {
    position_mines.forEach(arreglo => {
        table_game.rows[arreglo[0]].cells[arreglo[1]].innerText = 'M'
    })
}

assignMines()

main.appendChild(table_game)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}