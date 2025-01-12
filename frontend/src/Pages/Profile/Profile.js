import React from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout, Button } from "antd";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

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

const Profile = () => {
          const dispatch = useDispatch();
          const { userData } = useAuth();
          const navigate = useNavigate();

          const goToLeaderBoardPage = async () => {
                    navigate("/leaderBoard");
          }

          const goToDashboard = async () => {
                    navigate("/dashboard");
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
                                                  <p>Name: {userData.name}</p>
                                        </Content>
                              </Layout>
                              <Footer style={footerStyle}><Button type="primary" onClick={goToDashboard}>
                                        Go to dashboard
                              </Button></Footer>
                    </Layout>
          );
};

export default Profile;
