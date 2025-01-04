import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Game1 = () => {
          useEffect(() => {
                    const socket = io("http://localhost:9000"); // Connect to the WebSocket server

                    // Listen for incoming messages
                    socket.on("message", (data) => {
                              console.log("Message from server:", data);
                    });

                    // Cleanup the connection on component unmount
                    return () => {
                              socket.disconnect();
                    };
          }, []); // Empty dependency array ensures this runs only once

          return <div>WebSocket Example</div>;
};

export default Game1;
