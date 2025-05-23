const Router = require("express");
const router = new Router();
const adminRouter = require("./adminRouter");
const analyticsRouter = require("./analyticsRouter");
const authRouter = require("./authRouter");
const deviceRouter = require("./deviceRouter");
const fitnessStudioRouter = require("./fitnessStudioRouter");
const goalRouter = require("./goalRouter");
const notificationRouter = require("./notificationRouter");
const roleRouter = require("./roleRouter");
const trainingDataRouter = require("./trainingDataRouter");
const trainingRouter = require("./trainingRouter");
const userRouter = require("./userRouter");
const userFitnessStudioRouter = require("./userFitnessStudioRouter");

router.use("/admin", adminRouter);
router.use("/analytics", analyticsRouter);
router.use("/auth", authRouter);
router.use("/devices", deviceRouter);
router.use("/fitness-studios", fitnessStudioRouter);
router.use("/goals", goalRouter);
router.use("/notifications", notificationRouter);
router.use("/roles", roleRouter);
router.use("/training-datas", trainingDataRouter);
router.use("/trainings", trainingRouter);
router.use("/users", userRouter);
router.use("/user-fitness-studios", userFitnessStudioRouter);

module.exports = router;
