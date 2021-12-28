import CPU from "../CPU";
import Info from "../Info";
import Memory from "../Memory";
import "./widget.css";

const Widget = ({ data }) => {
  const {
    osType,
    osName,
    osRelease,
    osArch,
    uptime,
    freeMemory,
    usedMemory,
    totalMemory,
    memoryUsage,
    cpuModel,
    cpuSpeed,
    coreCount,
    cpuLoad,
    macAddress,
    isActive,
  } = data;

  const cpuWidgetId = `cpu-widget-${macAddress}`;
  const memoryWidgetId = `memory-widget-${macAddress}`;
  const cpuData = { cpuLoad, cpuWidgetId };
  const memoryData = {
    totalMemory,
    usedMemory,
    memoryUsage,
    freeMemory,
    memoryWidgetId,
  };
  const machineInfo = {
    osType,
    osName,
    osRelease,
    osArch,
    cpuModel,
    cpuSpeed,
    coreCount,
    macAddress,
    uptime,
  };

  let notActiveDiv = "";
  if (!isActive) {
    notActiveDiv = <div className="inactive">Offline</div>;
  }

  return (
    <div className="widget-container">
      {notActiveDiv}
      <CPU data={cpuData} />
      <Memory data={memoryData} />
      <Info data={machineInfo} />
    </div>
  );
};

export default Widget;
