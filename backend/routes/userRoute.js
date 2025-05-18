const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../utils/token-manager");

// User routes
router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.get("/logout", verifyToken, userController.userLogout);

// Permit routes
router.post("/add-permit", verifyToken, userController.createPermit);
router.get("/permits", verifyToken, userController.getAllPermits);
router.put("/edit-permit/:id", verifyToken, userController.editPermit);
router.delete("/delete-permit/:id", verifyToken, userController.deletePermit);

// ✅ Search permits route
router.get("/search-permits", verifyToken, userController.searchPermits);

module.exports = router;
