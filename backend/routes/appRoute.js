const { Router } = require("express");
const userRoute = require("./userRoute");
const appRouter = Router();

appRouter.use("/user", userRoute);

module.exports = appRouter;