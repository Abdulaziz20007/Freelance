const router = require("express").Router();
const adminRouter = require("./admin.routes");
const freelancerRouter = require("./freelancer.routes");
const userRouter = require("./user.routes");

router.use("/admin", adminRouter);
router.use("/freelancer", freelancerRouter);
router.use("/user", userRouter);

module.exports = router;
