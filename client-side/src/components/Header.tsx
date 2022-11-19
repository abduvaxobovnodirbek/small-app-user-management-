import { NavLink } from "react-router-dom";
import { FaSignInAlt, FaUser } from "react-icons/fa";
const Header = () => {
  return (
    <nav className="flex justify-between items-center h-[70px] px-5 shadow-md bg-slate-700 text-white">
      <span
        className="font-bold text-gray-700 rounded-full bg-white text-center p-3"
        style={{ fontSize: "10px" }}
      >
        Task 4
      </span>
      <span className="flex">
        <NavLink
          to={"/"}
          className={({ isActive }) =>
            isActive
              ? "text-white mr-2 font-bold flex items-center"
              : "text-stone-300 mr-2 flex items-center"
          }
        >
          <FaSignInAlt className="mr-2" />
          Login
        </NavLink>
        <NavLink
          to={"/register"}
          className={({ isActive }) =>
            isActive
              ? "text-white font-bold mr-2 flex items-center"
              : "text-stone-300 mr-2 flex items-center"
          }
        >
          <FaUser className="mr-2" />
          Register
        </NavLink>
      </span>
    </nav>
  );
};

export default Header;
