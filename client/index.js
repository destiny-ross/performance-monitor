// Node program that captures the local performance data and sends it to the socket.io server
// Application exposes cpu load, memory usage, free and total, operating system, os up time, cpu type, cpu number cores, cpu clock speed

const os = require("os");
const io = require("socket.io-client");
const { macosRelease, windowsRelease } = require("./osMap");
let socket = io("http://127.0.0.1:8181");

socket.on("connect", () => {
  const networkInterfaces = os.networkInterfaces();
  let macAddress;
  for (let key in networkInterfaces) {
    if (!networkInterfaces[key][0].internal) {
      macAddress = networkInterfaces[key][0].mac;
      break;
    }
  }

  socket.emit("clientAuth", "i34h5jkbkj3b245jk34b5hj345vn");

  performanceData().then((data) => {
    data.macAddress = macAddress;
    socket.emit("initPerformanceData", data);
  });

  let perfDataInterval = setInterval(() => {
    performanceData().then((data) => {
      data.macAddress = macAddress;
      socket.emit("performanceData", data);
    });
  }, 1000);

  socket.on("disconnect", () => {
    console.log("disconnect");
    clearInterval(perfDataInterval);
  });
});

const performanceData = () => {
  return new Promise(async (resolve, reject) => {
    const osType = os.type();
    const osRelease = os.release();
    const osArch = os.arch();
    const osName = getOSName(osType, osRelease);

    const uptime = os.uptime();

    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = Math.floor((usedMemory / totalMemory) * 100) / 100;

    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
    const coreCount = cpus.length;

    const cpuLoad = await getCpuLoad();
    const isActive = true;
    resolve({
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
      isActive,
    });
  });
};

const cpuAverage = () => {
  const cpus = os.cpus();

  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach((core) => {
    for (type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
};

const getCpuLoad = () => {
  const start = cpuAverage();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;

      const usedCpu =
        100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(usedCpu);
    }, 100);
  });
};

const getOSName = (type, release) => {
  console.log(type, release);
  let name;
  if (type.toLowerCase() === "darwin") {
    name = macosRelease(release);
  } else if (type.toLowerCase() === "windows_nt") {
    name = windowsRelease(release);
  } else if (type.toLowerCase() === "linux") {
    name = linuxRelease(release);
  } else {
    name = { name: null, version: null };
  }
  return name;
};
