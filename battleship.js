var location1 = 3;
var location1 = 4;
var location1 = 5;

var guess;
var hits = 0;
var guesses = 0;

var isSunk = false;

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }   
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,

    
    ships: [{ locations: ["", "", ""], hits: ["", "", ""] },
        { locations: ["", "", ""], hits: ["", "", ""] },
        { locations: ["", "", ""], hits: ["", "", ""] }
     ],
    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("TRAFIONY");
                if ( this.isSunk(ship)) {
                    view.displayMessage("Zatopi³eœ mój okrêt");
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Spud³owa³eœ");
        return false;
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
            return true;
        }
    },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) { // W poziomie.
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
        } else { // W pionie.
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }


}

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Ups, proszê wpisaæ literê i cyfrê.");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Ups, to nie s¹ wspó³rzêdne!");
        } else if (row < 0 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            alert("Ups, pole poza plansz¹!");
        } else {
            return row + column;
        }
    }
    return null;
}

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Zatopi³eœ wszystkie moje okrêty, w " +
                    this.guesses + " próbach.");
            }
        }
    }
}



function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}
window.onload = init;
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}





