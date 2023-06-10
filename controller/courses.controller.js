const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const { verifyAccessToken } = require("../middleware/verify-token");
const {
  validateCourse,
  isRequestValidated,
} = require("../middleware/validatorCourses");
const AdminAccess = require("../middleware/adminAuth");

// @route   POST api/addcourse
// @desc    Create Course
// @access  Private Admin
router.post(
  "/",
  verifyAccessToken,
  validateCourse,
  AdminAccess,
  isRequestValidated,
  async (req, res) => {
    try {
      let { title, description, price, priceDescription, image, sessions } =
        req.body;
      const exist = await Course.findOne({ title });
      if (exist) {
        return res.status(400).json({
          error: true,
          msg: "Course existes",
        });
      }
      const newCourse = new Course({
        title,
        description,
        price,
        priceDescription,
        image,
        sessions,
      });
      newCourse.save().then(() =>
        res.status(200).json(`Course: ${newCourse.title} created successfully`)
      );
    } catch (error) {
      res.status(500).json({
        error: true,
        msg: "server error",
      });
      console.log(error);
    }
  }
);

// @route   GET api/all
// @desc    Get Courses
// @access  Public
router.get("/all", async (req, res) => {
  try {
    let courses = await Course.find({}).select("-subscription");
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      msg: "server error",
    });
  }
});

// @route   PUT api/:courseId
// @desc    Update Course
// @access  Private Admin
router.put("/:courseId", verifyAccessToken, AdminAccess, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.courseId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

// @route   DELETE api/:courseId
// @desc    Delete Course
// @access  Private Admin
router.delete(
  "/:courseId",
  verifyAccessToken,
  AdminAccess,
  async (req, res) => {
    try {
      let deletedProduct = await Course.findByIdAndRemove(req.params.courseId);
      res.status(200).json({
        error: false,
        msg: `${deletedProduct.title} deleted successfully`,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error: true,
        msg: "Server error",
      });
    }
  }
);

module.exports = router;
