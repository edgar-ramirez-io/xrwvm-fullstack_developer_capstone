import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route } from "react-router-dom";
import TravelApp from "./components/TravelApp/TravelApp";
import Interview from "./components/TravelApp/Interview";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />
      <Route path="/travel" element={<TravelApp />} />
      <Route path="/interview" element={<Interview />} />
    </Routes>
  );
}
export default App;
