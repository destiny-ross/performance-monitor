import humanizeDuration from "humanize-duration";

const Info = ({
  data: {
    osType,
    osArch,
    osName,
    osVersion,
    cpuModel,
    cpuSpeed,
    coreCount,
    uptime,
  },
}) => {
  const osDisplay = osType === "Darwin" ? "macOS" : null;

  return (
    <div className="widget widget--information">
      <h1>Machine Info</h1>
      <h2>Operation System</h2>
      <h2>
        <span className="bold">
          {osDisplay} {osName?.name}
        </span>
      </h2>
      <h3>
        <span className="bold">Version</span> {osName?.version}
      </h3>
      <h3>
        <span className="bold">Uptime</span>
        {humanizeDuration(uptime * 1000)}{" "}
      </h3>
      <h2>Processor Information</h2>
      <h3>
        <span className="bold">Chip</span> {cpuModel}
      </h3>
      <h3>
        <span className="bold">Architecture</span> {osArch}
      </h3>
      <h3>
        <span className="bold">CPU Speed</span> {cpuSpeed}
      </h3>
      <h3>
        <span className="bold">CPU Cores</span> {coreCount}
      </h3>
    </div>
  );
};

export default Info;
