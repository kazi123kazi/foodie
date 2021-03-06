const mongoose = require("mongoose");
var mongooseTypePhone = require("mongoose-type-phone");

const Food = require("./food");

const Schema = mongoose.Schema;
const OrderSchemaOptions = {
  virtuals: true
};
const OrderSchema = new Schema(
  {
    foods: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Food"
        },
        price: {
          type: Number
        },
        name: {
          type: String
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    restaurant: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant"
      },
      name: {
        type: String
      }
    },
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      name: {
        type: String
      }
    },
    deliveryGuy: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "DeliveryGuy",
        default: null
      },
      name: {
        type: String
      },
      phone: {
        type: mongoose.SchemaTypes.Phone
      }
    },
    status: {
      type: String,
      enum: ["RECIEVED", "LEFT", "DELIVERED", "CANCELED"],
      default: "RECIEVED"
    },
    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "CARD"],
        required: true
      },
      status: {
        type: String,
        enum: ["UNPAID", "PAID"],
        default: "UNPAID"
      },
      total: {
        type: Number,
        default: 0
      }
    }
  },
  OrderSchemaOptions
);

// =================================== Virtuals ===================================================
// // All virtuals will be named with the - in between
// const RestaurantNameVirtual = OrderSchema.virtual("reataurant-name");
// const UserNameVirtual = OrderSchema.virtual("user-name");
// const DeliveryGuyNameVirtual = OrderSchema.virtual("deliveryGuy-name");
// const DeliveryGuyPhoneVirtual = OrderSchema.virtual("deliveryGuy-phone");

// RestaurantNameVirtual.get(async () => {
//   return (await Restaurant.findById(order.restaurant)).name;
// });

// UserNameVirtual.get(async () => {
//   return (await User.findById(order.user)).name;
// });

// DeliveryGuyNameVirtual.get(async () => {
//   if (!order.deliveryGuy) {
//     return null;
//   }
//   return (await DeliveryGuy.findById(order.deliveryGuy)).name;
// });

// DeliveryGuyPhoneVirtual.get(async () => {
//   if (!order.deliveryGuy) {
//     return null;
//   }
//   return (await DeliveryGuy.findById(order.deliveryGuy)).phone;
// });


OrderSchema.methods.setTotal = async function (foods){
  const order = this
  try {
    for(let i = 0; i < foods.length; i++){
      order.payment.total += foods[i].price * foods[i].quantity
    }
  } catch (error) {
    
  }
}

// ========================================= Methods =====================================================
// method to set the food array
OrderSchema.methods.setFoods = async function(foods) {
  const order = this;
  try {
      
    for(let i = 0; i < foods.length;i++ ){
      const food = await Food.findById(foods[i].foodid)
      const arr = 
        {
          _id: foods[i].foodid,
          price: foods[i].price,
          name: food.name,
          quantity: foods[i].quantity
        }
      

      console.log(arr)
      order.foods.push(arr)
    }    
    // const arr = foods.map(async ({ foodid, quantity, price }) => {
    //   var food = await Food.findById(foodid);
    //   console.log(food)
    //   console.log(price)
    //   console.log(quantity)
    //   console.log(food.name);
    //   if (!food) {
    //     throw new Error("Invalid food in the array");
    //   }

    //   return {
    //     _id: foodid,
    //     name: food.name,
    //     price: price,
    //     quantity: quantity
    //   };
    // });
    // console.log(arr);
    // order.foods = arr;
  } catch (error) {
    console.log(error);
  }
};

// method to set the user
OrderSchema.methods.setUser = async function(user) {
  const order = this;
  try {
    // Add order to the users orders list
    user.orders.push(order._id);
    // Add users name and id to order.user
    order.user = {
      _id: user._id,
      name: user.name
    };
    // Save them both

    await user.save();
    await order.save();
  } catch (error) {
    console.log(error);
  }
};

// method to set the restaurant
OrderSchema.methods.setRestaurant = async function(restaurant) {
  const order = this;
  try {
    // Add order to the users orders list
    restaurant.orders.push(order._id);
    // Add users name and id to order.user
    order.restaurant = {
      _id: restaurant._id,
      name: restaurant.name
    };
    // Save them both
    await order.save();
    await restaurant.save();
  } catch (error) {
    console.log(error);
  }
};

// method to assign the deliveryGuy
OrderSchema.methods.setDeliveryGuy = async function(deliveryGuy) {
  const order = this;
  try {
    // Add order to the users orders list
    deliveryGuy.orders.push(order._id);
    // Add users name and id to order.user
    order.deliveryGuy._id = {
      _id: deliveryGuy._id,
      name: deliveryGuy.name,
      phone: deliveryGuy.phone
    };
    // Save them both
    await order.save();
    await deliveryGuy.save();
  } catch (error) {
    console.log(error);
  }
};

// Uncomment when done with schema
module.exports = Order = mongoose.model("Order", OrderSchema);
