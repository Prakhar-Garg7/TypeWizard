import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Game1 = () => {
          useEffect(() => {
                    const socket = io("http://localhost:9000"); 

                    socket.on("message", (data) => {
                              console.log(data);
                    });

                    // Cleanup the connection on component unmount
                    return () => {
                              socket.disconnect();
                    };
          }, []);

          return <div>WebSocket Example</div>;
};

export default Game1;
