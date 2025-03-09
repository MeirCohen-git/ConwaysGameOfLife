import { ComputeNextGeneration } from "./calcaulations/rules";
import { gridRow } from "./calcaulations/rules";
import { useEffect, useState } from "react";
import cleanIcon from "./assets/images/clean.svg";

export type BolleanInt = 0 | 1;

function App() {
  const populationInitState: BolleanInt[] = Array.from(
    { length: gridRow * gridRow },
    () => 0
  );
  const [isOnDrawing, setIsOnDrawing] = useState<boolean>(true);
  const [population, setPopulation] = useState<BolleanInt[]>(
    populationInitState as BolleanInt[]
  );

  const [generation, setGeneration] = useState<number>(0);

  const simulate = () => {
    setIsOnDrawing(false);
    setPopulation(ComputeNextGeneration(population));
    setGeneration((prev) => prev + 1);
  };

  const toggleCell = (cellNumber: number, population: BolleanInt[]): void => {
    const populationCopy: BolleanInt[] = [...population];
    populationCopy[cellNumber] = populationCopy[cellNumber] === 0 ? 1 : 0; //toggle
    setPopulation(populationCopy);
  };

  const reset = (): void => {
    setIsOnDrawing(true);
    setGeneration(0);
    setPopulation(populationInitState);
  };

  const handleMainButtonClick = () => {
    if (isOnDrawing) {
      simulate();
    } else {
      reset();
    }
  };

  useEffect(() => {
    let intervalId: number;
    if (!isOnDrawing) {
      intervalId = setInterval(() => {
        simulate();
      }, 1000);

      // Clear the interval before creating a new one
      return () => clearInterval(intervalId);
    }
  }, [isOnDrawing, population]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-200 p-5">
      <div className="h-[20svh] w-full flex flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between">
          {!isOnDrawing && <p>Generation: {generation}</p>}
          <div>
            {isOnDrawing ? (
              population.includes(1) && ( // clean the drawing if there is a cell
                <button
                  className="flex items-center justify-center gap-1"
                  onClick={reset}
                >
                  <img className="h-5 w-5" src={cleanIcon} />
                  <div>clean board</div>
                </button>
              )
            ) : (
              <button onClick={simulate}>next</button>
            )}
          </div>
        </div>
        <div className="flex-1">
          <button
            className="bg-black hover:bg-black/90 hover:text-white/90 text-grayishWhite font-bold py-2 px-12 rounded-2xl"
            onClick={handleMainButtonClick}
          >
            {isOnDrawing ? "Simulate" : "Reset"}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div
          className="bg-black grid border border-[#000000]"
          style={{
            gridTemplateRows: `repeat(${gridRow}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${gridRow}, minmax(0, 1fr))`,
          }}
        >
          {population.map((_, i) => (
            <Cell
              key={i}
              cellNumber={i}
              isOnDrawing={isOnDrawing}
              population={population}
              onClick={toggleCell}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

interface CellProps {
  cellNumber: number;
  isOnDrawing: boolean;
  population: BolleanInt[];
  onClick: (cellNumber: number, population: BolleanInt[]) => void;
}

function Cell({
  cellNumber,
  isOnDrawing,
  population,
  onClick: toggleCell,
}: CellProps) {
  const handleCellClick = () => {
    if (isOnDrawing) {
      toggleCell(cellNumber, population);
    } else {
      console.log(
        "Can't Draw while on Simulating Mode\nPress Reset on The Main Button to enter the drawing mode again."
      );
    }
  };

  return (
    <div
      onClick={handleCellClick}
      className="size-12 bg-black flex items-center justify-center border border-white"
    >
      {/* return null if isAlive is false to avoid reacts render the value 0*/}
      {population[cellNumber] ? (
        <div className="size-7 bg-white rounded-4xl"></div>
      ) : null}
    </div>
  );
}
