import { useState, useEffect } from "react";

import "./App.css";
import socket from "./utilities/socket";
import Widget from "./components/Widget";

function App() {
  const [performanceData, setPerformanceData] = useState({});
  useEffect(() => {
    socket.on("data", (data) => {
      let temp = { ...performanceData };
      temp[data.macAddress] = data;
      setPerformanceData(temp);
    });
  }, [performanceData.uptime]);

  let widgets = [];
  // const data = performanceData;
  // grab each machine, by property, from data
  Object.entries(performanceData).forEach(([key, value]) => {
    widgets.push(<Widget key={key} data={value} />);
  });
  return (
    <div className="App">
      <h1>In House Monitoring</h1>
      <div className="widgets">{widgets}</div>
    </div>
  );
}

export default App;
