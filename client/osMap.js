const execa = import("execa");
const getos = require("getos");

const macMap = new Map([
  [21, ["Monterey", "12"]],
  [20, ["Big Sur", "11"]],
  [19, ["Catalina", "10.15"]],
  [18, ["Mojave", "10.14"]],
  [17, ["High Sierra", "10.13"]],
  [16, ["Sierra", "10.12"]],
  [15, ["El Capitan", "10.11"]],
  [14, ["Yosemite", "10.10"]],
  [13, ["Mavericks", "10.9"]],
  [12, ["Mountain Lion", "10.8"]],
  [11, ["Lion", "10.7"]],
  [10, ["Snow Leopard", "10.6"]],
  [9, ["Leopard", "10.5"]],
  [8, ["Tiger", "10.4"]],
  [7, ["Panther", "10.3"]],
  [6, ["Jaguar", "10.2"]],
  [5, ["Puma", "10.1"]],
]);

const windowsMap = new Map([
  ["10.0.22", "11"], // It's unclear whether future Windows 11 versions will use this version scheme: https://github.com/sindresorhus/windows-release/pull/26/files#r744945281
  ["10.0", "10"],
  ["6.3", "8.1"],
  ["6.2", "8"],
  ["6.1", "7"],
  ["6.0", "Vista"],
  ["5.2", "Server 2003"],
  ["5.1", "XP"],
  ["5.0", "2000"],
  ["4.90", "ME"],
  ["4.10", "98"],
  ["4.03", "95"],
  ["4.00", "95"],
]);

const macosRelease = (release) => {
  release = Number((release || os.release()).split(".")[0]);

  const [name, version] = macMap.get(release) || ["Unknown", ""];

  return {
    name,
    version,
  };
};

const windowsRelease = (release) => {
  const version = /(\d+\.\d+)(?:\.(\d+))?/.exec(release || os.release());

  if (release && !version) {
    throw new Error("`release` argument doesn't match `n.n`");
  }

  let ver = version[1] || "";
  const build = version[2] || "";

  // Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
  // If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
  // then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
  // If `wmic` is obsolete (later versions of Windows 10), use PowerShell instead.
  // If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
  if (
    (!release || release === os.release()) &&
    ["6.1", "6.2", "6.3", "10.0"].includes(ver)
  ) {
    let stdout;
    try {
      stdout = execa.sync("wmic", ["os", "get", "Caption"]).stdout || "";
    } catch {
      stdout =
        execa.sync("powershell", [
          "(Get-CimInstance -ClassName Win32_OperatingSystem).caption",
        ]).stdout || "";
    }

    const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

    if (year) {
      return `Server ${year}`;
    }
  }

  // Windows 11
  if (ver === "10.0" && build.startsWith("22")) {
    ver = "10.0.22";
  }

  const name = windowsMap.get(ver);
  const releaseVersion = os.release();
  return { name, releaseVersion };
};

const linuxRelease = () => {
  const releaseInfo = getos(function (e, os) {
    if (e) return console.log(e);
    console.log("Your OS is:" + JSON.stringify(os));
  });

  let name = releaseInfo.dist;
  let version = releaseInfo.release;
  return { name, version };
};

module.exports = { macosRelease, windowsRelease, linuxRelease };
