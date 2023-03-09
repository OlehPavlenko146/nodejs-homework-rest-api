const express = require("express");

const ctrl = require("../../controllers/auth");

const { schemas } = require("../../models/user");

const { validateBody, authenticate } = require("../../middleware");

const router = express.Router();

router.post("/signup", validateBody(schemas.signupSchema), ctrl.signupUser);

router.post("/login", validateBody(schemas.loginSchema), ctrl.loginUser);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  validateBody(schemas.subscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;
