import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";

export const createCategory = async (req, res) => {
    let user;
    let existingCategory;
    const { name } = req.body;
    try {
        user = await userModel.findById(req.user.id);
        if (user.role !== 1) {
            return res.status(401).json({ success: false, msg: "Not Authorize" })
        }
        existingCategory = await categoryModel.findOne({ name });

        if (existingCategory) {
            return res.status(404).json({ success: false, msg: "Category Already Exists" })
        }
        const category = await categoryModel.create({
            name: name,
        });
        await category.save()
        return res.status(201).json({ success: true, msg: "Category Created Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: error.msg })
    }
}

export const getAllCategories = async (req, res) => {
    let category;
    try {
        category = await categoryModel.find().populate('products');

        return res.status(200).json({ success: true, category })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })
    }
}

export const deleteCategory = async (req, res) => {
    let user;
    const id = req.params.id;
    try {
        user = await userModel.findById(req.user.id);
        if (user.role !== 1) {
            return res.status(401).json({ success: false, msg: "Not Authorize" })
        }
        let category = await categoryModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, msg: "Category Deleted Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message })

    }
}

export const singleCategory = async (req, res) => {
    const getCategory = req.params.category;
    let existingCategory;

    try {
        existingCategory = await categoryModel.findOne({ name: getCategory }).populate('products');
        if (!existingCategory) {
            return res.status(404).json({ success: false, msg: "Category Not Found" })
        }
        return res.status(200).json({ success: true, existingCategory })
    } catch (error) {
        return
    }

}

