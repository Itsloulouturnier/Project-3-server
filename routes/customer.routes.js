const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Customer = require("../models/Customer.model");
const Task = require("../models/Task.model");

//  POST /api/customers  -  Creates a new customer
router.post("/customers", (req, res, next) => {
  const { title, description } = req.body;

  Customer.create({ title, description, tasks: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/customers -  Retrieves all of the customers
router.get("/customers", (req, res, next) => {
  Customer.find()
    .populate("tasks")
    .then((allCustomers) => res.json(allCustomers))
    .catch((err) => res.json(err));
});

//  GET /api/customers/:customerId -  Retrieves a specific customer by id
router.get("/customers/:customerId", (req, res, next) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Customer document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Customer.findById(customerId)
    .populate("tasks")
    .then((customer) => res.status(200).json(customer))
    .catch((error) => res.json(error));
});

// PUT  /api/customers/:customerId  -  Updates a specific customer by id
router.put("/customers/:customerId", (req, res, next) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Customer.findByIdAndUpdate(customerId, req.body, { new: true })
    .then((updatedCustomer) => res.json(updatedCustomer))
    .catch((error) => res.json(error));
});

// DELETE  /api/customers/:customerId  -  Deletes a specific customer by id
router.delete("/customers/:customerId", (req, res, next) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Customer.findByIdAndRemove(customerId)
    .then(() =>
      res.json({
        message: `Customer with ${customerId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
