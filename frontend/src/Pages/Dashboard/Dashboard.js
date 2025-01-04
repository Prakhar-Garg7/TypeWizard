import React, { useState, useRef } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Dropdown, Layout, Statistic, Col, Space, Button } from "antd";
import { getNewSpeed } from "../../features/speed/speedSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Footer, Sider, Content } = Layout;
const { Countdown } = Statistic;

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

const text = `MotivaTion is the invisible force that propels individuals to take action, achieve goals, and overcome obstacles. It is the spark that ignites the fire of ambition and the energy that sustains us during challenging times. Whether it stems from within or is inspired by external factors, motivation plays a crucial role in shaping our lives and helping us realize our potential.`;

const Dashboard = () => {
          const dispatch = useDispatch();
          const { userData, logout } = useAuth();
          const navigate = useNavigate();
          const [selectedTime, setSelectedTime] = useState(30);
          const [goodIndices, setGoodIndices] = useState([]);
          const [badIndices, setBadIndices] = useState([]);
          const [isTimerVisible, setIsTimerVisible] = useState(false);
          const [isStartTestButtonVisible, setIsStartTestButtonVisible] = useState(true);

          const countdownStartRef = useRef(Date.now());
          const characterIdxRef = useRef(0); 

          const timeItems = [
                    { key: "1", label: "3 second" },
                    { key: "2", label: "20 second" },
                    { key: "3", label: "30 second" },
                    { key: "4", label: "40 second" },
          ];

          const handleMenuClick = ({ key }) => {
                    const selected = timeItems.find((item) => item.key === key);
                    const timeValue = parseInt(selected.label);

                    let timeInSeconds = 0;
                    if (selected.label.includes("second")) {
                              timeInSeconds = timeValue;
                    } else if (selected.label.includes("minute")) {
                              timeInSeconds = timeValue * 60;
                    }

                    setSelectedTime(timeInSeconds);
          };

          const handleKeyUp = (event) => {
                    const charPressed = event.key;
                    if (charPressed === text[characterIdxRef.current]) {
                              setGoodIndices((prev) => [...prev, characterIdxRef.current]);
                    } else {
                              setBadIndices((prev) => [...prev, characterIdxRef.current]);
                    }
                    characterIdxRef.current += 1;
                    console.log("characterIdx: " + characterIdxRef.current);
          };

          const onFinish = async () => {
                    const newSpeedData = characterIdxRef.current / (selectedTime / 60.0);
                    console.log(
                              "newSpeed: " + newSpeedData + ", characterIdx: " + characterIdxRef.current
                    );
                    dispatch(getNewSpeed({ currSpeed: newSpeedData, id: userData._id }));

                    navigate("/result", {
                              state: { characterIdx: characterIdxRef.current, selectedTime },
                    });
          };

          const handleLogout = async () => {
                    await logout();
          };

          const startTest = () => {
                    countdownStartRef.current = Date.now();
                    characterIdxRef.current = 0; // Reset characterIdx for a new test
                    setGoodIndices([]);
                    setBadIndices([]);
                    setIsTimerVisible(true);
                    setIsStartTestButtonVisible(false);
          };

          const goToGame = async() => {
                    navigate("/game");
          }

          const textArray = text.split("");

          return (
                    <Layout style={layoutStyle}>
                              <Header style={headerStyle}>
                                        {isStartTestButtonVisible && (
                                                  <>
                                                            <Button type="primary" onClick={startTest} className="mx-4">
                                                                      Start Test
                                                            </Button>
                                                            <Button type="primary" onClick={goToGame}>
                                                                      Play Game
                                                            </Button>
                                                  </>
                                        )}
                              </Header>
                              <Layout>
                                        <Sider width="25%" style={siderStyle}>
                                                  <Dropdown
                                                            menu={{
                                                                      items: timeItems,
                                                                      onClick: handleMenuClick,
                                                            }}
                                                            disabled={isTimerVisible}
                                                  >
                                                            <button
                                                                      onClick={(e) => e.preventDefault()}
                                                                      style={{
                                                                                background: "none",
                                                                                border: "none",
                                                                                color: "inherit",
                                                                                font: "inherit",
                                                                                cursor: "pointer",
                                                                                padding: 0,
                                                                      }}
                                                            >
                                                                      <Space>
                                                                                Set time
                                                                                <DownOutlined />
                                                                      </Space>
                                                            </button>
                                                  </Dropdown>
                                                  {isTimerVisible && (
                                                            <Col span={12}>
                                                                      <Countdown
                                                                                title="Countdown"
                                                                                value={countdownStartRef.current + selectedTime * 1000}
                                                                                onFinish={onFinish}
                                                                      />
                                                            </Col>
                                                  )}
                                        </Sider>
                                        <Content style={contentStyle} onKeyUp={handleKeyUp} tabIndex={0}>
                                                  {textArray.map((char, idx) => (
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
                                                  ))}
                                        </Content>
                              </Layout>
                              <Footer style={footerStyle}>
                                        <Button type="primary" onClick={handleLogout}>
                                                  Logout
                                        </Button>
                              </Footer>
                    </Layout>
          );
};

export default Dashboard;
