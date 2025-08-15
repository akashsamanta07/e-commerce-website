import React, { useState, useRef } from 'react';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { IconButton, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import './swiper.css'
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { toast } from 'react-toastify';
import DefaultProduct from '../components/DefaultProduct';

// Dummy data for demonstration
const product = {
    id:1,
    category:"Beauty",
    title: "Stylish Headphones",
    brand: "SoundMagic",
    rating: 4.2,
    reviews: 128,
    discountPercent:25,
    actualPrice: 1999,
    discountPrice: 1499,
    inStock: 23,
    images: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    about: "Experience immersive sound with these stylish headphones. Designed for comfort and built to last, perfect for music lovers.",
    reviewsList:[
        {name:"Akash",date:"12-3-2023",comment:"Good product",rating:4.2},
        {name:"Priya",date:"15-4-2023",comment:"Loved the sound quality!",rating:5},
        {name:"Rahul",date:"20-5-2023",comment:"Comfortable and stylish.",rating:4},
        {name:"Priya",date:"15-4-2023",comment:"Loved the sound quality!",rating:5},
        {name:"Rahul",date:"20-5-2023",comment:"Comfortable and stylish.",rating:4},
        
    ]
};

function Description({desc}) {
    // cardlist is now an array of objects: [{id, quantity}]
    let { wishlistcount, setwishlistcount, cartCount, setCartCount, wishlist, setWishlist, cardlist, setcardlist } = desc;
    let iswishlisted = wishlist.includes(product.id);
    const [count, setCount] = useState(1);
    const [showWishlistTooltip, setShowWishlistTooltip] = useState(false);
    const tooltipTimeout = useRef(null);

    // Review state
    const [reviews, setReviews] = useState(product.reviewsList || []);
    const [reviewForm, setReviewForm] = useState({
        name: '',
        rating: 0,
        comment: ''
    });
    const [showReviewForm, setShowReviewForm] = useState(false);

    // For "Show More" reviews
    const REVIEWS_PER_PAGE = 3;
    const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);

    const handleShowMoreReviews = () => {
        setVisibleReviews((prev) => Math.min(prev + REVIEWS_PER_PAGE, reviews.length));
    };

    const handleToggleWishlist = (id) => {
        if (wishlist.includes(id)) {
            setwishlistcount(wishlistcount - 1);
            setWishlist(wishlist.filter(item => item !== id));
        } else {
            setwishlistcount(wishlistcount + 1);
            setWishlist([...wishlist, id]);
        }
    };

    // Helper to find item in cardlist by id
    const findCartItemIndex = (id) => cardlist.findIndex(item => item.id === id);

    // Add to cart logic: cardlist is array of {id, quantity}, unique by id, min quantity 1
    const handleAddToCard = (id, qty) => {
        const idx = findCartItemIndex(id);
        if (idx === -1) {
            // Not in cart, add with at least 1 quantity
            const newItem = { id, quantity: Math.max(1, qty) };
            setcardlist([...cardlist, newItem]);
            setCartCount(cartCount + 1);
        }
    };

    const handleWishlistClick = (id) => {
        handleToggleWishlist(id);
        setShowWishlistTooltip(true);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => {
            setShowWishlistTooltip(false);
        }, 500);
    };

    const notify = () => {
        const idx = findCartItemIndex(product.id);
        const isMobile = window.innerWidth <= 640;
        const toastOptions = {
          autoClose: 1000,
          position: "top-right",
          className: isMobile ? "text-xs px-2 py-1 rounded-md" : "",
          style: isMobile
            ? { minWidth: "150px", maxWidth: "60vw", fontSize: "0.85rem", borderRadius: "10px", margin: "0.5rem" }
            : {},
        };
        if (idx !== -1) {
          toast.warning("Item already added", toastOptions);
        } else {
          handleAddToCard(product.id, count);
          toast.success("Item successfully added", toastOptions);
        }
      };

    // Helper to render stars
    const renderStars = (rating, size = "text-yellow-400", clickable = false, onClick = null) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <span
                        key={i}
                        className={size + (clickable ? " cursor-pointer" : "")}
                        onClick={clickable && onClick ? () => onClick(i + 1) : undefined}
                    >
                        <FaStar />
                    </span>
                );
            } else if (i === fullStars && halfStar) {
                stars.push(
                    <span
                        key={i}
                        className={size + " opacity-60" + (clickable ? " cursor-pointer" : "")}
                        onClick={clickable && onClick ? () => onClick(i + 1) : undefined}
                    >
                        <FaStar />
                    </span>
                );
            } else {
                stars.push(
                    <span
                        key={i}
                        className={size + (clickable ? " cursor-pointer" : "")}
                        onClick={clickable && onClick ? () => onClick(i + 1) : undefined}
                    >
                        <FaRegStar />
                    </span>
                );
            }
        }
        return stars;
    };

    // Review form handlers
    const handleReviewInputChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReviewRatingChange = (val) => {
        setReviewForm(prev => ({
            ...prev,
            rating: val
        }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewForm.name.trim() || !reviewForm.comment.trim() || reviewForm.rating === 0) {
            toast.error("Please fill all fields and select a rating.", { autoClose: 1000 });
            return;
        }
        const newReview = {
            name: reviewForm.name,
            date: new Date().toLocaleDateString(),
            comment: reviewForm.comment,
            rating: reviewForm.rating
        };
        setReviews([newReview, ...reviews]);
        setReviewForm({ name: '', rating: 0, comment: '' });
        setShowReviewForm(false);
        setVisibleReviews((prev) => prev + 1); // Show the new review if hidden
        toast.success("Review submitted!", { autoClose: 1200 });
    };

    // Responsive layout: flex-row for md+, column for mobile
    return (
        <div className="bg-[#f5f0f0]">
            <div className="w-full flex flex-col md:flex-row md:gap-8 gap-4 px-1 sm:px-2 md:px-8 py-4 md:py-6 max-w-6xl mx-auto">
                {/* Left: Swiper Image Slider */}
                <div className="w-full md:w-1/2 flex justify-center items-start">
                    <div className="w-full max-w-[420px]">
                        <Swiper
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 2000, disableOnInteraction: false }}
                            loop={true}
                            modules={[Pagination, Autoplay]}
                            className="rounded-xl"
                            style={{
                                width: '100%',
                                height: 'auto',
                                minHeight: 0,
                                maxHeight: 420,
                                background: '#f5f0f0',
                            }}
                        >
                            {product.images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="w-full flex justify-center items-center"
                                        style={{ backgroundColor: '#f5f0f0' }}>
                                        <img
                                            src={img}
                                            alt={`Product ${idx + 1}`}
                                            className="w-full h-[220px] xs:h-[260px] sm:h-[300px] md:h-[340px] object-cover rounded-xl"
                                            style={{
                                                maxHeight: '340px',
                                                minHeight: '180px',
                                                objectFit: 'cover',
                                                borderRadius: '0.75rem',
                                            }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 px-4">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.title}</h1>
                    {/* Brand, Rating, Reviews */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-gray-500 text-base font-medium">Brand: <span className="text-gray-700">{product.brand}</span></span>
                        <div className="flex items-center gap-1 sm:ml-4">
                            {renderStars(
                                reviews.length > 0
                                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
                                    : product.rating
                            )}
                            <span className="ml-2 text-gray-600 text-sm font-medium">
                                {reviews.length > 0
                                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                    : product.rating.toFixed(1)
                                }
                            </span>
                            <span className="ml-2 text-gray-400 text-sm">
                                ({reviews.length > 0 ? reviews.length : product.reviews} reviews)
                            </span>
                        </div>
                    </div>
                    {/* Price Row */}
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-pink-600">₹{product.discountPrice}</span>
                        <span className="text-lg text-gray-400 line-through">₹{product.actualPrice}</span>
                        <span className="text-green-600 font-semibold text-base">
                            {product.discountPercent}% OFF
                        </span>
                    </div>
                    {/* Stock */}
                    <div className="font-semibold text-green-600">
                        <span className="font-medium text-gray-700">Available in stock:</span> {product.inStock} item{product.inStock !== 1 ? 's' : ''}
                    </div>
                    {/* About Product */}
                    <div>
                        <p className="text-gray-600">{product.about}</p>
                    </div>
                    {/* Free Shipping Line */}
                    <div className="bg-green-50 border border-green-200 rounded-md px-2 py-2 text-green-700 font-medium text-sm flex items-center gap-2">
                        <span>🚚</span> Free Shipping (Est. Delivery Time 2-3 Days)
                    </div>
                    {/* Count Box & Add to Cart */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                        {/* Count Box */}
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                                onClick={() => setCount((c) => Math.max(1, c - 1))}
                                disabled={count <= 1}
                                aria-label="Decrease quantity"
                            >-</button>
                            <span className="px-4 py-1 text-base font-medium">{count}</span>
                            <button
                                className="px-3 py-1 text-lg font-bold text-gray-600 hover:bg-gray-100 transition"
                                onClick={() => setCount((c) => c + 1)}
                                aria-label="Increase quantity"
                            >+</button>
                        </div>
                        {/* Add to Cart Button */}
                        <button
                            onClick={notify}
                            className="w-full flex items-center justify-center gap-2 border-[1px] lg:border-2 border-pink-500 text-pink-500 bg-[#f5f0f0] font-medium lg:font-bold rounded-lg py-2 text-base transition-all duration-200 shadow hover:bg-black hover:text-white hover:border-white min-h-[40px]"
                            style={{ minWidth: 150, maxWidth: 220 }}
                        >
                            <FaShoppingCart className="text-lg" />
                            Add to Cart
                        </button>
                        {/* Wishlist Button */}
                        <div className="relative flex items-center gap-2">
                            <span className="font-medium text-gray-700 text-base">Wishlist</span>
                            <IconButton
                                aria-label="wishlist"
                                onClick={() => handleWishlistClick(product.id)}
                                className="bg-white hover:bg-pink-100 z-20 shadow rounded-full p-1 transition group"
                            >
                                {iswishlisted ? (
                                    <FaHeart className="text-pink-600 text-lg" />
                                ) : (
                                    <FaRegHeart className="text-gray-400 text-lg" />
                                )}
                            </IconButton>
                            {/* Show tooltip on click for 0.5 second */}
                            {showWishlistTooltip && (
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-[0.4rem] rounded bg-gray-800 text-white text-xs opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {iswishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="max-w-3xl mx-auto w-full mt-6 px-2 sm:px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                    <button
                        onClick={() => setShowReviewForm((v) => !v)}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
                    >
                        {showReviewForm ? "Cancel" : "Write a Review"}
                    </button>
                </div>
                {/* Review Form */}
                {showReviewForm && (
                    <form
                        onSubmit={handleReviewSubmit}
                        className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm flex flex-col gap-3"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                name="name"
                                value={reviewForm.name}
                                onChange={handleReviewInputChange}
                                placeholder="Your Name"
                                className="border border-gray-300 rounded px-3 py-2 flex-1"
                                required
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-gray-700 font-medium mr-2">Your Rating:</span>
                                {renderStars(
                                    reviewForm.rating,
                                    "text-yellow-400 text-xl",
                                    true,
                                    handleReviewRatingChange
                                )}
                            </div>
                        </div>
                        <textarea
                            name="comment"
                            value={reviewForm.comment}
                            onChange={handleReviewInputChange}
                            placeholder="Write your review..."
                            className="border border-gray-300 rounded px-3 py-2 min-h-[60px] resize-y"
                            required
                        />
                        <button
                            type="submit"
                            className="self-end bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                        >
                            Submit Review
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                <div className="flex flex-col gap-2 lg:gap-4">
                    {reviews.length === 0 ? (
                        <div className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</div>
                    ) : (
                        <>
                            {reviews.slice(0, visibleReviews).map((rev, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-0 lg:gap-2"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-800">{rev.name}</span>
                                            <span className="text-gray-400 text-xs">{rev.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            {renderStars(rev.rating, "text-yellow-400 text-base")}
                                            <span className="ml-2 text-gray-600 text-xs font-medium">{rev.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="text-gray-700">{rev.comment}</div>
                                    </div>
                                </div>
                            ))}
                            {reviews.length > visibleReviews && (
                                <div className="flex justify-center mt-2">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        endIcon={<ExpandMore />}
                                        onClick={handleShowMoreReviews}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            fontWeight: 500,
                                            fontSize: '1rem',
                                            borderColor: '#e91e63',
                                            color: '#e91e63',
                                            '&:hover': {
                                                borderColor: '#ad1457',
                                                backgroundColor: '#fce4ec',
                                            }
                                        }}
                                    >
                                        Show More
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <DefaultProduct product={desc} name="Related Products" category={product.category}/>
            </div>
        </div>
    );
}

export default Description;