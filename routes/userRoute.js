const express = require("express");
const router = express.Router();
const authController = require("../controller/userController");
const authenticateToken = require("../middleWare/auth");


router.post("/signup/user", authController.signupUser);
router.post("/signup/admin", authController.signupAdmin);
router.post("/signup/superadmin", authController.signupSuperadmin);
router.post("/login", authController.loginUser);

router.get("/profile", authenticateToken, (req, res) => {
  // Access user profile using req.user
  res.status(200).json({ user: req.user });
});

module.exports = router;
