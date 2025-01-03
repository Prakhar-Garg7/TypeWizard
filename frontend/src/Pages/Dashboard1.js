import React from "react";
// import { useAuth } from "../contexts/AuthContext";
import { getNewSpeed } from "../features/speed/speedSlice";
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
          const dispatch = useDispatch();
          const { speed, loading, isError } = useSelector((state) => state.speed);

          const handleButtonClick = () => {
                    const newSpeedData = 5000;
                    dispatch(getNewSpeed({currSpeed: newSpeedData, id: "67664c8d65450aefa3f64621"}));
          };

          // const { logout, userData } = useAuth();
          return <div className="h-screen w-screen flex items-center justify-center">
                    <button onClick={handleButtonClick} disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
                              {loading ? "Loading..." : "Click me"}
                    </button>
                    <div>
                              <p>Speed: {speed}</p>
                              {isError && <p className="text-red-500">An error occurred.</p>}
                    </div>
          </div>
}

export default Dashboard;