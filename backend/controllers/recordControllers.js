import asyncHandler from "express-async-handler";
import Record from "../models/recordModel.js";

const addRecord = asyncHandler(async (req, res) => {
  const { user, location, type, bedrooms, area, price } = req.body;

  // Set the initial count to 1
  let count = 1;

  // Check if a record with the same user and property details already exists
  const recordExists = await Record.findOne({
    user,
    location,
    type,
    bedrooms,
    area,
    price,
  });

  if (recordExists) {
    // If record exists, increment the count
    recordExists.count += 1;
    await recordExists.save();
    res.status(200).json({
      message: "Record count updated",
      record: recordExists,
    });
  } else {
    // If no record exists, create a new one with count 1
    const newRecord = await Record.create({
      user,
      count,
      location,
      type,
      bedrooms,
      area,
      price,
    });

    res.status(201).json({
      message: "New record created",
      record: newRecord,
    });
  }
});

const getRecord = asyncHandler(async (req, res) => {
  const records = await Record.find({}).populate(
    "user",
    "first_name last_name"
  );
  res.json(records);
});

const deleteRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);
  if (record) {
    await record.deleteOne();
    res.json({ message: "Record removed" });
  } else {
    res.status(404);
    throw new Error("Record not found");
  }
});

const getRecordsByUserId = asyncHandler(async (req, res) => {
  const records = await Record.find({ user: req.params.id }).populate(
    "user",
    "first_name last_name"
  );

  if (records && records.length > 0) {
    res.json(records);
  } else {
    res.status(404);
    throw new Error("No records found for this user");
  }
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (record) {
    record.user = req.body.user || record.user;
    record.count = req.body.count || record.count;
    record.location = req.body.location || record.location;
    record.type = req.body.type || record.type;
    record.bedrooms = req.body.bedrooms || record.bedrooms;
    record.area = req.body.area || record.area;
    record.price = req.body.price || record.price;

    const updatedRecord = await record.save();

    res.status(200).json({
      _id: updatedRecord._id,
      user: updatedRecord.user,
      count: updatedRecord.count,
      location: updatedRecord.location,
      type: updatedRecord.type,
      bedrooms: updatedRecord.bedrooms,
      area: updatedRecord.area,
      price: updatedRecord.price,
      message: "Record updated successfully",
    });
  } else {
    res.status(404);
    throw new Error("Record not found");
  }
});

export { addRecord, getRecord, deleteRecord, getRecordsByUserId, updateRecord };