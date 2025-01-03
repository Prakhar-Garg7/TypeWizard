import React from "react";
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
          const {loading, error, loginUser} = useLogin();
          const handleLogin = async(values) => {
                    await loginUser(values);
          }
          return <Card className="form-container">
                    <Flex>
                              {/* {Form} */}
                              <Flex vertical flex={1}>
                                        <Typography.Title level={3} strong className="title">
                                                  Sign In
                                        </Typography.Title>
                                        <Typography.Text type="secondary" strong className="slogan">
                                                  Unlock your world
                                        </Typography.Text>
                                        <Form layout='vertical' onFinish={handleLogin} autoComplete="off">
                                                  <Form.Item label="Email" name="email" rules={[
                                                            {
                                                                      required: true,
                                                                      message: "Please enter your email!"
                                                            },
                                                            {
                                                                      type: 'email',
                                                                      message: "The input is not valid email!"
                                                            }
                                                  ]}>
                                                            <Input size="large" placeholder="Enter your email" />
                                                  </Form.Item>
                                                  <Form.Item label="Password" name="password" rules={[
                                                            {
                                                                      required: true,
                                                                      message: "Please enter your password!"
                                                            }
                                                  ]}>
                                                            <Input.Password size="large" placeholder="Enter your password" />
                                                  </Form.Item>

                                                  {error && <Alert description={error} type="error" showIcon closable className="alert" />}

                                                  <Form.Item>
                                                            <Button
                                                                      type={`${loading ? '' : 'primary'}`}
                                                                      htmlType="submit" size="large" className="btn">
                                                                      {`${loading ? <Spin/> : 'Login'}`}
                                                            </Button>
                                                  </Form.Item>
                                                  <Form.Item>
                                                            <Link to={'/'}>
                                                                      <Button size="large" className="btn">
                                                                                Create an account
                                                                      </Button>
                                                            </Link>
                                                  </Form.Item>
                                        </Form>
                              </Flex>
                    </Flex>
          </Card>
}

export default Login;