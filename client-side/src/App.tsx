import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";

const App = () => {
  return (
    <div className="h-screen bg-slate-300">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
