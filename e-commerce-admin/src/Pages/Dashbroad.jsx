import React from 'react'
import Category from './User/Category';
import Products from './Products';
import MyOrder from './User/MyOrder';
import { Card, CardContent, Typography, Box } from "@mui/material";
import { FaUsers, FaShoppingBag, FaBoxOpen, FaListAlt } from "react-icons/fa";
import admin from '../assets/admin.png';

function Dashbroad() {
    const stats = [
        { title: "Total Users", value: 2865, color: "#16a34a", icon: <FaUsers size={28} /> },
        { title: "Total Orders", value: 723, color: "#2563eb", icon: <FaShoppingBag size={28} /> },
        { title: "Total Products", value: 50, color: "#7c3aed", icon: <FaBoxOpen size={28} /> },
        { title: "Total Category", value: 8, color: "#dc2626", icon: <FaListAlt size={28} /> },
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
                            a
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
                    {stats.map((stat, index) => (
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
                    ))}
                </Box>
            </Box>
            <Category />
            <Products />
            <MyOrder />
        </div>
    )
}

export default Dashbroad;