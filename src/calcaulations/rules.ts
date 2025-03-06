import { BolleanInt } from "../store";

export const gridRow: number = 3;
export const voidRow: number = gridRow + 2;
const grid = gridRow * gridRow;
const voidGrid: number = voidRow * voidRow;
const gridStartsAt: number = voidRow + 2;

const computeVoidCells = (): number[] => {
  //   debugger;
  let currentVoidCell: number = 0;
  const voids: number[] = [];

  //top-voidRow of the void
  for (let i = currentVoidCell; i < voidRow; i++) {
    voids.push(0);
    currentVoidCell++;
  }

  //the side voidRows of the void (with no corners)
  //for each row run this compilation
  for (let i = 0; i < gridRow; i++) {
    voids.push(0);
    currentVoidCell++;
    for (let j = 0; j < gridRow; j++) {
      voids.push(1);
      currentVoidCell++;
    }
    voids.push(0);
    currentVoidCell++;
  }

  //bottom-voidRow of the void
  for (let i = currentVoidCell; i < voidGrid; i++) {
    voids.push(0);
    currentVoidCell++;
  }
  return voids;
};

const voidCells: number[] = computeVoidCells();

function addVoids(population: BolleanInt[]): BolleanInt[] {
  const withVoids: BolleanInt[] = population.slice();

  return withVoids;
}

function ComputeNextGeneration(population: BolleanInt[]): BolleanInt[] {
  addVoids(population);
  debugger;
  let aliveNeighbours: number = 0;
  let currentNeighbour: number;

  const newPopulation = population.slice();

  population.map((_, cellNumber) => {
    // 8 is the max number of neighbours (but we increment i by 1 on iteration #4)
    for (let i = 0; i < 8; i++) {
      switch (i) {
        case 0:
          currentNeighbour = cellNumber - gridRow - 1;
          break;
        case 1:
          currentNeighbour = currentNeighbour++;
          break;
        case 2:
          currentNeighbour = currentNeighbour++;
          break;
        case 3:
          currentNeighbour = cellNumber - 1;
          break;
        case 4:
          currentNeighbour = cellNumber + 1;
          break;
        case 5:
          currentNeighbour = cellNumber + gridRow - 1;
          break;
        case 6:
          currentNeighbour = currentNeighbour++;
          break;
        case 7:
          currentNeighbour = currentNeighbour++;
          break;
      }

      // if more than 3 neighbours are alive, the cell dies
      if (aliveNeighbours > 3) {
        newPopulation[cellNumber] = 0;
        break;
      }

      // case of nono-real neighbour
      if (0 > currentNeighbour || currentNeighbour > grid) {
        currentNeighbour++;
        continue;
      }

      aliveNeighbours += population[currentNeighbour] ? 1 : 0;
      currentNeighbour++;
    }

    if (aliveNeighbours < 2) {
      newPopulation[cellNumber] = 0;
    } else if (aliveNeighbours == 3) {
      newPopulation[cellNumber] = 1;
    } else if (aliveNeighbours == 2) {
      newPopulation[cellNumber] = newPopulation[cellNumber];
    }
  });

  return newPopulation;
}

export { ComputeNextGeneration };
