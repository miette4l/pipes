// sketch.js

console.log($fx.hash)

p5.disableFriendlyErrors = true;

// Function to get a random element from an array using fx.rand()
function getRandomElementFromArray(array) {
    const index = Math.floor($fx.rand() * array.length);
    return array[index];
}

// Define the different types of squares and their names
let squareImages = {
    empty: null,
    horiz: null,
    td: null,
    bu: null,
    ld: null,
    lu: null,
    tr: null,
    br: null
};

// Define the border images and their names
let borderImages = {
    left: null,
    right: null,
    top: null,
    bot: null
};

// Define top & bottom border dimensions
let borderHeight = 29
let borderWidth = 31

// Define the possible groupings
let squares_from_left, end_squares, squares_from_bottom, squares_from_top;

let initialYPos;
let selectedSquare;
let squareName;
let randPick;
let chooseFrom;
let lastTileEndingEdge = ''; // Variable to store the ending edge of the last selected tile

// Mapping between square names and their ending edges
let squareEndingEdges = {
    horiz: 'right',
    td: 'bottom',
    bu: 'top',
    ld: 'bottom',
    lu: 'top',
    tr: 'right',
    br: 'right'
};

// Current position variables
let currentX = borderWidth;
let currentY = borderHeight;

let sequence = [];

function scaleToRangeAndRound(value, min, max) {
    return Math.floor((value * (max - min + 1)) + min);
}

// MAKE THE RANDOMNESS!!! Randomness #1 - fx.rand()
initialYPos = scaleToRangeAndRound($fx.rand(), 1, 7);
console.log(initialYPos);

function preload() {
    // Load images and associate them with their names
    for (let squareName in squareImages) {
        squareImages[squareName] = loadImage('images/' + squareName + '.png');
    }
    for (let borderName in borderImages) {
        borderImages[borderName] = loadImage('images/' + borderName + '.png');
    }
}

function filterTilesByPositionAndEdge(tileGroup, currentY) {
    let chooseFrom; // Declare chooseFrom variable

    // If the current Y position is 0, filter out tiles with a top-ending edge
        // If the current Y position is 1, filter out tiles with a top-ending edge from squares_from_left
    if (currentY === borderHeight) {
        if (tileGroup === squares_from_left) {
            chooseFrom = [squareImages.horiz, squareImages.ld];
        }
        else if (tileGroup === squares_from_bottom) {
            chooseFrom = [squareImages.br];
        }
    }
    
    // If the current Y position is 7, filter out tiles with a bottom-ending edge from squares_from_left
    else if (currentY === borderHeight + 6*94) {
        if (tileGroup === squares_from_left) {
            chooseFrom = [squareImages.horiz, squareImages.lu];
        }
        else if (tileGroup === squares_from_top) {
            chooseFrom = [squareImages.tr];
        }
    }

    else {
        chooseFrom = tileGroup;
    }
    return chooseFrom;
}

function setup() {
    // Define dimensions for each square
    let cellDim = 94;

    // Canvas is 9 squares wide and 7 squares tall
    let Width = 9 * cellDim;
    let Height = 7 * cellDim;

    createCanvas(Width + 2 * borderWidth, Height + 2 * borderHeight);
    background(220);

    // Define the different types of squares based on the attributes
    squares_from_left = [squareImages.horiz, squareImages.ld, squareImages.lu];
    squares_from_bottom = [squareImages.bu, squareImages.br];
    squares_from_top = [squareImages.td, squareImages.tr];

    // Draw empty squares as the background
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 7; j++) {
            image(squareImages.empty, (i * cellDim)+borderWidth, (j * cellDim)+borderHeight);
        }
    }

    // Set the starting position
    currentY += (initialYPos - 1) * 94;

    // Set the starting tile group
    let tileGroup = squares_from_left;

    // Populate the sequence array with information about each square in the sequence
    while (currentX < (94 * 9) + borderWidth) {
        chooseFrom = filterTilesByPositionAndEdge(tileGroup, currentY);

        // RANDOMNESS #2 (*however many times) - getRandomElement uses fx.rand()
        // Randomly select an initial square and add it to the sequence array
        selectedSquare = getRandomElementFromArray(chooseFrom);
        squareName = Object.keys(squareImages).find(key => squareImages[key] === selectedSquare);

        sequence.push({
            square: selectedSquare,
            x: currentX,
            y: currentY,
            endingEdge: squareEndingEdges[squareName],
            tileGroup: tileGroup
        });

        // Update the current position based on the ending edge of the last tile
        switch (squareEndingEdges[squareName]) {
            case 'right':
                currentX += 94; // Move one square to the right
                break;
            case 'top':
                currentY -= 94; // Move one square up
                break;
            case 'bottom':
                currentY += 94; // Move one square down
                break;
        }

        // Determine the next tile group
        switch (squareEndingEdges[squareName]) {
            case 'right':
                tileGroup = squares_from_left;
                break;
            case 'top':
                tileGroup = squares_from_bottom;
                break;
            case 'bottom':
                tileGroup = squares_from_top;
                break;
        }
    }
}
  
  function draw() {
    noLoop();
    // Draw the border images

    // Draw the top border
    image(borderImages.top, borderWidth, 0);
    // Draw the left border
    image(borderImages.left, 0, 0);
    // Draw the right border
    image(borderImages.right, 9 * 94 + borderWidth, 0);
    // Draw the bottom border
    image(borderImages.bot, borderWidth, 7 * 94 + borderHeight);

    // Draw the sequence of squares based on the pre-determined sequence
    for (let i = 0; i < sequence.length; i++) {
        let squareInfo = sequence[i];
        image(squareInfo.square, squareInfo.x, squareInfo.y);
    }
  }