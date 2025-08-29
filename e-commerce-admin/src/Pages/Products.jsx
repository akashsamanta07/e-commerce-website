import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { FaEllipsisH, FaStar, FaRegStar, FaStarHalfAlt, FaRupeeSign } from 'react-icons/fa';
import dumy1 from '../assets/dumy.jpg';
import dumy2 from '../assets/dumy.jpg';
import dumy3 from '../assets/dumy.jpg';
import dumy4 from '../assets/dumy.jpg';
import notify from '../components/Notification/notify';

// Use this array for all category and subcategory
const categoryArr = [
  { id: 1, name: 'Fashion', subcategories: ['Men', 'Women', 'Kids'] },
  { id: 2, name: 'Electronics', subcategories: ['Mobiles', 'Laptops', 'Smart Watch'] },
  { id: 3, name: 'Bags', subcategories: ['Men Bags', 'Women Bags'] },
  { id: 4, name: 'Footwear', subcategories: ['Men Footwears', 'Women Footwear', 'Kids Footwear'] },
  { id: 5, name: 'Groceries', subcategories: ['Vegetables', 'Fruits', 'Others'] },
  { id: 6, name: 'Beauty', subcategories: ['Skincare', 'Makeup', 'Fragrance'] },
  { id: 7, name: 'Wellness', subcategories: ['Supplements', 'Yoga Mats', 'Personal Care'] },
  { id: 8, name: 'Jewellery', subcategories: ['Necklaces', 'Rings', 'Bracelets'] },
];

const initialProducts = [
  {
    id: 1,
    title: 'T-Shirt',
    description: 'Comfortable cotton t-shirt',
    category: 'Fashion',
    subcategory: 'Men',
    brand: 'Nike',
    originalPrice: 30,
    discountPrice: 20,
    inStock: 100,
    rating: 4.5,
    image: dumy1,
    sales: 50,
  },
  {
    id: 8,
    title: 'T-Shirt',
    description: 'Comfortable cotton t-shirt',
    category: 'Fashion',
    subcategory: 'Men',
    brand: 'Nike',
    originalPrice: 30,
    discountPrice: 20,
    inStock: 100,
    rating: 4.5,
    image: dumy1,
    sales: 50,
  },
  {
    id: 9,
    title: 'T-Shirt',
    description: 'Comfortable cotton t-shirt',
    category: 'Fashion',
    subcategory: 'Men',
    brand: 'Nike',
    originalPrice: 30,
    discountPrice: 20,
    inStock: 100,
    rating: 4.5,
    image: dumy1,
    sales: 50,
  },
  {
    id: 2,
    title: 'iPhone 14 Pro Max Ultra Long Name That Should Overflow',
    description: 'Latest Apple iPhone',
    category: 'Electronics',
    subcategory: 'Mobiles',
    brand: 'Apple',
    originalPrice: 1200,
    discountPrice: 1100,
    inStock: 20,
    rating: 4.8,
    image: dumy2,
    sales: 10,
  },
  {
    id: 3,
    title: 'Running Shoes',
    description: 'Lightweight running shoes',
    category: 'Fashion',
    subcategory: 'Women',
    brand: 'Adidas',
    originalPrice: 80,
    discountPrice: 60,
    inStock: 40,
    rating: 4.2,
    image: dumy3,
    sales: 25,
  },
  {
    id: 4,
    title: 'Bananas',
    description: 'Fresh organic bananas',
    category: 'Groceries',
    subcategory: 'Fruits',
    brand: 'Generic',
    originalPrice: 2,
    discountPrice: 1.5,
    inStock: 200,
    rating: 4.0,
    image: dumy4,
    sales: 100,
  },
];

const defaultFormState = {
  title: '',
  brand: '',
  description: '',
  category: '',
  subcategory: '',
  originalPrice: '',
  discountPrice: '',
  inStock: '',
  rating: '',
  image: '',
};

