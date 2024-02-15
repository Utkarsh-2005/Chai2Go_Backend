import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
    {
         
        username: {
            type: String,
            required: true,
        }, 
        base: {
            type: String,
            required: true,
        }, 
        spice: {
            type:  String,
            required: false,
        },
        sugar: {
            type:  String,
            required: true,
        },
        container: {
            type:  String,
            required: true,
        },
        quantity: {
            type:  String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)
export const Order = mongoose.model('Orders', orderSchema);