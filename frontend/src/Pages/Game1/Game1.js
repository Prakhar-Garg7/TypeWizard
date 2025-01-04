import React, { useEffect, useState, useRef } from "react";
import { Layout, Button } from "antd";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
          textAlign: "center",
          color: "#fff",
          height: 64,
          paddingInline: 48,
          lineHeight: "64px",
          backgroundColor: "#4096ff",
};

const contentStyle = {
          textAlign: "center",
          minHeight: 120,
          color: "#fff",
          backgroundColor: "#0958d9",
          fontSize: "25px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          whiteSpace: "pre-wrap",
};

const siderStyle = {
          textAlign: "center",
          lineHeight: "120px",
          color: "#fff",
          backgroundColor: "#1677ff",
};

const footerStyle = {
          textAlign: "center",
          color: "#fff",
          backgroundColor: "#4096ff",
};

const layoutStyle = {
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
};

const text = `have you that zeal`;

const Game1 = () => {
          const { userData, logout } = useAuth();
          const [waitingForPlayers, setWaitingForPlayers] = useState(true);
          const [socket, setSocket] = useState(null);
          const [goodIndices, setGoodIndices] = useState([]);
          const [badIndices, setBadIndices] = useState([]);
          const [myScore, setMyScore] = useState(0);
          const [opponentScore, setOpponentScore] = useState(0);
          const [gameResult, setGameResult] = useState(""); // New state to store the game result (Won/Lost)
          const characterIdxRef = useRef(0);

          useEffect(() => {
                    const socketInstance = io("http://localhost:9000"); // Connect to the WebSocket server
                    setSocket(socketInstance);

                    // Listen for "RoomFull" event
                    socketInstance.on("RoomFull", (message) => {
                              setWaitingForPlayers(false); // Update the state once room is full
                              console.log(message);
                    });

                    // Listen for "getUpdatedScore" event to update scores
                    socketInstance.on("getUpdatedScore", (data) => {
                              setMyScore(data.yourScore);
                              setOpponentScore(data.opponentScore);
                    });

                    // Listen for "gameWon" event to display the result
                    socketInstance.on("getGameResults", (data) => {
                              setGameResult(data.result); // Set game result (Won/Lost)
                    });

                    // Cleanup the connection on component unmount
                    return () => {
                              socketInstance.disconnect();
                    };
          }, []);

          const handleKeyUp = (event) => {
                    const charPressed = event.key;
                    if (charPressed === text[characterIdxRef.current]) {
                              setGoodIndices((prev) => [...prev, characterIdxRef.current]);
                    } else {
                              setBadIndices((prev) => [...prev, characterIdxRef.current]);
                    }
                    characterIdxRef.current += 1;

                    // Emit score update to the server
                    if (socket) {
                              socket.emit("receiveScoreFromSocket");
                    }

                    // Check if the player has reached the end of the text
                    if (characterIdxRef.current === text.length) {
                              // Emit "gameWon" event to the server
                              if (socket) {
                                        socket.emit("gameWon");
                              }
                    }

                    console.log("characterIdx: " + characterIdxRef.current);
          };

          const handleLogout = async () => {
                    await logout();
          };

          const textArray = text.split("");

          return (
                    <Layout style={layoutStyle}>
                              {!waitingForPlayers && (
                                        <Header style={headerStyle}>
                                                  Header
                                        </Header>
                              )}
                              <Layout>
                                        {!waitingForPlayers && (
                                                  <Sider width="25%" style={siderStyle}>
                                                            <p className="text-xl">My score: {myScore}</p>
                                                            <p className="text-xl">Opponent score: {opponentScore}</p>
                                                  </Sider>
                                        )}
                                        <Content style={contentStyle} onKeyUp={handleKeyUp} tabIndex={0}>
                                                  {waitingForPlayers ? (
                                                            <p>Waiting for more players to join...</p>
                                                  ) : (
                                                            textArray.map((char, idx) => (
                                                                      <span
                                                                                key={idx}
                                                                                style={{
                                                                                          color: goodIndices.includes(idx)
                                                                                                    ? "blue"
                                                                                                    : badIndices.includes(idx)
                                                                                                              ? "red"
                                                                                                              : idx === characterIdxRef.current
                                                                                                                        ? "yellow"
                                                                                                                        : "inherit",
                                                                                }}
                                                                      >
                                                                                {char}
                                                                      </span>
                                                            ))
                                                  )}
                                        </Content>
                              </Layout>
                              {!waitingForPlayers && (
                                        <Footer style={footerStyle}>
                                                  <Button type="primary" onClick={handleLogout}>
                                                            Logout
                                                  </Button>
                                        </Footer>
                              )}
                              {gameResult && ( // Show the result message if available
                                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "36px", color: "#fff" }}>
                                                  <h1>{gameResult === "Won" ? "You Won!" : "You Lost!"}</h1>
                                        </div>
                              )}
                    </Layout>
          );
};

export default Game1;
