import { ComputeNextGeneration } from "./calcaulations/rules";
import { useLifeStore } from "./store";
import { gridRow } from "./calcaulations/rules";

function App() {
  const { isOnDrawing, toggleIsOnDrawing, population, generation, reset } =
    useLifeStore();

  const simulate = () => {
    console.log("start simulating...");
    console.log(ComputeNextGeneration(population));
  };

  const handleMainButtonClick = () => {
    if (isOnDrawing) {
      toggleIsOnDrawing();
      simulate();
    } else {
      toggleIsOnDrawing();
      reset();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-200 p-5">
      <div className="h-[20svh] w-full flex flex-col items-center justify-center">
        <div className="flex w-full items-center justify-start">
          <p>Generation: {generation}</p>
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
            <Cell key={i} cellNumber={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

interface CellProps {
  cellNumber: number;
}

function Cell({ cellNumber }: CellProps) {
  const { population, isOnDrawing, toggleCell } = useLifeStore();
  const handleCellClick = () => {
    if (isOnDrawing) {
      toggleCell(cellNumber);
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
