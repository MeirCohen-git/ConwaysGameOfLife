import { ComputeNextGeneration } from "./calcaulations/rules";
import { gridRow } from "./calcaulations/rules";
import { useEffect, useState } from "react";
import cleanIcon from "./assets/images/clean.svg";
import settingsIcon from "./assets/images/settings.svg";
import playIcon from "./assets/images/play.svg";
import stopIcon from "./assets/images/stop.svg";

export type BolleanInt = 0 | 1;

function App() {
  const populationInitState: BolleanInt[] = Array.from(
    { length: gridRow * gridRow },
    () => Math.floor(Math.random() * 2) as BolleanInt
  );
  const [isOnDrawing, setIsOnDrawing] = useState<boolean>(true);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [population, setPopulation] = useState<BolleanInt[]>(
    populationInitState as BolleanInt[]
  );

  const [generation, setGeneration] = useState<number>(0);

  const simulate = () => {
    console.log("Current Generation:", generation);
    setIsOnDrawing(false);
    setPopulation(ComputeNextGeneration(population));
    setGeneration((prev) => prev + 1);
  };

  const toggleCell = (cellNumber: number, population: BolleanInt[]): void => {
    const populationCopy: BolleanInt[] = [...population];
    populationCopy[cellNumber] = populationCopy[cellNumber] === 0 ? 1 : 0; // !(...) cant be used because of type BolleanInt
    setPopulation(populationCopy);
  };

  const reset = (): void => {
    setIsOnDrawing(true);
    setGeneration(0);
    setPopulation(Array.from(
      { length: gridRow * gridRow },
      () => 0
    ));
  };

  const handleMainButtonClick = () => {
    if (isOnDrawing) {
      simulate();
    } else {
      reset();
    }
  };

  const generationDaelayInMs: number = 50;

  useEffect(() => {
    let intervalId: number;
    if (!isOnDrawing) {
      intervalId = setInterval(() => {
        simulate();
      }, generationDaelayInMs);

      // Clear the interval before creating a new one
      return () => clearInterval(intervalId);
    }
  }, [isOnDrawing, population]);

  useEffect(() => {
    {
      generation > 0 && !population.includes(1) && reset();
    }
  }, [population]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-200 p-5">
      <div className="h-[20svh] w-full flex flex-col items-center justify-center p-10">
        <div className="flex w-full items-center justify-center gap-10">
          <div className="flex-1 flex items-center justify-start">
            <img className="size-20" src={settingsIcon} />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <button
              className="hover:bg-black/40 hover:text-white/90 text-grayishWhite font-bold rounded-2xl"
              onClick={handleMainButtonClick}
            >
              <img
                className="size-20"
                src={isOnDrawing ? playIcon : stopIcon}
              />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-end">
            {isOnDrawing ? (
              <button className="flex gap-1" onClick={reset}>
                {population.includes(1) && (
                  <img className="size-15" src={cleanIcon} />
                )}
              </button>
            ) : (
              <p>Generation: {generation}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
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
              isMouseDown={isMouseDown}
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
  isMouseDown: boolean;
  population: BolleanInt[];
  onClick: (cellNumber: number, population: BolleanInt[]) => void;
}

function Cell({
  cellNumber,
  isOnDrawing,
  isMouseDown,
  population,
  onClick: toggleCell,
}: CellProps) {
  const handleDrawing = () => {
    if (isOnDrawing) {
      isMouseDown && toggleCell(cellNumber, population);
    } else {
      console.log(
        "Can't Draw while on Simulating Mode\nPress Reset on The Main Button to enter the drawing mode again."
      );
    }
  };

  const cubeSizeInPx: number = 15;

  return (
    <div
      onMouseEnter={handleDrawing}
      className={`${
        population[cellNumber] ? "bg-white" : "bg-black"
      } flex items-center justify-center`}
      style={{
        width: cubeSizeInPx,
        height: cubeSizeInPx,
      }}
    ></div>
  );
}
