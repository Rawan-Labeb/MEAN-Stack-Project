const Order =require("./../models/order.model");

// getAllUsers
module.exports.getOrders = async () => {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        throw new Error(`Error fetching Orders: ${error.message}`);
    }
}

// get order by User Id
module.exports.getOrdersByUserId = async (userId) => {
    try {
      const Orders = await Order.find({ customerId: userId })
        .populate("customerId", "firstName lastName email") 
        .populate("items.productId", "name price") 
        .exec();
      return Orders;
    } catch (error) {
        console.log(error.message)
      throw new Error("Could not retrieve orders");
    }
};

// get Order by orderId
module.exports.getOrderById = async (orderId) => {
    try
    {
        const order = await Order.findById(orderId);
        // if (!order)
        //     throw new Error("No Order With that id");
        return order;
    }catch(error)
    {
        throw new Error("Could not get order ")
    }
}

// get order by product Id
module.exports.getOrdersByProductId = async (productId) => {
    try {
      const orders = await Order.find({ "items.productId": productId });
      return orders;
    } catch (error) {
      throw new Error("Could not fetch orders by product ID");
    }
};

// return order based on status
module.exports.getOrdersByStatus = async (orderStatus) => {
    try
    {
        orderStatus = orderStatus.toLowerCase();
        const orders = await Order.find({status: orderStatus})
        return orders;
    }catch (error)
    {
        throw new Error ("Could not fetch orders by Status")
    }
}

// get order by customer and status
module.exports.getOrdersByCustomerAndStatus = async (customerId, status) => {
    try {
        status = status.toLowerCase();
        const orders = await Order.find({ customerId, status });
        return orders;
    } catch (error) {
        throw new Error("Could not retrieve orders.");
    }
};

// change order status
module.exports.changeOrderStatus = async (orderId, changedStatus) => {
    try {
        changedStatus = changedStatus.toLowerCase();
        const result = await Order.findOneAndUpdate(
            {_id: orderId },
            { $set: { status: changedStatus } }, 
            { new: true } 
        );

        console.log(result)

        if (!result) {
            throw new Error("Order not found");
        }

        return result; 
    } catch (error) {
        throw new Error(error.message || "Could not change order status");
    }
};

// delete order by id
module.exports.deleteOrder = async (orderId) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({_id: orderId });

        if (!deletedOrder) {
            throw new Error("Order not found.");
        }

        return deletedOrder;
    } catch (error) {
        throw new Error("Could not delete order.");
    }
};

// update order
module.exports.updateOrder = async (orderId, updatedData) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        {_id: orderId},
        { $set: updatedData },
        { new: true, runValidators: true }
      );
      console.log(this.updateOrder);
      if (!updatedOrder) {
        throw new Error("Order not found.");
      }
  
      return updatedOrder;
    } catch (error) {
      throw new Error("Could not update order.");
    }
};

// create order
module.exports.createOrder = async (orderData) => {
    try {
      const newOrder = await Order.create(orderData);
      return newOrder;
    } catch (error) {
      throw new Error("Could not create order.");
    }
};
  