function Products() {
  // Product list state
  const [products, setProducts] = useState(initialProducts);

  // Search State
  const [searchCategory, setSearchCategory] = useState('');
  const [searchSubcategory, setSearchSubcategory] = useState('');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formState, setFormState] = useState(defaultFormState);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Filtered products for table
  const filteredProducts = products.filter(p => {
    let match = true;
    if (searchCategory) match = match && p.category === searchCategory;
    if (searchSubcategory) match = match && p.subcategory === searchSubcategory;
    return match;
  });

  // Handle Delete Product
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    notify("warning","Product Delete Successfully");
  };

  // TableContainer style
  const tableContainerSx = {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    bgcolor: '#f3f4f6',
    overflowX: 'auto',
    ...(filteredProducts.length > 4
      ? { maxHeight: '50vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  // Get subcategories for selected category
  const getSubcategories = (catName) => {
    const cat = categoryArr.find(c => c.name === catName);
    return cat ? cat.subcategories : [];
  };

  // Helper for title cell: show ellipsis and tooltip if too long
  const renderTitleCell = (title) => {
    const maxLen = 22;
    const isOverflow = title.length > maxLen;
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          maxWidth: 180,
        }}
      >
        <Tooltip title={isOverflow ? title : ''} arrow>
          <Box
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 500,
              flex: 1,
              minWidth: 0,
              maxWidth: 150,
              pr: isOverflow ? 1 : 0,
              display: 'inline-block'
            }}
          >
            {title}
          </Box>
        </Tooltip>
        {isOverflow && (
          <Tooltip title="Title too long" arrow>
            <Box sx={{ ml: 0.5, color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
              <FaEllipsisH size={16} />
            </Box>
          </Tooltip>
        )}
      </Box>
    );
  };

  // Render rating stars (with half star support)
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
    const totalStars = 5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-full-${i}`} color="#fbbf24" size={18} style={{ marginRight: 1 }} />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="star-half" color="#fbbf24" size={18} style={{ marginRight: 1 }} />);
    }
    const emptyStars = totalStars - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`star-empty-${i}`} color="#fbbf24" size={18} style={{ marginRight: 1 }} />);
    }
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {stars}
        <Typography variant="body2" sx={{ ml: 0.5, color: '#6b7280', fontWeight: 500 }}>
          {Number(rating).toFixed(1)}
        </Typography>
      </Box>
    );
  };

  // Render price cell with original price (strikethrough) and discount price, in Rs
  const renderPriceCell = (original, discount) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography
        variant="body2"
        sx={{
          textDecoration: 'line-through',
          color: '#9ca3af',
          fontSize: 14,
          fontWeight: 400,
          mb: 0.2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FaRupeeSign style={{ marginRight: 2, fontSize: 13 }} />
        {original}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#16a34a',
          fontWeight: 600,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FaRupeeSign style={{ marginRight: 2, fontSize: 15 }} />
        {discount}
      </Typography>
    </Box>
  );

  // Dialog open/close handlers
  const handleOpenAdd = () => {
    setDialogMode('add');
    setFormState(defaultFormState);
    setImagePreview('');
    setOpenDialog(true);
    setEditId(null);
  };

  const handleOpenEdit = (product) => {
    setDialogMode('edit');
    setFormState({
      title: product.title,
      brand: product.brand,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      inStock: product.inStock,
      rating: product.rating,
      image: '', // for file input, keep empty
    });
    setImagePreview(product.image);
    setOpenDialog(true);
    setEditId(product.id);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormState(defaultFormState);
    setImagePreview('');
    setEditId(null);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setFormState((prev) => ({
        ...prev,
        image: file,
      }));
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview('');
      }
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
      // If category changes, reset subcategory
      if (name === 'category') {
        setFormState((prev) => ({
          ...prev,
          subcategory: '',
        }));
      }
    }
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const {
      title, brand, description, category, subcategory,
      originalPrice, discountPrice, inStock, rating
    } = formState;
    if (
      !title || !brand || !description || !category || !subcategory ||
      !originalPrice || !discountPrice || !inStock || !rating
    ) {
      alert('Please fill all fields.');
      return;
    }

    let imageToUse = imagePreview;
    // If new image uploaded, use preview, else fallback to dummy
    if (!imageToUse) {
      // fallback to a dummy image
      imageToUse = dumy1;
    }

    if (dialogMode === 'add') {
      const newProduct = {
        id: Date.now(),
        title: formState.title,
        brand: formState.brand,
        description: formState.description,
        category: formState.category,
        subcategory: formState.subcategory,
        originalPrice: Number(formState.originalPrice),
        discountPrice: Number(formState.discountPrice),
        inStock: Number(formState.inStock),
        rating: Number(formState.rating),
        image: imageToUse,
        sales: 0,
      };
      setProducts([newProduct, ...products]);
    } else if (dialogMode === 'edit' && editId !== null) {
      setProducts(products.map((p) =>
        p.id === editId
          ? {
              ...p,
              title: formState.title,
              brand: formState.brand,
              description: formState.description,
              category: formState.category,
              subcategory: formState.subcategory,
              originalPrice: Number(formState.originalPrice),
              discountPrice: Number(formState.discountPrice),
              inStock: Number(formState.inStock),
              rating: Number(formState.rating),
              image: imagePreview || p.image,
            }
          : p
      ));
    }
    handleCloseDialog();
    notify("success","Product Upload/Update Successfully");
  };

  return (
    <Box sx={{ m: 2,p:1, bgcolor: '#fff' }}>
      {/* Section 1: Add Product */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        m={3}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          sx={{ color: '#ec4899', mb: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}
        >
          Product List
        </Typography>
        <Button
          variant="contained"
          startIcon={<MdAdd />}
          sx={{
            bgcolor: '#db2777',
            '&:hover': { bgcolor: 'black' },
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 160,
          }}
          onClick={handleOpenAdd}
        >
          Add Product
        </Button>
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add Product' : 'Edit Product'}
        </DialogTitle>
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Title"
                name="title"
                value={formState.title}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                label="Brand Name"
                name="brand"
                value={formState.brand}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                label="Description"
                name="description"
                value={formState.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                minRows={2}
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formState.category}
                  label="Category"
                  onChange={handleFormChange}
                >
                  {categoryArr.map(cat => (
                    <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory"
                  value={formState.subcategory}
                  label="Subcategory"
                  onChange={handleFormChange}
                  disabled={!formState.category}
                >
                  {getSubcategories(formState.category).map((sub, idx) => (
                    <MenuItem key={idx} value={sub}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Original Price"
                name="originalPrice"
                type="number"
                value={formState.originalPrice}
                onChange={handleFormChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Discount Price"
                name="discountPrice"
                type="number"
                value={formState.discountPrice}
                onChange={handleFormChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Stock"
                name="inStock"
                type="number"
                value={formState.inStock}
                onChange={handleFormChange}
                fullWidth
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Rating"
                name="rating"
                type="number"
                value={formState.rating}
                onChange={handleFormChange}
                fullWidth
                required
                inputProps={{ min: 0, max: 5, step: 0.1 }}
              />
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ mr: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    name="image"
                    onChange={handleFormChange}
                  />
                </Button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ height: 60, borderRadius: 8, marginTop: 8, background: '#fff' }}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {dialogMode === 'add' ? 'Add' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Section 2: Search by Category/Subcategory */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={3}
        mt={2}
        flexWrap="wrap"
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={searchCategory}
            label="Category"
            onChange={e => {
              setSearchCategory(e.target.value);
              setSearchSubcategory('');
            }}
          >
            <MenuItem value="">All</MenuItem>
            {categoryArr.map(cat => (
              <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={searchSubcategory}
            label="Subcategory"
            onChange={e => setSearchSubcategory(e.target.value)}
            disabled={!searchCategory}
          >
            <MenuItem value="">All</MenuItem>
            {getSubcategories(searchCategory).map((sub, idx) => (
              <MenuItem key={idx} value={sub}>{sub}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Section 3: Product Table */}
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db', maxWidth: 180 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Subcategory</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Sales</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ height: 60, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                  />
                </TableCell>
                <TableCell sx={{
                  border: '1px solid #d1d5db',
                  maxWidth: 180,
                  minWidth: 100,
                  p: 1,
                  verticalAlign: 'middle'
                }}>
                  {renderTitleCell(product.title)}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  {product.category}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  {product.subcategory}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db', minWidth: 90 }}>
                  {renderPriceCell(product.originalPrice, product.discountPrice)}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#2563eb', // blue-600
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {product.sales}
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#16a34a', // green-600
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    {product.inStock}
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db', minWidth: 120 }}>
                  {renderRatingStars(product.rating)}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Products;