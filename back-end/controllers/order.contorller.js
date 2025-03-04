const {
    getAllOrders,
    getOrderById,
    getOrdersByCustomerAndStatus,
    getOrdersByUserId,
    getOrdersByStatus,
    getOrdersByProductId,
    getOrdersBySellerId, // Add this line
    deleteOrder,
    changeOrderStatus,
    createOrder,
    updateOrder,
} = require("../services/order.service")

const {authenticaiton} = require("./../middlewares/authentication.middleware") 
const {authorize} = require("./../middlewares/authorization.middleware")


const router = require("express").Router();
const express = require("express");
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// create order
router.post("/createOrder", authenticaiton, authorize("customer"), async (req, res) => {
  try {
    const result = await createOrder(req.body);
    if (!result.success)
      return res.status(400).json(result.message);


    return res.status(201).json(result.message);
  } catch (error) {
      res.status(500).send(error.message);
  }
})

module.exports = router;

// retrieve orders 
router.get("/getAllOrders", authenticaiton, authorize("clerk"),  async (req, res) => {
  try {
    const result = await getAllOrders();
    if (!result.success)
      return res.status(400).json(result.message);

    return res.status(200).json(result.message);

  } catch (error) {
      res.status(500).send(error.message);
  }
})


// get order by id
router.get("/getOrderById/:id", authenticaiton, authorize("customer"), async (req, res) => {
  try {
    const result = await getOrderById(req.params.id);
    if (!result.success)
      return res.status(400).json(result.message);

    return res.status(200).json(result.message);

  } catch (error) {
      res.status(500).send(error.message);
  }
})

// get orders by cutomer and status
router.get("/getOrderByCustomerAndStatus/:id/:status", authenticaiton, authorize("customer"), async (req, res) => {
  try {
    const result = await getOrdersByCustomerAndStatus(req.params.id,req.params.status );
    if (!result.success)
      return res.status(400).json(result.message);
    return res.status(200).json(result.message);
  } catch (error) {
      res.status(500).send(error.message);
  }
})


// get order by customer id 
router.get("/getOrderByCustomerId/:id", authenticaiton, authorize("customer"), async (req, res) => {
  try {
    const result = await getOrdersByUserId(req.params.id );
    if (!result.success)
      return res.status(400).json(result.message);
    return res.status(200).json(result.message);
  } catch (error) {
      res.status(500).send(error.message);
  }
})



// get order by status
router.get("/getOrdersByStatus/:status", authenticaiton, authorize("clerk"), async (req, res) => {
  try {
    const result = await getOrdersByStatus(req.params.status );
    if (!result.success)
      return res.status(400).json(result.message);
    return res.status(200).json(result.message);
  } catch (error) {
      res.status(500).send(error.message);
  }
})



// change order status ================================================================================
router.put("/changeOrderStatus/:id/:status", authenticaiton, authorize("clerk"), async (req, res) => {
  try {
    const result = await changeOrderStatus(req.params.id,req.params.status);
    if (!result.success)
      return res.status(400).json(result.message);
    return res.status(200).json(result.message);
  } catch (error) {
      res.status(500).send(error.message);
  }
})

// delete order ==============================================================================
router.delete("/deleteOrder/:id", authenticaiton, authorize("customer"), async (req, res) => {
  try {
    const result = await deleteOrder(req.params.id);
    if (!result.success)
      return res.status(400).json(result.message);
    return res.status(200).json("Order Deleted Successfully");
  } catch (error) {
      res.status(500).send(error.message);
  }
})

// GET orders for a specific seller
router.get("/getOrdersBySellerId/:sellerId", authenticaiton, authorize("seller"), async (req, res) => {
  try {
      // Check if the seller is requesting their own orders
      const tokenSellerId = req.user.id || req.user.sub || req.user._id;
      const requestedSellerId = req.params.sellerId;
      
      // If not the seller's own ID and not a manager, deny access
      if (tokenSellerId !== requestedSellerId && req.user.role.toLowerCase() !== 'manager') {
          return res.status(403).json({ message: "You can only access your own orders" });
      }
      
      const result = await getOrdersBySellerId(requestedSellerId);
      if (!result.success) {
          return res.status(400).json(result.message);
      }
      
      return res.status(200).json(result.message);
  } catch (error) {
      console.error("Error in getOrdersBySellerId controller:", error);
      res.status(500).send(error.message);
  }
});

module.exports = router;
