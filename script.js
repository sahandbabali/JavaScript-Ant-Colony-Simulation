let canvasBox = document.getElementById("canvasbox")
let showgridcheck = document.getElementById("showgridcheck")
const canvasWidth = canvasBox.clientWidth;
const canvasHeight = canvasWidth / 2;
let canvas;
let cols = 180
let rows = 90; // Number of columns and rows in the grid
let gridcolor = 200;
let cellWidth, cellHeight; // Size of each cell
let ants = [];
let antscount = 10
let grid
let showgrid = false
let homecell
let pheromoneLife = 200

// for obstacles and maybe food
let noiseOffsetX, noiseOffsetY;
let noiseScale = 0.9;
let obstaclecount = 15
let foodcount = 50

showgridcheck.addEventListener("change", (e) => {
    showgrid = e.target.checked
})


function setup() {
    colorMode(HSB);

    frameRate(20)
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasBox);
    homecell = {
        x: floor(cols / 2),
        y: floor(rows / 2)
    }
    cellWidth = width / cols;
    cellHeight = height / rows;

    // Create a 2D array to represent the grid
    grid = create2DArray(cols, rows);
    // Initialize the grid with values, e.g., 0 for empty cells
    initializeGrid();
    // sethome
    grid[homecell.x][homecell.y].ishome = true
    grid[homecell.x][homecell.y].color = "#65451F"
    grid[homecell.x][homecell.y].distancetohome = 0
    grid[homecell.x][homecell.y].isobstacle = true






    // Initialize noise offsets
    noiseOffsetX = random(50);
    noiseOffsetY = random(50);
    setfood()

    setobstacles()

    createantstest()




}

function draw() {
    background(color(34, 36, 92));

    // if (showgrid) {
    //     // Draw the grid
    //     for (let i = 0; i < cols; i++) {
    //         for (let j = 0; j < rows; j++) {
    //             let x = i * cellWidth;
    //             let y = j * cellHeight;
    //             stroke(gridcolor);
    //             fill(grid[i][j].color)
    //             rect(x, y, cellWidth, cellHeight);
    //         }
    //     }
    // }    /




    // Move and display each ant
    for (let ant of ants) {
        ant.move();
    }


    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            //  fill(grid[i][j].color)
            grid[i][j].update()
            grid[i][j].display()

        }
    }


    // Move and display each ant
    for (let ant of ants) {
        ant.display();
    }



}


// Create a 2D array with the given number of columns and rows
function create2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

// Initialize the grid with default values, e.g., 0 for empty cells
function initializeGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j)
        }
    }

}

function createantstest() {
    // Create a few ants and add them to the array
    for (let i = 0; i < antscount; i++) {
        // ants.push(new Ant(floor(random(cols)), floor(random(rows))));
        ants.push(new Ant(homecell.x, homecell.y));

    }
}

function setobstacles() {

    // Find and draw random points on the grid
    for (let i = 0; i < obstaclecount; i++) { // Generate 20 random points
        let x, y;

        // Ensure that the random point is not equal to the home cell
        do {
            x = floor(random(cols)); // Random column index
            y = floor(random(rows)); // Random row index

        } while (isNearHomeCell(x, y, homecell.x, homecell.y));

        createBlobGrassPatch(x * cellWidth, y * cellHeight, floor(random(20, 70))); // Adjust parameters as needed

    }
}


function setfood() {
    for (let i = 0; i < foodcount; i++) { // Generate 20 random points
        let x, y;

        // Ensure that the random point is not equal to the home cell
        do {
            x = floor(random(cols)); // Random column index
            y = floor(random(rows)); // Random row index

        } while (isNearHomeCell(x, y, homecell.x, homecell.y));

        createBlobFoodPatch(x * cellWidth, y * cellHeight, floor(random(10, 30))); // Adjust parameters as needed

    }
}

function createBlobGrassPatch(centerX, centerY, radius) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellWidth;
            let y = j * cellHeight;
            let d = dist(x, y, centerX, centerY);

            // Use noise to add organic shape and wavy edges to the grass patch
            let radiusNoise = noise(noiseOffsetX + i * noiseScale, noiseOffsetY + j * noiseScale) * 20;
            let edgeNoise = map(noise(noiseOffsetX + i * noiseScale * 0.5, noiseOffsetY + j * noiseScale * 0.5), 0, 1, -10, 10);

            if (d < radius + radiusNoise + edgeNoise) {

                grid[i][j].isfood = false
                grid[i][j].food = 0


                grid[i][j].color = "#79E0EE" // Green color for grass
                grid[i][j].iswater = true
                grid[i][j].isobstacle = true

            }
        }
    }
    noiseOffsetX += 0.1;
    noiseOffsetY += 0.1;
}


function createBlobFoodPatch(centerX, centerY, radius) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellWidth;
            let y = j * cellHeight;
            let d = dist(x, y, centerX, centerY);

            // Use noise to add organic shape and wavy edges to the grass patch
            let radiusNoise = noise(noiseOffsetX + i * noiseScale, noiseOffsetY + j * noiseScale) * 20;
            let edgeNoise = map(noise(noiseOffsetX + i * noiseScale * 0.5, noiseOffsetY + j * noiseScale * 0.5), 0, 1, -10, 10);

            if (d < radius + radiusNoise + edgeNoise) {
                grid[i][j].color = "#7A9D54"
                grid[i][j].isfood = true
                grid[i][j].food = 1
                grid[i][j].isobstacle = true
            }
        }
    }
    noiseOffsetX += 0.1;
    noiseOffsetY += 0.1;
}



function isNearHomeCell(x, y, homeX, homeY) {
    // Check if the point (x, y) is within a radius of 5 cells (adjust as needed) from the home cell (homeX, homeY)
    const radius = 5;
    return abs(x - homeX) <= radius && abs(y - homeY) <= radius;
}