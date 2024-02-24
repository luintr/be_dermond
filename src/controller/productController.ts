import asyncHandler from "../middleware/asyncHandler";
import Product from "../model/productModel";

// @desc      Fetch all Products
// @route     GET /api/products
// @access    Public
export const getProducts = asyncHandler(async (req: any, res: any) => {
  try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "price";

		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const products = await Product.find({ name: { $regex: search, $options: "i" } })
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Product.countDocuments({
			name: { $regex: search, $options: "i" },
		});

		const response = {
			total,
			page: page + 1,
			limit,
			products,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
})

// @desc      Fetch a Product
// @route     GET /api/products/:id
// @access    Public
export const getProductbyId = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    return res.send({ data: product })
  } else {
    res.status(404);
    throw new Error('Product not found')
  }
})

// @desc      Create product
// @route     GET /api/products
// @access    Private/Admin
export const createProduct = asyncHandler(async (req: any, res: any) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Desc',
  })

  const createdProduct = await product.save()

  res.status(200).send(createdProduct)
})

// @desc      Update a product
// @route     PUT /api/products/:id
// @access    Private/Admin
export const updateProduct = asyncHandler(async (req: any, res: any) => {
  const { name, price, description, image, brand, category, countInStock } = req.body

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.send(updatedProduct)
  } else {
    res.status(400);
    throw new Error('Resource not found')
  }
})

// @desc      Delete a product
// @route     DELETE /api/products/:id
// @access    Private/Admin
export const deleteProduct = asyncHandler(async (req: any, res: any) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.status(200).send({ message: 'Product deleted' })
  } else {
    res.status(400);
    throw new Error('Resource not found')
  }
})