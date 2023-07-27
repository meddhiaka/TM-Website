/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import {
  Card,
  Layout,
  Button,
  Form,
  Input,
  Select,
  Collapse,
  Steps,
  Empty,
  Modal,
} from "antd";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { UserOutlined } from "@ant-design/icons";
import { loadUser } from "../redux/auth/authActions";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { updateUser } from "../redux/user/userActions";
import { LoadingOutlined } from "@ant-design/icons";
import usePrevious from "../helpers/usePrevious";
import { countryList } from "../helpers/Constants";
import { deleteSub, getSubsByUser } from "../redux/subs/subsActions";
const { Content } = Layout;

export const Profile = ({ ...props }) => {
  useEffect(() => {
    props.GetUser();
    props.GetSubs();
  }, []);

  const [User] = useState(() => {
    const saved = localStorage.getItem("user");
    const initialValue = JSON.parse(saved);
    return initialValue || "";
  });

  const [view, setView] = useState(false);
  const [DeleteModal, setDeleteModal] = useState(false);
  const [selctedId, setSelctedId] = useState();
  const navTo = useNavigate();
  const onFinish = (values) => {
    try {
      props.Update(values);
    } catch (error) {
      console.log(error);
      toast.error("Update failed !");
    }
  };

  const onFinishFailed = () => {
    toast.warn("Check your fields");
  };

  const prev_loading = usePrevious(props.isLoading);
  useEffect(() => {
    if (prev_loading && !props.isLoading) {
      if (props.msg === 1) {
        props.GetUser();
      }
      if (props.msg === 0) {
        toast.error("Something went wrong !");
      }
    }
  }, [props.isLoading, props.isAuth]);

  const items = [
    { title: "Subscription" },
    { title: "Language Test" },
    { title: "Payment" },
  ];
  const statusOfSub = (status) => {
    if (status === "pending") return 1;
    else if (status === "test") return 2;
    else if (status === "confirmed") return 3;
  };

  const subsList = props.user_subs.map((su, index) => ({
    key: index,
    label: (
      <>
        {su.course[0].title} - {su.level}
      </>
    ),
    children: (
      <div className="my-4">
        <p className=" yellow-text">Subscription process :</p>
        <Steps current={statusOfSub(su.status)} size="small" items={items} />
        <div className="row">
          <div className="col text-start">
            {su.payment === false && (
              <Button
                danger
                size="small"
                type="dashed"
                className="mt-3"
                onClick={() => {
                  setSelctedId(su._id);
                  setDeleteModal(true);
                }}
              >
                Cancel booking
              </Button>
            )}
          </div>
          <div className="col">
            {su.status === "pending" && (
              <div className="text-center">
                <Button
                  size="small"
                  type="primary"
                  className="mt-3"
                  onClick={() => {
                    console.log("Download");
                  }}
                >
                  Download Language Test
                </Button>
              </div>
            )}
          </div>
          <div className="col"></div>
        </div>
      </div>
    ),
  }));

  return (
    <>
      <Content className="container-fluid">
        <div className="container my-5 ">
          <div className="row">
            <div className="col col-lg-5 col-md-12 col-sm-12 col-xs-12 align">
              <Card style={{ height: 500, width: 1000 }}>
                {!view && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 100 }}
                      exit={{ opacity: 0 }}
                    >
                      <h1 className="montserrat_bold text-center blue-text ">
                        <UserOutlined style={{ fontSize: "100px" }} />
                      </h1>
                      <h3 className="text-center mx-lg-5 blue-text ">
                        User information
                      </h3>
                      {!props.isLoading ? (
                        <div className="parag_style mt-4">
                          <p>
                            First name: <b> {User.firstName} </b>
                          </p>
                          <p>
                            Last name: <b> {User.lastName} </b>
                          </p>
                          <p>
                            Email: <b> {User.email} </b>
                          </p>
                          {User.phone && (
                            <p>
                              Phone: <b> {User.phone} </b>
                            </p>
                          )}
                          {User.city && (
                            <p>
                              Country: <b> {User.city} </b>
                            </p>
                          )}
                          <div className="text-center">
                            <Button
                              type="primary"
                              className="mt-4"
                              onClick={() => {
                                setView(true);
                              }}
                            >
                              Update profil
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center mt-5">
                          <LoadingOutlined style={{ fontSize: 40 }} spin />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* User Infos Update Form */}
                <AnimatePresence>
                  {view && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Form
                        className="form"
                        name="basic"
                        layout="vertical"
                        size={"large"}
                        labelCol={{ span: 20 }}
                        style={{ maxWidth: 600, height: 420 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <div className="row">
                          <h3 className="text-center blue-text ">
                            Update user details
                          </h3>
                          <div className="col-md-6">
                            <div className="form-outline text-start">
                              <Form.Item label="First name" name="firstName">
                                <Input defaultValue={User.firstName} />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-outline text-start">
                              <Form.Item label="Last name" name="lastName">
                                <Input defaultValue={User.lastName} />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-outline text-start">
                            <Form.Item label="Email" name="email">
                              <Input defaultValue={User.email} />
                            </Form.Item>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-outline text-start">
                              <Form.Item label="Phone number" name="phone">
                                <Input
                                  type="number"
                                  defaultValue={User.phone}
                                />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-outline text-start">
                              <Form.Item label="Country" name="city">
                                <Select
                                  showSearch
                                  defaultValue={User.city}
                                  options={countryList}
                                ></Select>
                              </Form.Item>
                            </div>
                          </div>
                        </div>

                        <div className="row form-outline">
                          <div className="col text-end">
                            <Form.Item>
                              <Button type="primary" htmlType="submit">
                                Update
                              </Button>
                            </Form.Item>
                          </div>
                          <div className="col">
                            <Form.Item>
                              <Button
                                type="default"
                                onClick={() => {
                                  setView(false);
                                }}
                              >
                                Back
                              </Button>
                            </Form.Item>
                          </div>
                        </div>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>

            {/* Course by users */}

            <div className="col col-lg-7 col-md-12 col-sm-12 col-xs-12 align">
              <Card
                style={{ height: 500, width: 1000 }}
                className=" overflow-y-scroll overflow-x-hidden"
              >
                <div>
                  {!props.loadingSubs ? (
                    <div className="text-center blue-text">
                      <LoadingOutlined
                        style={{
                          fontSize: 40,
                          margin: 150,
                        }}
                        spin
                      />
                    </div>
                  ) : (
                    <div>
                      {props.user_subs.length !== 0 ? (
                        <>
                          <h3 className="blue-text">Booked Courses</h3>
                          <div className="my-5">
                            <Collapse accordion items={subsList} />
                          </div>
                        </>
                      ) : (
                        <div className="text-center" style={{ margin: 150 }}>
                          <Empty description="No booked courses">
                            <Button
                              type="default"
                              className="mt-4"
                              onClick={() => {
                                navTo("/language-courses");
                              }}
                            >
                              View Courses
                            </Button>
                          </Empty>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <Modal
            title={"Are you sure to cancel ?"}
            open={DeleteModal}
            onCancel={() => setDeleteModal(false)}
            onOk={() => {
              props.Delete(selctedId);
              setDeleteModal(false);
            }}
          />
        </div>
      </Content>
      <Footer />
    </>
  );
};

const mapActionToProps = {
  GetUser: loadUser,
  Update: updateUser,
  GetSubs: getSubsByUser,
  Delete: deleteSub,
};
const mapToStateProps = (state) => ({
  isLoading: state.user.loadingUser,
  msg: state.auth.codeMsg,
  user: state.user.user,
  user_subs: state.subs.user_subs,
  loadingSubs: state.subs.loading,
});

export default connect(mapToStateProps, mapActionToProps)(Profile);