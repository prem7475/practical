const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/user", authenticate, authorize("user", "admin"), (req, res) => {
  res.json({ message: "Welcome to the user dashboard.", role: req.user.role });
});

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome to the admin dashboard.", role: req.user.role });
});

module.exports = router;
