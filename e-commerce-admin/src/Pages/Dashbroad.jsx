import React, { useEffect, useState } from 'react'
import Category from './User/Category';
import Products from './Products';
import MyOrder from './User/MyOrder';
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { FaUsers, FaShoppingBag, FaBoxOpen, FaListAlt } from "react-icons/fa";
import admin from '../assets/admin.png';
import API_BASE from '../utils/API_BASE';

function Dashbroad({auth}) {
    const [loading, setLoading] = useState(true);
    const [orderCount, setOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        // Fetch all stats in parallel and ensure response is parsed as JSON using const data = await res.json();
        Promise.all([
            fetch(`${API_BASE}/admin/get-orders`, { credentials: 'include' }).then(async res => { const data = await res.json(); return data; }),
            fetch(`${API_BASE}/admin/get-products`, { credentials: 'include' }).then(async res => { const data = await res.json(); return data; }),
            fetch(`${API_BASE}/admin/get-categories`, { credentials: 'include' }).then(async res => { const data = await res.json(); return data; }),
            // fetch(`${API_BASE}/admin/get-users`, { credentials: 'include' }).then(async res => { const data = await res.json(); return data; }),
        ]).then(([ordersRes, productsRes, categoriesRes]) => {
            // All responses are now JSON objects
            setOrderCount(Array.isArray(ordersRes.orders) ? ordersRes.orders.length : 0);
            setProductCount(Array.isArray(productsRes.data) ? productsRes.data.length : 0);
            setCategoryCount(Array.isArray(categoriesRes.data) ? categoriesRes.data.length : 0);
            // setUserCount(Array.isArray(usersRes.data) ? usersRes.data.length : 0);
            setUserCount(10);
        }).finally(() => setLoading(false));
    }, []);

    const stats = [
        { title: "Total Users", value: userCount, color: "#16a34a", icon: <FaUsers size={28} /> },
        { title: "Total Orders", value: orderCount, color: "#2563eb", icon: <FaShoppingBag size={28} /> },
        { title: "Total Products", value: productCount, color: "#7c3aed", icon: <FaBoxOpen size={28} /> },
        { title: "Total Category", value: categoryCount, color: "#dc2626", icon: <FaListAlt size={28} /> },
    ];

    return (
        <div>
            <Box p={3}>
                {/* Welcome Section */}
                <Card
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 3,
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                    }}
                >
                    <Box flex={1}>
                        <Typography variant="h4" fontWeight="bold">
                            Welcome,
                        </Typography>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {auth.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Here’s what happening on your store today. See the statistics at once.
                        </Typography>
                    </Box>
                    {/* Hide admin image on small screens */}
                    <Box
                        component="img"
                        src={admin}
                        alt="store"
                        sx={{
                            width: 200,
                            height: "auto",
                            display: { xs: "none", md: "block" }
                        }}
                    />
                </Card>

                {/* Stats Section */}
                <Box
                    mt={2}
                    sx={{
                        display: "flex",
                        flexWrap: "nowrap",
                        overflowX: "auto",
                        gap: 3,
                        pb: 1,
                    }}
                >
                    {loading ? (
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        stats.map((stat, index) => (
                            <Card
                                key={index}
                                sx={{
                                    minWidth: 220,
                                    flex: "0 0 auto",
                                    bgcolor: stat.color,
                                    color: "white",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    mr: 0,
                                }}
                            >
                                <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box>
                                        <Typography variant="subtitle1">{stat.title}</Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {stat.value}
                                        </Typography>
                                    </Box>
                                    {stat.icon}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </Box>
            <Category />
            <Products />
            <MyOrder />
        </div>
    )
}

export default Dashbroad;