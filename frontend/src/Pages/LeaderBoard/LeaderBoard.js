import React from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";

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

const LeaderBoard = () => {
          const { loading, isError, errorMessage, mySpeed, myRank, playersList, myName } = useSelector(
                    (state) => state.leaderBoard
          );

          return (
                    <Layout style={layoutStyle}>
                              <Header style={headerStyle}>Header</Header>
                              <Layout>
                                        <Content style={contentStyle}>
                                                  {loading ? (
                                                            <p>Loading...</p>
                                                  ) : isError ? (
                                                            <p style={{ color: "red" }}>Error: {errorMessage}</p>
                                                  ) : (
                                                            <>
                                                                      {/* Displaying user's speed and rank */}
                                                                      <p>My Rank: {myRank} | My Speed: {mySpeed} | My Name: {myName}</p>

                                                                      {/* Displaying all players' rank and name */}
                                                                      <div>
                                                                                {playersList.map((player, index) => (
                                                                                          <p key={index}>
                                                                                                    Rank: {player.rank} | Speed: {player.speed} | Name: {player.name}
                                                                                          </p>
                                                                                ))}
                                                                      </div>
                                                            </>
                                                  )}
                                        </Content>
                              </Layout>
                              <Footer style={footerStyle}>Footer</Footer>
                    </Layout>
          );
};

export default LeaderBoard;
