import React, { useState, useRef, useEffect } from "react";
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
          const [selectedTime, setSelectedTime] = useState(5); // Default: 5 seconds
          const [goodIndices, setGoodIndices] = useState([]);
          const [badIndices, setBadIndices] = useState([]);
          const [characterIdx, setCharacterIdx] = useState(0);

          // Store the countdown start time
          const countdownStartRef = useRef(Date.now());

          useEffect(() => {
                    // Update countdownStartRef whenever selectedTime changes
                    countdownStartRef.current = Date.now();
          }, [selectedTime]);

          const timeItems = [
                    { key: "1", label: "2 second" },
                    { key: "2", label: "5 second" },
                    { key: "3", label: "3 minute" },
                    { key: "4", label: "5 minute" },
          ];

          const handleMenuClick = ({ key }) => {
                    const selected = timeItems.find((item) => item.key === key);

                    // Extract numeric value from the label
                    const timeValue = parseInt(selected.label);

                    // Check the unit of time and convert to seconds
                    let timeInSeconds = 0;
                    if (selected.label.includes("second")) {
                              timeInSeconds = timeValue; // Time is already in seconds
                    } else if (selected.label.includes("minute")) {
                              timeInSeconds = timeValue * 60; // Convert minutes to seconds
                    }

                    // Set the selected time in seconds
                    setSelectedTime(timeInSeconds);
          };

          const handleKeyUp = (event) => {
                    const charPressed = event.key;
                    if (charPressed === text[characterIdx]) {
                              setGoodIndices((prev) => [...prev, characterIdx]);
                    } else {
                              setBadIndices((prev) => [...prev, characterIdx]);
                    }
                    setCharacterIdx(characterIdx + 1);
          };

          const onFinish = () => {
                    const newSpeedData = characterIdx / selectedTime;
                    dispatch(getNewSpeed({ currSpeed: newSpeedData, id: userData._id }));
                    navigate("/result", { state: { characterIdx, selectedTime } });
          };

          const handleLogout = async () => {
                    await logout();
          };

          const textArray = text.split("");

          return (
                    <Layout style={layoutStyle}>
                              <Header style={headerStyle}>
                                        <Button type="primary" onClick={handleLogout}>
                                                  Logout
                                        </Button>
                              </Header>
                              <Layout>
                                        <Sider width="25%" style={siderStyle}>
                                                  <Dropdown
                                                            menu={{
                                                                      items: timeItems,
                                                                      onClick: handleMenuClick,
                                                            }}
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
                                                  <Col span={12}>
                                                            <Countdown
                                                                      title="Countdown"
                                                                      value={countdownStartRef.current + selectedTime * 1000}
                                                                      onFinish={onFinish}
                                                            />
                                                  </Col>
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
                                                                                                    : idx === characterIdx
                                                                                                              ? "yellow"
                                                                                                              : "inherit",
                                                                      }}
                                                            >
                                                                      {char}
                                                            </span>
                                                  ))}
                                        </Content>
                              </Layout>
                              <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
          );
};

export default Dashboard;
