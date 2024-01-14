// sketch.js

// Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Define the possible groupings
let squares_from_left, end_squares, squares_from_bottom, squares_from_top;

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

// Array to store randomness points
let randomnessPoints = [];

// Current position variables
let currentX = 0;
let currentY;

function preload() {
    // Load images and associate them with their names
    for (let squareName in squareImages) {
        squareImages[squareName] = loadImage('tiles/' + squareName + '.png');
    }
}

function filterTilesByPositionAndEdge(tileGroup, currentY) {
    let chooseFrom; // Declare chooseFrom variable

    // If the current Y position is 0, filter out tiles with a top-ending edge
        // If the current Y position is 1, filter out tiles with a top-ending edge from squares_from_left
    if (currentY === 0) {
        if (tileGroup === squares_from_left) {
            chooseFrom = [squareImages.horiz, squareImages.ld];
        }
        else if (tileGroup === squares_from_bottom) {
            chooseFrom = [squareImages.br];
        }
    }
    
    // If the current Y position is 7, filter out tiles with a bottom-ending edge from squares_from_left
    else if (currentY === 6*94) {
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

    createCanvas(Width, Height);
    background(220);

    // Define the different types of squares based on the attributes
    squares_from_left = [squareImages.horiz, squareImages.ld, squareImages.lu];
    squares_from_bottom = [squareImages.bu, squareImages.br];
    squares_from_top = [squareImages.td, squareImages.tr];

    // Draw empty squares as the background
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 7; j++) {
            image(squareImages.empty, i * cellDim, j * cellDim);
        }
    }
}
  
  function draw() {
    noLoop();
    // Draw the image

    // RANDOMNESS POINT 1
    // Randomly select an initial y-position from the 7 squares height
    let initialYPos = getRandomInt(1, 7);
    currentY = (initialYPos-1) * 94;

    // Save the random number to the randomnessPoints array
    randomnessPoints.push({initialYPos: initialYPos});
    console.log(randomnessPoints);
    console.log('Current Y:', currentY);

    let tileGroup = squares_from_left;

    while (currentX < 94 * 9) {

        chooseFrom = filterTilesByPositionAndEdge(tileGroup, currentY);
        console.log('Choose from:', chooseFrom);
        console.log('Tile group:', tileGroup);

        // RANDOMNESS POINT 2
        // Randomly select an initial square and draw it
        selectedSquare = random(chooseFrom);
        squareName = Object.keys(squareImages).find(key => squareImages[key] === selectedSquare);
        randomnessPoints.push({square: squareName})
        console.log(randomnessPoints);

        // Draw the selected square at the calculated position
        image(selectedSquare, currentX, currentY);

        // Set the ending edge of the current tile
        lastTileEndingEdge = squareEndingEdges[squareName];
        console.log('Last tile ending edge:', lastTileEndingEdge);

        // Update the current position based on the ending edge of the last tile
        switch (lastTileEndingEdge) {
            case 'right':
                currentX += 94; // Move one square to the right
                // Stay at the same y position
                break;
            case 'top':
                // Stay at the same x position
                currentY -= 94; // Move one square up
                break;
            case 'bottom':
                // Stay at the same x position
                currentY += 94; // Move one square down
                break;
            // Add more cases as needed
        }

        console.log('Square name:', squareName);
        console.log('Current X:', currentX);
        console.log('Current Y:', currentY);

        let nextTileGroup;
        switch (lastTileEndingEdge) {
            case 'right':
                nextTileGroup = squares_from_left;
                break;
            case 'top':
                nextTileGroup = squares_from_bottom;
                break;
            case 'bottom':
                nextTileGroup = squares_from_top;
                break;
        }
        tileGroup = nextTileGroup;
        console.log('Tile group:', tileGroup);
    }
  }