import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import categoryModel from "../models/categoryModel.js"
import { v2 as cloudinary } from 'cloudinary';
export const getAllProducts = async (req, res) => {
    let products;
    try {
        products = await productModel.find().populate('category');
        if (!products) {
            return res.status(404).json({ success: false, msg: "Products not found" })
        }
        return res.status(200).json({ success: true, products })

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const createProduct = async (req, res) => {
    let user;
    const { name, category, quantity, price, description, image } = req.body;
    let existingCategory;
    if (!name || !category || !quantity || !price || !description) {
        return res.status(400).json({ success: false, msg: "Please provide complete data" })
    }

    try {
        user = await userModel.findById(req.user.id);
        if (user.role !== 1) {
            return res.send("Not Authorize")
        }
        existingCategory = await categoryModel.findOne({ name: category });
        if (!existingCategory) {
            return res.status(404).json({ success: false, msg: "Category Not Found Please create a category first" })
        }


        let fileData = {};
        // Handle File Upload.......
        if (req.file) {
            // Save Image to cloudinary
            let uploadedFile;
            try {
                uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                    folder: "ecommerce-app",
                    resource_type: "image",
                })
            } catch (error) {
                return res.status(500).json({ msg: error })
            }

            fileData = {
                fileName: req.file.originalname,
                filePath: uploadedFile.secure_url,
                fileType: req.file.mimetype,
            }
        }


        let newProduct = await productModel.create({
            name, category: existingCategory._id, quantity, price, description, image: fileData
        })

        let saveProduct = await newProduct.save();
        existingCategory.products.push(saveProduct);
        await existingCategory.save()
        return res.status(201).json({ success: true, msg: "Product created Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const getSingleProduct = async (req, res) => {
    const id = req.params.id;
    let product;
    try {
        product = await productModel.findById(id).populate('category');
        if (!product) {
            return res.status(400).json({ success: false, msg: "Product not found" })
        }

        return res.status(200).json({ success: true, product })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    let product;

    try {
        let user = await userModel.findById(req.user.id);
        if (user.role !== 1) {
            return res.send("Not Authorize")
        }
        product = await productModel.findById(id);
        let category = await categoryModel.findById(product.category);

        if (!product) {
            return res.status(400).json({ success: false, msg: "Product Not Found" })
        }

        await category.products.pull(product);
        await category.save();
        await product.deleteOne()
        return res.status(200).json({ success: true, msg: "Product Deleted Successfully" })
        // let category = await categoryModel.findById()
        // product = await productModel.findByIdAndDelete(id);
        // return res.status(200).json({ success: true, msg: "Product Deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}



export const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, quantity, price, description } = req.body;
    let product;
    const user = await userModel.findById(req.user.id);
    if (user.role !== 1) {
        return res.status(401).send("Not Authorize");
    }
    try {
        product = await productModel.findById(id);

        let updateProduct = await productModel.findByIdAndUpdate(id, {
            name: name || product.name,
            quantity: quantity || product.quantity,
            price: price || product.price,
            description: description || product.description,
        })

        await updateProduct.save();
        return res.status(200).json({ success: true, msg: "Product Updated Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}