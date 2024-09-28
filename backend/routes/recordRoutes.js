import express from "express";
import {
  addRecord,
  getRecord,
  deleteRecord,
  getRecordsByUserId,
  updateRecord,
} from "../controllers/recordControllers.js";
const router = express.Router();
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addRecord).get(protect, getRecord);
router
  .route("/:id")
  .get(protect, getRecordsByUserId)
  .put(protect, admin, updateRecord)
  .delete(protect, admin, deleteRecord);

export default router;
