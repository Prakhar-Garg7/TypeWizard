import React from "react";
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const Register = () => {
          const {loading, error, registerUser} = useSignup();
          const handleRegister = async(values) => {
                    await registerUser(values);
          }
          return <Card className="form-container">
                    <Flex>
                              {/* {Form} */}
                              <Flex vertical flex={1}>
                                        <Typography.Title level={3} strong className="title">
                                                  Create an account
                                        </Typography.Title>
                                        <Typography.Text type="secondary" strong className="slogan">
                                                  Join for exclusive access !
                                        </Typography.Text>
                                        <Form layout='vertical' onFinish={handleRegister} autoComplete="off">
                                                  <Form.Item label="Full name" name="name" rules={[
                                                            {
                                                                      required: true,
                                                                      message: "Please enter your full name!"
                                                            }
                                                  ]}>
                                                            <Input size="large" placeholder="Enter your full name" />
                                                  </Form.Item>
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
                                                  <Form.Item label="Password" name="passwordConfirm" rules={[
                                                            {
                                                                      required: true,
                                                                      message: "Please enter your Confirm Password!"
                                                            }
                                                  ]}>
                                                            <Input.Password size="large" placeholder="Re-enter your password" />
                                                  </Form.Item>

                                                  {error && <Alert description={error} type="error" showIcon closable className="alert" />}

                                                  <Form.Item>
                                                            <Button
                                                                      type={`${loading ? '' : 'primary'}`}
                                                                      htmlType="submit" size="large" className="btn">
                                                                      {`${loading ? <Spin/> : 'Create account'}`}
                                                            </Button>
                                                  </Form.Item>
                                                  <Form.Item>
                                                            <Link to={'/login'}>
                                                                      <Button size="large" className="btn">
                                                                                Login
                                                                      </Button>
                                                            </Link>
                                                  </Form.Item>
                                        </Form>
                              </Flex>
                    </Flex>
          </Card>
}

export default Register;