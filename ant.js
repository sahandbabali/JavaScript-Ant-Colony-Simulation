// ant.js
class Ant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.states = ["searching", "delivery"]
        this.state = this.states[0]
        this.steps = 0
        this.lastxys = []

    }

    move() {

        // decide next move based on current state
        if (this.state == this.states[0]) {
            // do search mode
            let istherefood = this.findFoodNearby()
            let istherepheromone = this.findCellWithLowestPheromone()
            //if nearby cells have food => update state


            if (istherefood) {
                // console.log("fooooooooood!!!!!")
                // change state
                this.state = this.states[1]

                // reduce one food from cell
                grid[istherefood.x][istherefood.y].food--

                // if food value is 0 after reduction remove the food cell
                if (grid[istherefood.x][istherefood.y].food == 0) {
                    grid[istherefood.x][istherefood.y].color = color(34, 36, 92)
                    grid[istherefood.x][istherefood.y].isfood = false
                    grid[istherefood.x][istherefood.y].isobstacle = false
                    //    this.x = istherefood.x
                    //  this.y = istherefood.y
                    grid[istherefood.x][istherefood.y].pheromone = 299


                }

                // put pheromone (low to high)
                grid[this.x][this.y].pheromone = 300


            } else if (istherepheromone) {
                // console.log("pheromoneee!!!!!")
                // move to the cell with lowest pheromone higher than 0
                this.x = istherepheromone.x
                this.y = istherepheromone.y
                // update current cell distance
                this.steps++

                grid[this.x][this.y].distancetohome = min(grid[this.x][this.y].distancetohome, this.steps)

                // step on current location
                grid[this.x][this.y].stepedon++
                grid[this.x][this.y].color = this.darkenColorHSB(grid[this.x][this.y].color)




            } else {
                this.randomWalk()

                this.steps++

                // update current cell distance
                grid[this.x][this.y].distancetohome = min(grid[this.x][this.y].distancetohome, this.steps)

                // step on current location
                grid[this.x][this.y].stepedon++
                grid[this.x][this.y].color = this.darkenColorHSB(grid[this.x][this.y].color)

            }

        } else if (this.state == this.states[1]) {
            // do delivery mode

            let istherehome = this.findHomeNearby()
            let nextsteptohome = this.findCellWithLowestDistanceToHome()

            if (istherehome) {
                // we got next to home cell

                // change state

                this.state = this.states[0]

                // reset steps to 1
                this.steps = 1
                // this.x = homecell.x
                // this.y = homecell.y

            } else {
                // set feromone on the cell
                grid[this.x][this.y].pheromone = 300
                // go to the next cell with the lowest distance to home
                this.x = nextsteptohome.x
                this.y = nextsteptohome.y



            }


        }




        // // Add current X and Y to the beginning of the lastxys array
        // this.lastxys.unshift({ x: this.x, y: this.y });

        // // Check if the lastxys array has more than 10 items
        // if (this.lastxys.length > 10) {
        //     // Remove older items from the end to keep the array size at 10
        //     this.lastxys.splice(10);
        // }

        // // Count occurrences of X and Y coordinates separately
        // const countsX = {};
        // const countsY = {};

        // for (const { x, y } of this.lastxys) {
        //     countsX[x] = (countsX[x] || 0) + 1;
        //     countsY[y] = (countsY[y] || 0) + 1;

        //     if (countsX[x] > 4 || countsY[y] > 4) {
        //         // Change ant's state to "searching"
        //         this.state = "searching";
        //         break; // Exit the loop early if searching state is set
        //     }
        // }
    }



    display() {
        stroke("black");
        fill("black")
        rect(this.x * cellHeight, this.y * cellHeight, cellWidth, cellHeight);
    }



    darkenColorHSB(inputColor) {
        // Extract the hue, saturation, and brightness components of the input color
        let h = hue(inputColor);
        let s = saturation(inputColor);
        let b = brightness(inputColor);

        // Reduce the brightness component by one level (e.g., subtract 1)
        b = max(30, b - 1);

        // Create a new color with the adjusted brightness component
        let darkenedColor = color(h, s, b);
        return darkenedColor;
    }


    findFoodNearby() {
        const directions = [
            { x: this.x, y: this.y - 1 },  // Top
            { x: this.x, y: this.y + 1 },  // Bottom
            { x: this.x - 1, y: this.y },  // Left
            { x: this.x + 1, y: this.y }   // Right
        ];

        for (const direction of directions) {
            const x = direction.x;
            const y = direction.y;

            if (
                x >= 0 && x < grid.length &&
                y >= 0 && y < grid[0].length &&
                grid[x][y].isfood
            ) {
                return { x, y };
            }
        }

        // No neighboring cell has food
        return null;
    }


    // randomWalk() {
    //     let validDirections = []; // Store valid directions to move

    //     // Check each direction and see if it's a valid move
    //     if (this.x > 0 && !grid[this.x - 1][this.y].isobstacle) {
    //         validDirections.push(0); // Move left
    //     }
    //     if (this.x < cols - 1 && !grid[this.x + 1][this.y].isobstacle) {
    //         validDirections.push(1); // Move right
    //     }
    //     if (this.y > 0 && !grid[this.x][this.y - 1].isobstacle) {
    //         validDirections.push(2); // Move up
    //     }
    //     if (this.y < rows - 1 && !grid[this.x][this.y + 1].isobstacle) {
    //         validDirections.push(3); // Move down
    //     }

    //     // If there are valid directions, choose one randomly
    //     if (validDirections.length > 0) {
    //         const randomDirection = random(validDirections);
    //         if (randomDirection === 0) {
    //             this.x -= 1; // Move left
    //         } else if (randomDirection === 1) {
    //             this.x += 1; // Move right
    //         } else if (randomDirection === 2) {
    //             this.y -= 1; // Move up
    //         } else if (randomDirection === 3) {
    //             this.y += 1; // Move down
    //         }
    //     }
    // }

    randomWalk() {
        let validDirections = []; // Store valid directions to move

        // Check each direction and see if it's a valid move
        if (this.x > 0 && !grid[this.x - 1][this.y].isobstacle && !this.cellContainsAnt(this.x - 1, this.y)) {
            validDirections.push(0); // Move left
        }
        if (this.x < cols - 1 && !grid[this.x + 1][this.y].isobstacle && !this.cellContainsAnt(this.x + 1, this.y)) {
            validDirections.push(1); // Move right
        }
        if (this.y > 0 && !grid[this.x][this.y - 1].isobstacle && !this.cellContainsAnt(this.x, this.y - 1)) {
            validDirections.push(2); // Move up
        }
        if (this.y < rows - 1 && !grid[this.x][this.y + 1].isobstacle && !this.cellContainsAnt(this.x, this.y + 1)) {
            validDirections.push(3); // Move down
        }

        // If there are valid directions, choose one randomly
        if (validDirections.length > 0) {
            const randomDirection = random(validDirections);
            if (randomDirection === 0) {
                this.x -= 1; // Move left
            } else if (randomDirection === 1) {
                this.x += 1; // Move right
            } else if (randomDirection === 2) {
                this.y -= 1; // Move up
            } else if (randomDirection === 3) {
                this.y += 1; // Move down
            }
        }
    }


    // findCellWithLowestDistanceToHome() {
    //     let minDistance = Infinity;
    //     let minDistanceX = -1;
    //     let minDistanceY = -1;

    //     const directions = [
    //         { x: this.x, y: this.y - 1 },  // Top
    //         { x: this.x, y: this.y + 1 },  // Bottom
    //         { x: this.x - 1, y: this.y },  // Left
    //         { x: this.x + 1, y: this.y }   // Right
    //     ];

    //     for (const direction of directions) {
    //         const x = direction.x;
    //         const y = direction.y;

    //         if (
    //             x >= 0 && x < grid.length &&
    //             y >= 0 && y < grid[0].length
    //         ) {
    //             const distance = grid[x][y].distancetohome;
    //             if (distance < minDistance) {
    //                 minDistance = distance;
    //                 minDistanceX = x;
    //                 minDistanceY = y;
    //             }
    //         }
    //     }

    //     // Check if any cell with a lower distancetohome was found
    //     if (minDistanceX !== -1 && minDistanceY !== -1) {
    //         return { x: minDistanceX, y: minDistanceY };
    //     } else {
    //         return null; // No cell with a lower distancetohome found
    //     }
    // }
    findCellWithLowestDistanceToHome() {
        let minDistance = Infinity;
        let minDistanceX = -1;
        let minDistanceY = -1;

        const directions = [
            { x: this.x, y: this.y - 1 },  // Top
            { x: this.x, y: this.y + 1 },  // Bottom
            { x: this.x - 1, y: this.y },  // Left
            { x: this.x + 1, y: this.y }   // Right
        ];

        for (const direction of directions) {
            const x = direction.x;
            const y = direction.y;

            if (
                x >= 0 && x < grid.length &&
                y >= 0 && y < grid[0].length &&
                !this.cellContainsAnt(x, y)
            ) {
                const distance = grid[x][y].distancetohome;
                if (distance < minDistance) {
                    minDistance = distance;
                    minDistanceX = x;
                    minDistanceY = y;
                }
            }
        }

        // Check if any cell with a lower distancetohome was found
        if (minDistanceX !== -1 && minDistanceY !== -1) {
            return { x: minDistanceX, y: minDistanceY };
        } else {
            return null; // No cell with a lower distancetohome found
        }
    }



    // Find a neighboring cell with the ishome property set to true in top, bottom, left, or right direction
    findHomeNearby() {
        const directions = [
            { x: this.x, y: this.y - 1 },  // Top
            { x: this.x, y: this.y + 1 },  // Bottom
            { x: this.x - 1, y: this.y },  // Left
            { x: this.x + 1, y: this.y }   // Right
        ];

        for (const direction of directions) {
            const x = direction.x;
            const y = direction.y;

            if (
                x >= 0 && x < grid.length &&
                y >= 0 && y < grid[0].length &&
                grid[x][y].ishome
            ) {
                return { x, y };
            }
        }

        // No neighboring cell ishome
        return null;
    }



    // findCellWithLowestPheromone() {
    //     let minPheromone = Infinity;
    //     let minPheromoneX = -1;
    //     let minPheromoneY = -1;

    //     const directions = [
    //         { x: this.x, y: this.y - 1 },  // Top
    //         { x: this.x, y: this.y + 1 },  // Bottom
    //         { x: this.x - 1, y: this.y },  // Left
    //         { x: this.x + 1, y: this.y }   // Right
    //     ];

    //     for (const direction of directions) {
    //         const x = direction.x;
    //         const y = direction.y;

    //         if (
    //             x >= 0 && x < grid.length &&
    //             y >= 0 && y < grid[0].length &&
    //             grid[x][y].pheromone > 0 && grid[x][y].pheromone < 298
    //         ) {
    //             if (grid[x][y].pheromone < minPheromone) {
    //                 minPheromone = grid[x][y].pheromone;
    //                 minPheromoneX = x;
    //                 minPheromoneY = y;
    //             }
    //         }
    //     }

    //     // Check if any cell with pheromone greater than 0 and less than 298 was found
    //     if (minPheromoneX !== -1 && minPheromoneY !== -1) {
    //         return { x: minPheromoneX, y: minPheromoneY };
    //     } else {
    //         return false; // No cell with pheromone within the specified range found
    //     }
    // }
    findCellWithLowestPheromone() {
        let minPheromone = Infinity;
        let minPheromoneX = -1;
        let minPheromoneY = -1;

        const directions = [
            { x: this.x, y: this.y - 1 },  // Top
            { x: this.x, y: this.y + 1 },  // Bottom
            { x: this.x - 1, y: this.y },  // Left
            { x: this.x + 1, y: this.y }   // Right
        ];

        for (const direction of directions) {
            const x = direction.x;
            const y = direction.y;

            // Check if the cell is within the grid and if there's no ant in that cell
            if (
                x >= 0 && x < grid.length &&
                y >= 0 && y < grid[0].length &&
                grid[x][y].pheromone > 0 && grid[x][y].pheromone < 298 &&
                !this.cellContainsAnt(x, y)
            ) {
                if (grid[x][y].pheromone < minPheromone) {
                    minPheromone = grid[x][y].pheromone;
                    minPheromoneX = x;
                    minPheromoneY = y;
                }
            }
        }

        // Check if any cell with pheromone greater than 0 and less than 298 was found
        if (minPheromoneX !== -1 && minPheromoneY !== -1) {
            return { x: minPheromoneX, y: minPheromoneY };
        } else {
            return false; // No cell with pheromone within the specified range found
        }
    }

    // Function to check if a cell contains an ant
    cellContainsAnt(x, y) {
        for (const ant of ants) {
            if (ant.x === x && ant.y === y) {
                return true;
            }
        }
        return false;
    }








}
