import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { MdCategory, MdSort, MdArrowDownward, MdArrowUpward, MdSearchOff } from 'react-icons/md';
import { FormControl, Select, MenuItem } from '@mui/material';
import PageNotFound from './PageNotFound.jsx';


const SORT_FIELDS = [
  { value: 'title', label: 'Name' },
  { value: 'discountedPrice', label: 'Price' },
  { value: 'rating', label: 'Rating' },
];

const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

function AllProducts({ product }) {
  let { wishlistcount, setwishlistcount, cartCount, setCartCount, wishlist, setWishlist, cartlist, setcartlist, categories, selectedProduct } = product;
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const rawCategory = pathSegments[pathSegments.length - 1] || '';
  const category = rawCategory
    ? rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
    : '';

  // Determine which products to show based on category and categories array
  let filteredProducts = [];
  let isValidCategory = false;
  if (!category || category === 'Search' || category === 'Latest') {
    // Show all products if no category or Search
    filteredProducts = selectedProduct || [];
    isValidCategory = true;
  } else if (
    Array.isArray(categories) &&
    categories.some(cat => cat.name && cat.name.toLowerCase() === category.toLowerCase())
  ) {
    // Category exists in categories array
    isValidCategory = true;
    filteredProducts = (selectedProduct || []).filter(
      prod => prod.category && prod.category.toLowerCase() === category.toLowerCase()
    );
  } else {
    // Invalid category
    isValidCategory = false;
  }

  // Sorting state
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sorting logic
  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    sorted.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === 'title') {
        aValue = (aValue || '').toLowerCase();
        bValue = (bValue || '').toLowerCase();
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });
    return sorted;
  }, [filteredProducts, sortField, sortOrder]);

  // Handlers
  const handleSortFieldChange = (e) => setSortField(e.target.value);
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  // Wishlist and cart handlers
  const handleToggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setwishlistcount(wishlistcount - 1);
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setwishlistcount(wishlistcount + 1);
      setWishlist([...wishlist, id]);
    }
  };

  // cartlist is now an array of objects: [{id, quantity}]
  // cartCount should be the sum of all quantities in cartlist
  const handleAddToCart = (id) => {
    const existingItem = cartlist.find(item => item.id === id);
    if (existingItem) {
      return;
    } else {
      // Add new product with quantity 1
      setcartlist([...cartlist, { id, quantity: 1 }]);
      setCartCount(cartCount + 1);
    }
  };

  if (!isValidCategory) {
    return <PageNotFound />;
  }

  return (
    <div className="bg-slate-50 w-full px-2 md:px-4 lg:px-8 py-4">
      {/* Slim Banner/Toolbar */}
      <div
        className="w-full flex flex-row items-center justify-between flex-wrap gap-2 mb-4 px-2 py-2"
        style={{
          background: 'linear-gradient(90deg, #fceabb 0%, #f8b500 100%)',
          borderRadius: 16,
          boxShadow: '0 2px 12px 0 rgba(248,181,0,0.10)',
          fontWeight: 600,
          fontSize: '1.05rem',
          color: '#3b2f0b',
          minHeight: 0,
        }}
      >
        {/* Category/Title */}
        <div className="flex flex-row items-center gap-1 lg:gap-2 min-w-0">
          <MdCategory className="text-yellow-700" size={22} />
          <span className="truncate">
            {category ? `${category} Products` : 'All Products'}
          </span>
          <span className={`font-normal text-[0.85rem] lg:text-[1rem] ${sortedProducts.length === 0 ? "text-red-500" : "text-green-600"}`}>
            ({sortedProducts.length} Product{sortedProducts.length !== 1 ? 's' : ''} Found)
          </span>
        </div>
        {/* Sort By */}
        <div className='w-[400px] mx-auto lg:mx-0 flex justify-center xl:justify-end flex-wrap gap-2'>
          <div className="flex flex-row items-center gap-1 bg-white/80 rounded-md px-2 py-1">
            <MdSort className="text-yellow-700" size={18} />
            <span className="text-sm text-yellow-900 font-semibold mr-1">Sort</span>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 80 }}>
              <Select 
                id="sortField"
                value={sortField}
                onChange={handleSortFieldChange}
                displayEmpty
                sx={{
                  background: '#fff',
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  height: 32,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#ffe082' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f8b500' },
                  padding: 0,
                }}
                inputProps={{ 'aria-label': 'Sort by' }}
              >
                {SORT_FIELDS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* Order */}
          <div className="flex flex-row items-center gap-1 bg-white/80 rounded-md px-2 py-1">
            {sortOrder === 'asc' ? (
              <MdArrowUpward className="text-yellow-700" size={18} />
            ) : (
              <MdArrowDownward className="text-yellow-700" size={18} />
            )}
            <span className="text-sm text-yellow-900 font-semibold mr-1">Order</span>
            <FormControl size="small" variant="outlined" sx={{ minWidth: 80 }}>
              <Select
                id="sortOrder"
                value={sortOrder}
                onChange={handleSortOrderChange}
                displayEmpty
                sx={{
                  background: '#fff',
                  borderRadius: 1,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  height: 32,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#ffe082' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f8b500' },
                  padding: 0,
                }}
                inputProps={{ 'aria-label': 'Order' }}
              >
                {SORT_ORDERS.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div
        className="
         mx-auto
         w-[98%]
         md:w-[80%]
         lg:w-[70%]
         flex
         flex-wrap
         justify-center
         items-center
         gap-[6px] lg:gap-[1rem]
        "
      >
        {sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-16">
            <MdSearchOff className="text-gray-400 mb-2" size={64} />
            <span className="text-lg font-semibold text-gray-500">No products found</span>
          </div>
        ) : (
          sortedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              images={prod.images}
              discountPercent={prod.discountPercent}
              isWishlisted={wishlist.includes(prod.id)}
              brand={prod.brand}
              title={prod.title}
              rating={prod.rating}
              originalPrice={prod.originalPrice}
              discountPrice={prod.discountPrice}
              onAddToCart={() => handleAddToCart(prod.id)}
              onToggleWishlist={() => handleToggleWishlist(prod.id)}
              cartlist={cartlist}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AllProducts;