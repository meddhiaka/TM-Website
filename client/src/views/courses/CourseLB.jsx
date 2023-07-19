/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import CourseModal from "../../components/CourseModal";
import { connect } from "react-redux";
import { getCourses } from "../../redux/courses/courseActions";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { ServerURL } from "../../helpers/urls";

export const CourseLB = ({ ...props }) => {
  const course = { description: [], sessions: [] };
  const [currentObj, setstate] = useState(course);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const id = "64b02844f678c4606a7cd3e3";
    setloading(false);
    axios
      .get(`${ServerURL}/api/courses/${id}`)
      .then((res) => {
        setloading(true);
        setstate(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setstate(props.selectedCourse);
  }, []);

  return (
    <div className=" container-fluid m-3">
      <Helmet>
        <title>Libyan Arabic Course</title>
        <meta
          name="description"
          content="Taa Marbouta is a language school based in Carthage,
          Tunis. We aim to better connect Tunisia with the world."
        />
        <link rel="canonical" href="/learn-libyan-arabic" />
      </Helmet>
      {!loading ? (
        <>
          <div className="text-center">
            <LoadingOutlined
              style={{
                fontSize: 40,
                margin: 130,
              }}
              spin
            />
          </div>
        </>
      ) : (
        <CourseModal {...{ currentObj }} />
      )}
    </div>
  );
};

const mapActionToProps = {
  AllCourses: getCourses,
};

const mapStateToProps = (state) => ({
  courses: state.courses.courses,
  isLoading: state.courses.loading,
  selectedCourse: state.courses.courseObj,
});

export default connect(mapStateToProps, mapActionToProps)(CourseLB);
