import mongoose from "mongoose";


//^ Defining the Products schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    }
  },{timestamps: true});   //& Mongoose will Automatically manage createdAt and updatedAt field



//* Creating the Product model -- it acts as a blueprint for the documents in the collection ( allow us to do a CRUD operation)

//* Even though you wrote "Product" in your code, Mongoose will store your documents inside a MongoDB collection called products. it automatically pluralizes the model name to create the collection name.

const productModel = mongoose.model("Product", productSchema);
export default productModel;