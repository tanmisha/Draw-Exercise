import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { initialData } from "./initialData";
import './Draw.css';
export function Graph() {
  const [drawingData, setDrawingData] = useState(initialData);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 320;
    canvas.style.border = "2px solid black";
    const context = canvas.getContext("2d");
    context.scale(1, 1);
    context.lineCap = "round";
    context.strokeStyle = drawingData.currentColor;
    context.lineWidth = 2;
    contextRef.current = context;
  }, [drawingData.currentColor]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    setDrawingData({
      ...drawingData,
      startX: offsetX,
      startY: offsetY,
    });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    switch (drawingData.currentTool) {
      case "pencil":
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        break;
      case "circle":
        drawCircle(drawingData.startX, drawingData.startY, offsetX, offsetY);
        break;
      case "rectangle":
        drawRectangle(
          drawingData.startX,
          drawingData.startY,
          offsetX,
          offsetY
        );
        break;
      case "arrow":
        drawArrow(drawingData.startX, drawingData.startY, offsetX, offsetY);
        break;
      default:
        break;
    }
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const drawCircle = (startX, startY, endX, endY) => {
    contextRef.current.clearRect(0, 0, 800, 400);
    contextRef.current.beginPath();
    const radius = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
    );
    contextRef.current.arc(startX, startY, radius, 0, 2 * Math.PI);
    contextRef.current.stroke();
  };

  const drawRectangle = (startX, startY, endX, endY) => {
    contextRef.current.clearRect(0, 0, 800, 400);
    contextRef.current.beginPath();
    contextRef.current.rect(
      startX,
      startY,
      endX - startX,
      endY - startY
    );
    contextRef.current.stroke();
  };

  const drawArrow = (startX, startY, endX, endY) => {
    contextRef.current.clearRect(0, 0, 800, 400);
    contextRef.current.beginPath();

    const arrowheadSize = 15;

    contextRef.current.moveTo(startX, startY);
    contextRef.current.lineTo(endX, endY);

    const angle = Math.atan2(endY - startY, endX - startX);
    contextRef.current.lineTo(
      endX - arrowheadSize * Math.cos(angle - Math.PI / 6),
      endY - arrowheadSize * Math.sin(angle - Math.PI / 6)
    );
    contextRef.current.moveTo(endX, endY);
    contextRef.current.lineTo(
      endX - arrowheadSize * Math.cos(angle + Math.PI / 6),
      endY - arrowheadSize * Math.sin(angle + Math.PI / 6)
    );

    contextRef.current.stroke();
  };

  const handleToolChange = (tool) => {
    setDrawingData({ ...drawingData, currentTool: tool });
  };

  const handleColorChange = (color) => {
    setDrawingData({ ...drawingData, currentColor: color.hex });
  };

  const handleSave = () => {
    console.log("Drawing data saved:", drawingData);
  };

  return (
    <div className="graph-container">
      <div className="top" >
        <div className="left">
          <button onClick={() => handleToolChange("pencil")}>Pencil </button> 
          <button onClick={() => handleToolChange("circle")}>Circle </button>
          <button onClick={() => handleToolChange("rectangle")}>
            Rectangle 
          </button>
          <button onClick={() => handleToolChange("arrow")}>Arrow </button>
          <SketchPicker
            color={drawingData.currentColor}
            onChangeComplete={handleColorChange}
          />
        </div>
      
      <div className="right">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishDrawing}
          onMouseLeave={finishDrawing}
          className="canvas drawing-area"
        ></canvas>
      </div>
      </div>
      <div className="bottom">
        <button className="save-button" onClick={handleSave}>Save Drawing</button>
      </div>
    </div>
  );
}
