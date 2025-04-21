import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";
import TravelApp from "./components/TravelApp/TravelApp";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/travel" element={<TravelApp />} />
    </Routes>
  );
}
export default App;
