import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { MdReceipt, MdLocalShipping, MdCheckCircle, MdCancel, MdSearch } from "react-icons/md";
import API_BASE from '../../utils/API_BASE';

function getStatusChip(status) {
  switch (status) {
    case 'Delivered':
      return <Chip icon={<MdCheckCircle style={{ color: "#16a34a" }} />} label="Delivered" color="success" variant="outlined" />;
    case 'Shipped':
      return <Chip icon={<MdLocalShipping style={{ color: "#f59e42" }} />} label="Shipped" color="warning" variant="outlined" />;
    case 'Cancelled':
      return <Chip icon={<MdCancel style={{ color: "#ef4444" }} />} label="Cancelled" color="error" variant="outlined" />;
    default:
      return <Chip icon={<MdReceipt />} label={status} variant="outlined" />;
  }
}

function MyOrder({ auth }) {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch orders for the logged-in user using auth._id
    async function fetchOrders() {
      if (!auth || !auth._id) return;
      setLoading(true);
      try {
        // You may need to adjust the endpoint according to your backend API
        // Example: GET /api/user/:userId/orders
        const res = await fetch(`${API_BASE}/user/${auth._id}/orders`, {
          headers: {
            'Content-Type': 'application/json',
            // If you use JWT, you may need to add Authorization header here
            // 'Authorization': `Bearer ${auth.token}`,
          },
          credentials: 'include', // if your backend uses cookies for auth
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          // Normalize order data to match the table structure
          setOrders(
            data.orders.map(order => ({
              id:order._id,
              date: order.createdAt ? order.createdAt.slice(0, 10) : '',
              status: order.status,
              total: order.total || 0,
              items: Array.isArray(order.items)
                ? order.items.map(item => ({
                    title: item.title ,
                    qty: item.qty || 1,
                    price: item.price ||0,
                  }))
                : [],
            }))
          );
        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [auth]);

  // Filter orders by order id only
  const filteredOrders = orders.filter(order => {
    const searchLower = search.trim().toLowerCase();
    if (searchLower === '') return true;
    return (order.id || '').toLowerCase().includes(searchLower);
  });

  // Determine if we need to set a max height and scroll for the table container
  const tableContainerStyle = {
    border: '1px solid #e5e7eb', // Tailwind gray-200
    backgroundColor: '#f3f4f6', // Tailwind gray-100
    ...(filteredOrders.length > 4
      ? { maxHeight: '50vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <div className='mx-5 my-8'>
      <div className="bg-white p-3 rounded">
        <h2 className="text-[1.7rem] font-bold mb-4 flex justify-center items-center gap-2 text-pink-600">
          <MdReceipt className="!text-pink-600" /> All Orders
        </h2>
        <div className="flex justify-center mb-4">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by Order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch className="text-gray-400" />
                </InputAdornment>
              ),
              style: { background: "#f3f4f6", borderRadius: 6 }
            }}
            sx={{ minWidth: 260 }}
          />
        </div>
        <div className="overflow-x-auto">
          <TableContainer
            component={Paper}
            className="min-w-[600px]"
            style={tableContainerStyle}
          >
            <Table>
              <TableHead>
                <TableRow
                  style={{
                    backgroundColor: '#e5e7eb', // Tailwind gray-200
                  }}
                >
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db', // Tailwind gray-300
                    }}
                  >
                    Order ID
                  </TableCell>
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    Items
                  </TableCell>
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    Total(₹)
                  </TableCell>
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" className="py-8 text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>{order.id}</TableCell>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>{order.date}</TableCell>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>
                        <ul className="list-disc pl-4">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              <span
                                className="font-medium inline-block max-w-[160px] align-middle"
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  verticalAlign: 'middle'
                                }}
                                title={item.title}
                              >
                                {item.title}
                              </span>
                              {' '}( x{item.qty}, <span className="text-gray-500">₹{item.price} )</span>
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="font-semibold text-pink-600" style={{ border: '1px solid #e5e7eb' }}>
                        ₹{order.total}
                      </TableCell>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>{getStatusChip(order.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" className="py-8 text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default MyOrder;