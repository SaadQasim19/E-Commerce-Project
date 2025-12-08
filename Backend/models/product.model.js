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
    },
    category: {
      type: String,
      required: false,
      default: 'Uncategorized'
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    quantity: {
      type: Number,
      required: false,
      default: 0
    },
    source: {
      type: String,
      enum: ['manual', 'fakestore', 'dummyjson', 'platzi', 'api'],
      default: 'manual'
    },
    externalId: {
      type: String,
      required: false,
      unique: true,
      sparse: true  // Allows null/undefined values to not be unique
    },
    brand: {
      type: String,
      required: false,
      default: 'Generic'
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
      max: 5
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
      max: 100
    }
  },{timestamps: true});   //& Mongoose will Automatically manage createdAt and updatedAt field



//* Creating the Product model -- it acts as a blueprint for the documents in the collection ( allow us to do a CRUD operation)

//* Even though you wrote "Product" in your code, Mongoose will store your documents inside a MongoDB collection called products. it automatically pluralizes the model name to create the collection name.

const productModel = mongoose.model("Product", productSchema);
export default productModel;