import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout, Button } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getLeaderBoard } from "../../features/leaderBoard/leaderBoardSlice";

// Register the necessary components for Chart.js
ChartJS.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend
);

const { Header, Footer, Content } = Layout;

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

const Result = () => {
          const { speed, loading, isError, speedsList, errorMessage } = useSelector((state) => state.speed);
          const location = useLocation();
          const { characterIdx, selectedTime } = location.state || {};
          const dispatch = useDispatch();
          const { userData } = useAuth();
          const navigate = useNavigate();

          // Prepare data for the line chart
          const data = {
                    labels: speedsList.map((_, idx) => idx), // Indices as labels (x-axis)
                    datasets: [
                              {
                                        label: "Speed Over Time",
                                        data: speedsList, // Speed values for y-axis
                                        borderColor: "white",
                                        borderWidth: 2,
                                        fill: false,
                              },
                    ],
          };

          const options = {
                    responsive: true,
                    plugins: {
                              legend: {
                                        display: true,
                                        position: "top",
                              },
                    },
                    scales: {
                              x: {
                                        ticks: {
                                                  color: 'white', // Set x-axis label color to white
                                        },
                              },
                              y: {
                                        ticks: {
                                                  color: 'white', // Set y-axis label color to white
                                        },
                              },
                    },
          };

          const goToLeaderBoardPage = async () => {
                    dispatch(getLeaderBoard({ id: userData._id }));
                    navigate("/leaderBoard");
          }

          return (
                    <Layout style={layoutStyle}>
                              <Header style={headerStyle}>
                                        <Button type="primary" onClick={goToLeaderBoardPage}>
                                                  Go to LeaderBoard Page
                                        </Button>
                              </Header>
                              <Layout>
                                        <Content style={contentStyle}>
                                                  <p>Characters Typed: {characterIdx}</p>
                                                  <p>Selected Time: {selectedTime} minutes</p>
                                                  {loading ? (
                                                            <p>Loading...</p>
                                                  ) : (
                                                            <>
                                                                      <p>Speed: {speed}</p>
                                                                      {isError && <p className="text-red-500">Error: {errorMessage}</p>}
                                                                      {/* Line Chart for speedsList */}
                                                                      <Line data={data} options={options} />
                                                            </>
                                                  )}

                                        </Content>
                              </Layout>
                              <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
          );
};

export default Result;
