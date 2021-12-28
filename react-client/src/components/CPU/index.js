import React from "react";
import draw from "../../utilities/draw";

function Cpu({ data: { cpuLoad, cpuWidgetId } }) {
  const canvas = document.querySelector(`[id='${cpuWidgetId}']`);
  draw(canvas, cpuLoad);
  return (
    <div className="widget widget--cpu">
      <h1>CPU Load</h1>
      <div className="canvas-wrapper">
        <canvas id={cpuWidgetId} width="200" height="200"></canvas>
        <div className="canvas-text">{cpuLoad}%</div>
      </div>
    </div>
  );
}

export default Cpu;
