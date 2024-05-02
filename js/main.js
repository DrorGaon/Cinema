'use strict'

var gCinema
var gElSelectedSeat = null
var gRemovalTimeoutId
var gElHighlitedCells

function onInit() {
    gCinema = createCinema()
    renderCinema()
}

function createCinema() {
    const cinema = []

    for (var i = 0; i < 6; i++) {
        cinema[i] = []
        for (var j = 0; j < 10; j++) {
            const cell = { isSeat: j !== 7 && j !== 2 && i !== 3}
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }
            cinema[i][j] = cell
        }
    }
    cinema[4][4].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]

            // For a cell of type SEAT add seat class
            var className = (cell.isSeat) ? 'seat' : ''
            
            // For a cell that is booked add booked class
            if (cell.isBooked) {
                className += ' booked'
            }
            // Add a seat title
            const title = `Seat: ${i + 1}, ${j + 1}`

            strHTML += `\t<td title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            data-i="${i}" data-j="${j}">
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]

    // ignore none seats and booked seats
    if (!cell.isSeat || cell.isBooked) return

    // Selecting a seat
    elCell.classList.add('selected')
    
    // Only a single seat should be selected
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')

    }

    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    if(gRemovalTimeoutId){
        removeHighlights(gElHighlitedCells)
        clearInterval(gRemovalTimeoutId)
    }

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const elBtn = elPopup.querySelector('.btn-book-seat')

    const seat = gCinema[pos.i][pos.j]

    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
    gElSelectedSeat.classList.toggle('selected')
    gElSelectedSeat = null
}

function onBookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()

    hideSeatDetails()
}

function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked){
                count++
            }
        }
    }
    return count
}

function highlightCells(){
    if (gRemovalTimeoutId) clearTimeout(gRemovalTimeoutId)

    gElHighlitedCells = []
    const rowIdx = +gElSelectedSeat.dataset.i
    const colIdx = +gElSelectedSeat.dataset.j
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gCinema[0].length) continue
            var currCell = gCinema[i][j]
            if (currCell.isSeat && !currCell.isBooked){
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.classList.add('highlight')
                gElHighlitedCells.push(elCell)
            } 
        }    
    }

    gRemovalTimeoutId = setTimeout(() => {
        removeHighlights(gElHighlitedCells)
    }, 2500);
}

function removeHighlights(gElHighlitedCells){
    for(var i = 0; i < gElHighlitedCells.length; i++){
        gElHighlitedCells[i].classList.remove('highlight')
    }
}