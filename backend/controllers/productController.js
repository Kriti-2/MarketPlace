import { dataService } from '../config/dataService.js';

// @desc    Fetch all products with optional query search/filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    
    // Price filters
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filters
    const ratingFilter = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};

    // Combine filters
    const filterQuery = { ...keyword, ...category, ...priceFilter, ...ratingFilter };

    // Sorting parameters
    let sortOptions = {};
    if (req.query.sortBy) {
      if (req.query.sortBy === 'priceAsc') sortOptions.price = 1;
      else if (req.query.sortBy === 'priceDesc') sortOptions.price = -1;
      else if (req.query.sortBy === 'topRated') sortOptions.rating = -1;
      else sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = -1; // default sort
    }

    const products = await dataService.products.find(filterQuery, { sort: sortOptions });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await dataService.products.findById(req.query.id || req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await dataService.products.findById(req.params.id);

    if (product) {
      await dataService.products.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await dataService.products.create({
      name: name || 'Sample Product',
      price: price || 0,
      user: req.user._id,
      image: image || '/images/sample.jpg',
      brand: brand || 'Sample Brand',
      category: category || 'Sample Category',
      countInStock: countInStock || 0,
      description: description || 'Sample Description',
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await dataService.products.findById(req.params.id);

    if (product) {
      const updatedProduct = await dataService.products.findByIdAndUpdate(req.params.id, {
        name: name || product.name,
        price: price !== undefined ? price : product.price,
        description: description || product.description,
        image: image || product.image,
        brand: brand || product.brand,
        category: category || product.category,
        countInStock: countInStock !== undefined ? countInStock : product.countInStock,
      });

      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await dataService.products.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed by you');
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        createdAt: new Date().toISOString(),
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      // Round rating to 1 decimal place
      product.rating = Math.round(product.rating * 10) / 10;

      await dataService.products.findByIdAndUpdate(req.params.id, {
        reviews: product.reviews,
        numReviews: product.numReviews,
        rating: product.rating,
      });

      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};
