import { BolleanInt } from "../App";

export const gridRow: number = 50;
export const voidRow: number = gridRow + 2;
const voidGrid: number = voidRow * voidRow;

const addVoids = (population: BolleanInt[]): [BolleanInt[], number[]] => {
  // debugger;
  let currentVoidCell: number = 0;
  let currentGridCell: number = 0;
  let voidCells: number[] = [];

  const populationWithVoids: BolleanInt[] = [];

  //top-voidRow of the void
  for (let i = currentVoidCell; i < voidRow; i++) {
    populationWithVoids.push(0);
    voidCells.push(currentVoidCell);
    currentVoidCell++;
  }

  //the side voidRows of the void (with no corners)
  //for each row run this compilation
  for (let i = 0; i < gridRow; i++) {
    populationWithVoids.push(0);
    voidCells.push(currentVoidCell);
    currentVoidCell++;
    for (let j = 0; j < gridRow; j++) {
      populationWithVoids.push(population[currentGridCell]); //True Grid cells
      currentGridCell++; // increment the grid cell which is (voidRow + 2) steps back from the currentVoidCell
      currentVoidCell++;
    }
    populationWithVoids.push(0);
    voidCells.push(currentVoidCell);
    currentVoidCell++;
  }

  //bottom-voidRow of the void
  for (let i = currentVoidCell; i < voidGrid; i++) {
    populationWithVoids.push(0);
    voidCells.push(currentVoidCell);
    currentVoidCell++;
  }

  return [populationWithVoids, voidCells];
};

function ComputeNextGeneration(population: BolleanInt[]): BolleanInt[] {
  const [populationWithVoids, voidCells] = addVoids(population);

  const newPopulation = populationWithVoids.slice();

  let currentNeighbour: number = 0;

  populationWithVoids.forEach((_, cellNumber) => {
    // debugger
    if (voidCells.includes(cellNumber)) {
      newPopulation[cellNumber] = 0; // void cells are always dead
      return;
    }

    let aliveNeighbours: number = 0;
    // 8 is the max number of neighbours (but we increment i by 1 on iteration #4)
    for (let i = 1; i < 9; i++) {
      // 1 is the min number of neighbours
      switch (i) {
        case 1:
          currentNeighbour = cellNumber - voidRow - 1;
          break;
        case 2:
          currentNeighbour = cellNumber - voidRow;
          break;
        case 3:
          currentNeighbour = cellNumber - voidRow + 1;
          break;
        case 4:
          currentNeighbour = cellNumber - 1;
          break;
        case 5:
          currentNeighbour = cellNumber + 1;
          break;
        case 6:
          currentNeighbour = cellNumber + voidRow - 1;
          break;
        case 7:
          currentNeighbour = cellNumber + voidRow;
          break;
        case 8:
          currentNeighbour = cellNumber + voidRow + 1;
          break;
      }

      aliveNeighbours += populationWithVoids[currentNeighbour] ? 1 : 0;

      // if more than 3 neighbours are alive, the cell dies
      if (aliveNeighbours > 3) {
        newPopulation[cellNumber] = 0;
        return;
      }
    }

    if (aliveNeighbours < 2) {
      newPopulation[cellNumber] = 0;
    } else if (aliveNeighbours == 3) {
      newPopulation[cellNumber] = 1;
    } else if (aliveNeighbours == 2) {
      newPopulation[cellNumber] = newPopulation[cellNumber];
    }
  });

  //extract the population from the void
  const extractedPopulation: BolleanInt[] = [];
  newPopulation.forEach((_, i) => {
    if (voidCells.includes(i)) {
      return;
    } else {
      extractedPopulation.push(newPopulation[i]);
    }
  });

  return extractedPopulation;
}

export { ComputeNextGeneration };
