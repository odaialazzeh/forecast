import express from "express";
import {
  authUser,
  RegisterUser,
  getUsers,
  getUserById,
  updateUser,
  logoutUser,
  deleteUser,
} from "../controllers/userControllers.js";
const router = express.Router();
import { admin, protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, RegisterUser)
  .get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/logout", logoutUser);
router
  .route("/:id")
  .get(protect, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
