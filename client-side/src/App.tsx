import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { PrivateRoute } from "./components/PrivateRoute";
import Cookie from "universal-cookie";
import Error from "./pages/Error";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";

const App = () => {
  const cookie = new Cookie();
  let isAuth = cookie.get("accessToken");
  useLocation();

  return (
    <div className="min-h-screen bg-slate-300">
      <Header />
      <Routes>
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to={"/"} />}
        />
        <Route
          path="/register"
          element={!isAuth ? <Register /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
