import React, { useState } from "react";
import "../assets/css/login.css";
import Art from "../assets/images/Artboard-4-100.jpg";
import Logo from "../assets/images/logo_footer.png";
import { register } from "../redux/auth/authActions"
import { Layout, Button, Form, Input } from "antd";
const { Content } = Layout;

export const Register = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const { firstName, lastName, email, password } = data;
  const ArrayOfRules = [{
    required: true,
    message: "Please input your password !",
  },
  {
    pattern: /^^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    warningOnly: true,
    message: "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
  },]
  
  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value });
  };
  const onFinish = (values) => {
    try {
      register(values);
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Content className="container-fluid">
      <section className="text-center text-lg-start">
        <div className="container py-4">
          <div className="row g-0 align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card cascading-right">
                <div className="card-body p-5 shadow-5 text-center">
                  <img
                    src={Logo}
                    alt="TaaMarbouta"
                    style={{ width: "12%" }}
                    className="mb-3"
                  />
                  <h2 className="fw-bold mb-2 text-start">Sign up</h2>
                  <Form
                    className="form"
                    name="basic"
                    layout="vertical" 
                    size={"large"}
                    labelCol={{ span: 8 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-outline text-start">
                          <Form.Item
                            label="First name"
                            name="firstName"
                            rules={[
                              {
                                required: true,
                                message: "Please input your first name !",
                              },
                            ]}
                          >
                            <Input value={firstName} onChange={handleChange('firstName')} />
                          </Form.Item>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-outline text-start">
                          <Form.Item
                            label="Last name"
                            name="lastName"
                            rules={[
                              {
                                required: true,
                                message: "Please input your lastName !",
                              },
                            ]}
                          >
                           <Input value={lastName} onChange={handleChange('lastName')} />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-outline text-start">
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            {
                              required: true,
                              message: "Please input your email !",
                              type: "email",
                            },
                          ]}
                        >
                          <Input value={email} onChange={handleChange('email')} />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="form-outline text-start">
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={ArrayOfRules}
                      >
                        <Input.Password value={password} onChange={handleChange('password')} />
                      </Form.Item>
                    </div>
                    <div className="form-outline text-center">
                      <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                    </div>
                    
                  </Form>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-5 mb-lg-0">
              <img src={Art} className="w-100 rounded-4 shadow-4" alt="" />
            </div>
          </div>
        </div>
      </section>
    </Content>
  );
};

export default Register;
