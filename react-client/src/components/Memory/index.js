import draw from "../../utilities/draw";

const Memory = ({
  data: { memoryUsage, freeMemory, usedMemory, totalMemory, memoryWidgetId },
}) => {
  const canvas = document.querySelector(`[id='${memoryWidgetId}']`);

  draw(canvas, memoryUsage * 100);

  const totalMemoryInGB = ((totalMemory / 1073741824) * 100) / 100;
  const freeMemoryInGB = Math.floor((freeMemory / 1073741824) * 100) / 100;
  return (
    <div className="widget widget--memory">
      <h1>Memory</h1>
      <div className="canvas-wrapper">
        <canvas id={memoryWidgetId} height="200" width="200"></canvas>
        <p className="canvas-text">{memoryUsage * 100}%</p>
      </div>
      <section className="information-section">
        <h3>Total Memory:</h3>
        <p>{totalMemoryInGB}GB</p>
        <h3>Free Memory:</h3>
        <p>{freeMemoryInGB}GB</p>
      </section>
    </div>
  );
};

export default Memory;
