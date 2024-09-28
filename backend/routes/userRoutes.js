import express from "express";
import {
  authUser,
  RegisterUser,
  getUsers,
  getUserById,
  updateUser,
  logoutUser,
} from "../controllers/userControllers.js";
const router = express.Router();
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, admin, RegisterUser).get(protect, getUsers);
router.post("/login", authUser);
router.post("/logout", logoutUser);
router.route("/:id").get(protect, getUserById).put(updateUser);

export default router;
