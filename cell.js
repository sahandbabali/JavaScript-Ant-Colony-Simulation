// cell.js
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.ishome = false
        this.isobstacle = false
        this.isfood = false
        this.food = 0
        this.color = color(34, 36, 92)
        this.stepedon = 0
        this.distancetohome = 100000000000
        this.pheromone = 0
    }

    update() {
        // reduce pheromone by 1 if higher than 0
        this.pheromone--
    }


    display() {
        //  stroke("red");



        if (showgrid) {
            stroke(gridcolor);
        } else {

            stroke(this.color);
        }



        fill(this.color)

        if (this.pheromone > 0) {
            fill(color(60, 100, 100, 10))
            stroke(color(60, 100, 100, 10));


        }


        rect(this.x * cellHeight, this.y * cellHeight, cellWidth, cellHeight);
    }





}
