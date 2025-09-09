import React, { useState, useRef, useContext, useEffect } from 'react';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { IconButton, Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import './swiper.css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import DefaultProduct from '../components/DefaultProduct';
import { GlobalContext } from "../components/UserContext/UserContext";
import getImageUrl from '../components/getImageUrl';
import API_BASE from '../utils/API_BASE';
import notify from '../components/Notification/notify';
import {
    toggleWishlist,
    addToCart
  } from '../components/HandleWishlistandCartlist';

// --- API Calls ---
async function fetchProductReviews(productId) {
    try {
        const res = await fetch(`${API_BASE}/user/reviews/${productId}`, {
            credentials: "include"
        });
        if (!res.ok) throw new Error('Failed to fetch reviews');
        return await res.json();
    } catch (err) {
        notify("error", "Network Error");
        return [];
    }
}

async function submitProductReview(productId, review) {
    try {
        const res = await fetch(`${API_BASE}/user/review/${productId}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review),
            credentials: "include"
        });
        const data = await res.json();
        if (!res.ok) {
            notify("error", data?.message || "Failed to submit review.");
            return;
        }
        return data.review;
    } catch (err) {
        notify("error", "Network error.");
    }
}

// --- Helper: Format date to only date part (YYYY-MM-DD) ---
function getDatePart(dateString) {
    if (!dateString) return '';
    // Try to parse as ISO or Date
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; // fallback to original if invalid
    return d.toISOString().slice(0, 10);
}

// --- Main Component ---
function Description({ desc }) {
    // --- Context and Props ---
    const { current } = useContext(GlobalContext);
    const product = current;
    let { wishlist, setWishlist, cartlist, setCartlist } = desc;

    // --- State ---
    const [count, setCount] = useState(1);
    const [showWishlistTooltip, setShowWishlistTooltip] = useState(false);
    const tooltipTimeout = useRef(null);

    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);

    const REVIEWS_PER_PAGE = 3;
    const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);

    // --- Derived ---
    // Wishlist and cartlist now store only mentioned details: _id, title, first image, discountPrice, quantity (for cart)
    const isWishlisted = wishlist && product._id
        ? wishlist.some(item => item._id === product._id)
        : false;

    const isInCart = cartlist && product._id
        ? cartlist.some(item => item._id === product._id)
        : false;

    // --- Effects ---
    useEffect(() => {
        let ignore = false;
        async function loadReviews() {
            if (!product._id) return;
            setLoadingReviews(true);
            const apiReviews = await fetchProductReviews(product._id);
            if (!ignore) {
                setReviews(Array.isArray(apiReviews.reviews) ? apiReviews.reviews : []);
                setVisibleReviews(REVIEWS_PER_PAGE);
            }
            setLoadingReviews(false);
        }
        loadReviews();
        return () => { ignore = true; };
        // eslint-disable-next-line
    }, [product._id]);

    // --- Handlers ---
    const handleShowMoreReviews = () => {
        setVisibleReviews((prev) => Math.min(prev + REVIEWS_PER_PAGE, reviews.length));
    };

    const handleToggleWishlist = () => {
        toggleWishlist(wishlist, setWishlist, product);
      };


    const handleAddToCart = (quantity) => {
        addToCart(cartlist, setCartlist, product,quantity);
    };

    const handleWishlistClick = () => {
        handleToggleWishlist();
        setShowWishlistTooltip(true);
        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = setTimeout(() => {
            setShowWishlistTooltip(false);
        }, 500);
    };

    const handleAddToCartNotify = () => {
        if (product.inStock < count) {
            notify("error", "Not enough stock available");
            return;
        }
        handleAddToCart(count);
    };

    // --- Star Rendering ---
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

    // --- Review Form Handlers ---
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.name.trim() || !reviewForm.comment.trim() || reviewForm.rating === 0) {
            notify("error", "Please fill all fields and select a rating.");
            return;
        }
        if (!product._id) {
            notify("error", "Product not found.");
            return;
        }
        setSubmittingReview(true);
        try {
            const newReview = {
                name: reviewForm.name,
                comment: reviewForm.comment,
                rating: reviewForm.rating
            };
            const savedReview = await submitProductReview(product._id, newReview);
            if(savedReview){
                setReviews([savedReview, ...reviews]);
                setReviewForm({ name: '', rating: 0, comment: '' });
                setShowReviewForm(false);
                setVisibleReviews((prev) => prev + 1);
                notify("success", "Review submitted");
            }
        } catch (err) {
        }
        setSubmittingReview(false);
    };

    // --- Discount Calculation ---
    const getDiscountPercent = () => {
        if (product.originalPrice && product.discountPrice) {
            return Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100);
        }
        return 0;
    };

    // --- Helpers for safe review rating calculation ---
    // Only use reviews that have a valid numeric rating
    const getValidReviewRatings = (reviewsArr) => {
        if (!Array.isArray(reviewsArr)) return [];
        return reviewsArr
            .filter(r => r && typeof r.rating !== "undefined" && r.rating !== null && !isNaN(Number(r.rating)))
            .map(r => Number(r.rating));
    };

    const getAverageReviewRating = (reviewsArr) => {
        const ratings = getValidReviewRatings(reviewsArr);
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, val) => acc + val, 0);
        return sum / ratings.length;
    };

    // --- Render ---
    return (
        <div className="bg-[#f5f0f0]">
            <div className="w-full flex flex-col md:flex-row md:gap-8 gap-4 px-1 sm:px-2 md:px-8 py-4 md:py-6 max-w-6xl mx-auto">
                {/* Left: Swiper Image Slider */}
                <div className="w-80% md:w-1/2 flex justify-center items-start">
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
                                background: '#f5f0f0',
                            }}
                        >
                            {(product.images || []).map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="w-full" style={{ backgroundColor: '#f5f0f0' }}>
                                        <img
                                            src={getImageUrl(img)}
                                            alt={`Product ${idx + 1}`}
                                            className="rounded-xl object-cover"
                                            style={{
                                                minHeight: '200px',
                                                borderRadius: '0.75rem',
                                                objectPosition: 'top center',
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
                        <span className="text-gray-500 text-base font-medium">
                            Brand: <span className="text-gray-700">{product.brand}</span>
                        </span>
                        <div className="flex items-center gap-1 sm:ml-4">
                            {renderStars(
                                getValidReviewRatings(reviews).length > 0
                                    ? getAverageReviewRating(reviews)
                                    : (product.rating || 0)
                            )}
                            <span className="ml-2 text-gray-600 text-sm font-medium">
                                {getValidReviewRatings(reviews).length > 0
                                    ? getAverageReviewRating(reviews).toFixed(1)
                                    : (product.rating ? product.rating.toFixed(1) : "0.0")
                                }
                            </span>
                            <span className="ml-2 text-gray-400 text-sm">
                                ({getValidReviewRatings(reviews).length > 0 ? getValidReviewRatings(reviews).length : 0} reviews)
                            </span>
                        </div>
                    </div>
                    {/* Price Row */}
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-pink-600">₹{product.discountPrice}</span>
                        <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                        <span className="text-green-600 font-semibold text-base">
                            {getDiscountPercent()}% OFF
                        </span>
                    </div>
                    {/* Stock */}
                    <div className="font-semibold text-green-600">
                        <span className="font-medium text-gray-700">Available in stock:</span> {product.inStock} item{product.inStock !== 1 ? 's' : ''}
                    </div>
                    {/* About Product */}
                    <div>
                        <p className="text-gray-600">{product.description}</p>
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
                            onClick={handleAddToCartNotify}
                            className="w-full flex items-center justify-center gap-2 border-[1px] lg:border-2 border-pink-500 text-pink-500 bg-[#f5f0f0] font-medium lg:font-bold rounded-lg py-2 text-base transition-all duration-200 shadow hover:bg-black hover:text-white hover:border-white min-h-[40px]"
                            style={{ minWidth: 150, maxWidth: 220 }}
                        >
                            <FaShoppingCart className="text-lg" />
                            {isInCart ? "Update Cart" : "Add to Cart"}
                        </button>
                        {/* Wishlist Button */}
                        <div className="relative flex items-center gap-2">
                            <span className="font-medium text-gray-700 text-base">Wishlist</span>
                            <IconButton
                                aria-label="wishlist"
                                onClick={handleWishlistClick}
                                className="bg-white hover:bg-pink-100 z-20 shadow rounded-full p-1 transition group"
                            >
                                {isWishlisted ? (
                                    <FaHeart className="text-pink-600 text-lg" />
                                ) : (
                                    <FaRegHeart className="text-gray-400 text-lg" />
                                )}
                            </IconButton>
                            {/* Show tooltip on click for 0.5 second */}
                            {showWishlistTooltip && (
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-[0.4rem] rounded bg-gray-800 text-white text-xs opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                                disabled={submittingReview}
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
                            disabled={submittingReview}
                        />
                        <button
                            type="submit"
                            className="self-end bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                            disabled={submittingReview}
                        >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}

                {/* Reviews List */}
                <div className="flex flex-col gap-2 lg:gap-4">
                    {loadingReviews ? (
                        <div className="text-gray-500 text-center py-6">Loading reviews...</div>
                    ) : getValidReviewRatings(reviews).length === 0 ? (
                        <div className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</div>
                    ) : (
                        <>
                            {reviews.slice(0, visibleReviews).map((rev, idx) => {
                                // Defensive: skip reviews with no valid rating or missing fields
                                if (!rev || typeof rev.rating === "undefined" || rev.rating === null || isNaN(Number(rev.rating))) return null;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-0 lg:gap-2"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-800">{rev.name}</span>
                                                <span className="text-gray-400 text-xs">
                                                    {getDatePart(rev.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                {renderStars(Number(rev.rating), "text-yellow-400 text-base")}
                                                <span className="ml-2 text-gray-600 text-xs font-medium">{Number(rev.rating).toFixed(1)}</span>
                                            </div>
                                            <div className="text-gray-700">{rev.comment}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {getValidReviewRatings(reviews).length > visibleReviews && (
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
                <DefaultProduct product={desc} name="Related Products" category={product.category } />
            </div>
        </div>
    );
}

export default Description;