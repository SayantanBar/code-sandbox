import "./App.css";
import { io } from "socket.io-client";
import Router from "./Router";
function App() {
  //const socket = io("http://localhost:3000");
  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
