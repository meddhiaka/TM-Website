require("dotenv").config({});
const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const Course = require("../models/Subscription");
const { verifyAccessToken } = require("../middleware/verify-token");
const {
  validateSubscription,
  isRequestValidated,
} = require("../middleware/validators/validatorSubs");
const User = require("../models/User");
const adminAuth = require("../middleware/adminAuth");
const mongoose = require("mongoose");
const { contactUs, subConfirmation } = require("../middleware/mailer");

//STRIPE_TEST_SECRET_KEY
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @route   POST api/
// @desc    Book a course
// @access  User
router.post(
  "/",
  verifyAccessToken,
  validateSubscription,
  isRequestValidated,
  async (req, res) => {
    try {
      let { course, level, notes, sessions, title, type, hours, currency } =
        req.body;
      const selectedUser = await User.findById(req.user.id);
      if (!selectedUser) {
        return res.status(400).json({
          error: true,
          msg: "Error finding user",
        });
      }

      const selectedCourse = await Course.findById(course);
      if (selectedCourse) {
        return res.status(400).json({
          error: true,
          msg: "Course unavailable",
        });
      }

      const verify = await Subscription.find({
        $and: [{ user: req.user.id }, { course: course }],
      });

      if (verify.length == 0) {
        const newSubs = new Subscription({
          user: req.user.id,
          course,
          level,
          sessions,
          notes,
          type,
          hours,
          title,
          currency,
        });
        if (level != "Beginner") {
          newSubs.status = "pending";
          newSubs.save().then(() => res.status(200).json(newSubs));
          await User.findByIdAndUpdate(
            req.user.id,
            { $push: { subscription: newSubs } },
            { new: true }
          ).then(
            async () =>
              await subConfirmation(
                selectedUser.email,
                title,
                selectedUser.firstName,
                selectedUser.lastName
              ).catch((err) => console.log(err))
          );
        } else {
          newSubs.status = "test";
          newSubs.save().then(() => res.status(200).json(newSubs));
          await User.findByIdAndUpdate(
            req.user.id,
            { $push: { subscription: newSubs } },
            { new: true }
          ).then(
            async () =>
              await subConfirmation(
                selectedUser.email,
                title,
                selectedUser.firstName,
                selectedUser.lastName
              ).catch((err) => console.log(err))
          );
        }
      } else {
        res.status(400).json({
          error: true,
          msg: "Subscription already exists",
        });
        console.log("Subscription already exists");
      }
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
// @desc    Get Subs
// @access  Private Admin
router.get("/all", verifyAccessToken, adminAuth, async (req, res) => {
  try {
    /*     let subs = await Subscription.find({})
      .populate("course", { image: 0, __v: 0 })
      .populate("user", { password: 0, role: 0, __v: 0 }); */
    let usersList = await User.find({})
      .select("-password")
      .select("-__v")
      .populate("subscription");
    res.status(200).json(usersList);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      msg: "server error",
    });
  }
});

// @route   GET api/byuser
// @desc    Get User Subs
// @access  User
router.get("/byuser", verifyAccessToken, async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.user.id)
    let subs = await Subscription.aggregate([
      { $match: { user: id } },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      //cancel some attribute to displays :
      { $project: { icon: 0, __v: 0, slug: 0, updatedAt: 0 } },
      { $project: { course: { __v: 0 } } },
    ]);
    res.status(200).json(subs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      msg: "server error",
    });
  }
});

// @route   PUT api/:subId
// @desc    Update Subscription
// @access  User or Admin
router.put("/:subId", verifyAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "admin") {
      const updated = await Subscription.findByIdAndUpdate(
        req.params.subId,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updated);
    } else {
      const updated = await Subscription.findByIdAndUpdate(
        req.params.subId,
        {
          $set: { level: req.body.level },
        },
        { new: true }
      );
      res.status(200).json(updated);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

// @route   DELETE api/:subsId
// @desc    Delete Subscription
// @access  User
router.delete("/:subId", verifyAccessToken, async (req, res) => {
  try {
    await Subscription.findByIdAndRemove(req.params.subId);
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { subscription: req.params.subId } },
      { new: true }
    );
    res.status(200).json({
      error: false,
      msg: `Deleted successfully`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

// @route   POST api/create-payment
// @desc    Add payment with stripe and upadte subscription status
// @access  User
router.post("/create-payment", async (req, res) => {
  try {
    const { currency, amount, subId } = req.body;
    const selected = await Subscription.findById(subId);
    if (selected) {
      if (selected.status === "request") {
        const params = {
          amount: amount,
          currency: currency,
        };
        const paymentIntent = await stripe.paymentIntents.create(params);
        res.status(200).send({ clientSecret: paymentIntent.client_secret });
      } else {
        res.status(400).json({
          error: true,
          msg: "Subscription already payed",
        });
      }
    } else {
      res.status(400).json({
        error: true,
        msg: "Subscription not found",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

router.put("/confirm-payment/:subId", verifyAccessToken, async (req, res) => {
  try {
    const selected = await Subscription.findById(req.params.subId);
    if (selected) {
      if (selected.status === "request") {
        const updated = await Subscription.findByIdAndUpdate(
          req.params.subId,
          {
            $set: { status: "confirmed", payment: true },
          },
          { new: true }
        );
        console.log(`Subscription ${updated.id}: ${updated.status}`);
        res.status(200).json(updated);
      } else {
        res.status(400).json({
          error: true,
          msg: "Subscription already payed",
        });
      }
    } else {
      res.status(400).json({
        error: true,
        msg: "Subscription not found",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

router.post("/test", async (req, res) => {
  try {
    //let { course } = req.body;
    const selectedUser = await User.findById(req.user.id);
    if (!selectedUser) {
      return res.status(400).json({
        error: true,
        msg: "Error finding user",
      });
    }

    await subConfirmation(
      selectedUser.email,
      "xx",
      selectedUser.firstName,
      selectedUser.lastName
    ).catch((err) => console.log(err));
    res.status(200).send("OK");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      msg: "Server error",
    });
  }
});

// @route   GET api/payment
// @desc    Get stripe config
// @access  Public
router.get("/config", (req, res) => {
  /* STRIPE_TEST_PUBLIC_KEY */
  /* STRIPE_PUBLIC_KEY */
  res.status(200).json(process.env.STRIPE_PUBLIC_KEY);
});

module.exports = router;
