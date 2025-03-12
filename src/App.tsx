import React, { useEffect, useRef } from "react";

type point = [number, number];
type line = [point, point];
type pLines = [line, line]; //Parallel lines
type linearEquationResult = { m: number; b: number; axis?: string };

const App = () => {
  const width: number = window.innerWidth * 0.9;
  const height: number = window.innerHeight * 0.9;

  const scale = 20; // how many whole numbers are in 1 axis
  const XscaleUnit = width / scale;
  const YscaleUnit = height / scale;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const Xaxis = canvas.getContext("2d");
    const Yaxis = canvas.getContext("2d");

    if (!Xaxis || !Yaxis) return;

    Xaxis.fillStyle = "black";
    Xaxis.beginPath();
    Xaxis.moveTo(0, 250);
    Xaxis.lineTo(width, height / 2);
    Xaxis.stroke();
    Xaxis.font = "15px Arial";
    Xaxis.fillText(`x`, 20, height / 2 - 10);
    Xaxis.closePath();

    Yaxis.fillStyle = "black";
    Yaxis.beginPath();
    Yaxis.moveTo(width / 2, 0);
    Yaxis.lineTo(width / 2, height);
    Yaxis.stroke();
    Yaxis.font = "15px Arial";
    Yaxis.fillText(`y`, width / 2 - 15, 20);
    Yaxis.closePath();

    const drawDot = (
      coordinates: point,
      name: string,
      showCoordinates: boolean = false
    ): void => {
      const [x, y] = coordinates;
      //currecting the coordinates so [0,0] is in the middle of the canvas
      const xPos = x * XscaleUnit + width / 2;
      const yPos = -y * YscaleUnit + height / 2;
      const point = canvas.getContext("2d");
      if (!point) return;

      point.beginPath();
      point.fillStyle = "black";
      point.arc(xPos, yPos, 4, 0, 2 * Math.PI);
      point.fill();
      point.font = "light";
      point.fillText(name, xPos - 12, yPos + 20);
      showCoordinates &&
        point.fillText(`(${xPos}, ${yPos})`, xPos + 10, yPos + 20);
    };

    const drawLine = (points: line): void => {
      const line = canvas.getContext("2d");
      if (!line) return;

      const [x1, y1] = points[0];
      const [x2, y2] = points[1];
      line.beginPath();
      line.moveTo(x1 * XscaleUnit + width / 2, -y1 * YscaleUnit + height / 2);
      line.lineTo(x2 * XscaleUnit + width / 2, -y2 * YscaleUnit + height / 2);
      line.stroke();
    };

    const linearEquation = (line: line): linearEquationResult => {
      const [x1, y1] = line[0];
      const [x2, y2] = line[1];

      // check for vertical line
      if (x1 === x2) {
        return { m: 0, b: x1, axis: "x" };
      }

      // check for horizontal line
      if (y1 === y2) {
        return { m: 0, b: y1, axis: "y" };
      }

      const m: number = (y1 - y2) / (x1 - x2);
      const b: number = y1 - m * x1;

      return { m, b };
    };

    const findIntersectionPoint = ([e1, e2]: [
      linearEquationResult,
      linearEquationResult
    ]): point | null => {
      const { m: m1, b: b1, axis: axis1 } = e1;
      const { m: m2, b: b2, axis: axis2 } = e2;

      console.log("m1", m1, "b1", b1, "axis:", axis1);
      console.log("m2", m2, "b2", b2, "axis:", axis2);

      let x: number;
      let y: number;

      //If both lines have no slope
      if (m1 == 0 && m2 == 0) {
        //check if are parallel
        if (axis1 === axis2) {
          console.log("Lines are parallel, no intersection.");
          return null;
        }
        //If they are perpendicular
        else {
          //get the b of the horizontal line
          if (e1.axis === "x") {
            return [e1.b, e2.b];
          } else {
            return [e2.b, e1.b];
          }
        }
      } else if (m1 == 0 || m2 == 0) {
        if (m1 == 0) {
          if (e1.axis === "x") {
            x = e1.b;
            y = m2 * x + b2;
            return [x, y];
          } else {
            y = e1.b;
            x = (y - b2) / m2;
            return [x, y];
          }
        } else {
          if (e2.axis === "x") {
            x = e2.b;
            y = m1 * x + b1;
            return [x, y];
          } else {
            y = e2.b;
            x = (y - b1) / m1;
            return [x, y];
          }
        }
      }

      // Check for parallel lines (same slope)
      if (m1 === m2) {
        if (b1 !== b2) {
          console.log("Lines are parallel, no intersection.");
          return null;
        } else {
          console.log("Lines are coincident, infinite intersections.");
          return null;
        }
      }

      // Calculate intersection point
      x = (b2 - b1) / (m1 - m2);
      y = m1 * x + b1;

      return [x, y];
    };

    interface checkForRightAnglesParams {
      parallelLines: pLines;
    }

    const lineDistance = (line: line): number => {
      const [x1, y1] = line[0];
      const [x2, y2] = line[1];

      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    const intersectionsCreateRightAngles = ({
      parallelLines,
    }: checkForRightAnglesParams): boolean => {
      const [l1, l2] = parallelLines;
      const ml1 = linearEquation(l1).m;
      const ml2 = linearEquation(l2).m;

      const isPerpendicular: boolean = ml1 * ml2 == -1;
      return isPerpendicular;
    };

    const a: point = [2, 9];
    const b: point = [6, -2];
    const c: point = [-1, 3];
    const d: point = [7, 3];

    drawDot(a, "A");
    drawDot(b, "B");
    drawDot(c, "C");
    drawDot(d, "D");

    const ab: line = [a, b];
    const cd: line = [c, d];

    drawLine(ab);
    drawLine(cd);

    const o: point | null = findIntersectionPoint([
      linearEquation(ab),
      linearEquation(cd),
    ]);

    if (!o) return;
    console.log(o);
    drawDot(o, "O");

    console.log(
      intersectionsCreateRightAngles({
        parallelLines: [ab, cd],
      })
    );
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas
      ref={canvasRef}
      height={height}
      width={width}
      className="bg-transparent block border border-gray-200 shadow-lg shadow-gray-400 rounded-2xl"
    ></canvas>
    </div>
  );
};
export default App;
