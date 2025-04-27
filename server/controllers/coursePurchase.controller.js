import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    console.log("🛬 Hit createCheckoutSession API"); // ✅ Added for debug
    console.log("📦 Request Body:", req.body); // ✅ Added for debug

    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // ✅ Corrected currency from "Dollar" to "usd" (Stripe expects ISO codes)
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://e-learning-management-system-w9mi.onrender.com/course-progress/${courseId}`,
      cancel_url: `https://e-learning-management-system-w9mi.onrender.com/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("✅ check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }
      console.log("✅ Stripe userId:", purchase.userId);

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      const user = await User.findById(purchase.userId);
      if (user && !user.enrolledCourses.includes(purchase.courseId._id)) {
        user.enrolledCourses.push(purchase.courseId._id);
        await user.save();
      }

      const course = await Course.findById(purchase.courseId._id);
      if (course && !course.enrolledStudents.includes(purchase.userId)) {
        course.enrolledStudents.push(purchase.userId);
        await course.save();
      }
    } catch (error) {
      console.error("Error handling webhook event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};