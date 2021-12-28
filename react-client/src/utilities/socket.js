import io from "socket.io-client";

let socket = io.connect("http://localhost:8181");
socket.emit("clientAuth", process.env.REACT_APP_CLIENT_KEY);

export default socket;
