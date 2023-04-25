const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../models/Task.model");
const Customer = require("../models/Customer.model");

//  POST /api/tasks  -  Creates a new task
router.post("/tasks", (req, res, next) => {
  const { title, description, customerId } = req.body;

  Task.create({ title, description, customer: customerId })
    .then((newTask) => {
      return Customer.findByIdAndUpdate(customerId, {
        $push: { tasks: newTask._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/tasks -  Retrieves all of the tasks
router.get("/tasks", (req, res, next) => {
  Task.find()
    .populate("customer")
    .then((allTasks) => res.json(allTasks))
    .catch((err) => res.json(err));
});

//  GET /api/customers/:customerId -  Retrieves a specific customer by id
router.get("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Customer document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Task.findById(taskId)
    .populate("customer")
    .then((task) => res.status(200).json(task))
    .catch((error) => res.json(error));
});

// PUT  /api/customers/:customerId  -  Updates a specific customer by id
router.put("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body, { new: true })
    .then((updatedTask) => res.json(updatedTask))
    .catch((error) => res.json(error));
});

// DELETE  /api/customers/:customerId  -  Deletes a specific customer by id
router.delete("/tasks/:taskId", (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndRemove(taskId)
    .then(() =>
      res.json({
        message: `Task with ${taskId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
