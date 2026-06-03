import Category from '../models/Category.js'

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body

    const existing = await Category.findOne({ slug })
    if (existing) {
      return res.status(400).json({
        message: 'This  category is already exist',
      })
    }

    const category = await Category.create({ name, slug })
    res.status(201).json({ success: true, category })
  } catch (error) {
    next(error)
  }
}

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name')

    res.json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!category) {
      return res.status(404).json({
        message: 'Category not Found',
      })
    }

    res.json({ success: true, category })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({
        message: 'Category not Found',
      })
    }

    res.json({ message: 'Category Deleted' })
  } catch (error) {
    next(error)
  }
}