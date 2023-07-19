import axios from "axios";
import { ServerURL } from "../../helpers/urls";
import { toast } from "react-toastify";
import {
  ADD_SUBS_FAILED,
  ADD_SUBS_LOADING,
  ADD_SUBS_SUCCESS,
  DEL_SUBS_FAILED,
  DEL_SUBS_SUCCESS,
  GET_FAIL,
  GET_SUBS,
  LOADING_SUBS,
  UPDATE_SUBS_FAILED,
  UPDATE_SUBS_LOADING,
  UPDATE_SUBS_SUCCESS,
} from "./subsTypes";
import setAuthToken from "../../helpers/authToken";

export const getSubs = () => (dispatch) => {
  dispatch({ type: LOADING_SUBS });
  setAuthToken(localStorage.accessToken);
  return axios
    .get(`${ServerURL}/api/subscription/all`)
    .then((res) => {
      dispatch({
        type: GET_SUBS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err), GET_FAIL);
};

export const addCourses = (values) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify(values);
  dispatch({ type: ADD_SUBS_LOADING });
  setAuthToken(localStorage.accessToken);
  try {
    await axios.post(`${ServerURL}/api/courses/`, body, config).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: ADD_SUBS_SUCCESS,
          payload: res.data,
        });
        toast.success("Course successfully added");
        //window.location.reload()
      }
    });
    /*  toast.success("Course successfully added"); */
  } catch (err) {
    console.log(err);
    dispatch({
      type: ADD_SUBS_FAILED,
    });
    toast.error("Something went wrong !");
  }
};

export const updateCourses = (values, id) => async (dispatch) => {
  const config = { headers: { "Content-Type": "application/json" } };
  const body = JSON.stringify(values);
  dispatch({ type: UPDATE_SUBS_LOADING });
  setAuthToken(localStorage.accessToken);
  try {
    const res = await axios.put(`${ServerURL}/api/courses/` + id, body, config);
    dispatch({
      type: UPDATE_SUBS_SUCCESS,
      payload: res.data,
    });
    toast.success("Course successfully updated");
  } catch (err) {
    console.log(err);
    dispatch({
      type: UPDATE_SUBS_FAILED,
    });
    toast.error("Something went wrong !");
  }
};

export const deleteCourse = (id) => (dispatch) => {
  setAuthToken(localStorage.accessToken);
  return axios
    .delete(`${ServerURL}/api/courses/` + id)
    .then(() => {
      dispatch({
        type: DEL_SUBS_SUCCESS,
        payload: id,
      });
    })
    .catch((err) => console.log(err), DEL_SUBS_FAILED);
};
