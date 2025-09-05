import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, MenuItem, Select, TextField, InputAdornment } from '@mui/material';
import { MdReceipt, MdLocalShipping, MdCheckCircle, MdCancel, MdSearch } from "react-icons/md";
import notify from '../../components/Notification/notify';
import API_BASE from '../../utils/API_BASE';

// Helper to render status chip
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

const statusOptions = [
  { value: 'Delivered', label: 'Delivered', icon: <MdCheckCircle style={{ color: "#16a34a" }} /> },
  { value: 'Shipped', label: 'Shipped', icon: <MdLocalShipping style={{ color: "#f59e42" }} /> },
  { value: 'Cancelled', label: 'Cancelled', icon: <MdCancel style={{ color: "#ef4444" }} /> },
];

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/get-orders`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          // Sort orders by updatedAt ascending (oldest first)
          const sortedOrders = [...data.orders].sort((a, b) => {
            const dateA = new Date(a.updatedAt);
            const dateB = new Date(b.updatedAt);
            return dateA - dateB;
          });
          // Normalize order fields for UI
          setOrders(
            sortedOrders.map(order => ({
              id: order._id || order.id,
              date: order.createdAt ? order.createdAt.slice(0, 10) : '',
              status: order.status,
              total: order.total,
              items: order.items || [],
            }))
          );
        } else {
          setOrders([]);
          notify("error", "Fetch failed");
        }
      } catch (err) {
        setOrders([]);
        notify("error", "Network Error");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Change order status API
  const handleStatusChange = async (orderId, newStatus) => {
    const prevOrders = [...orders];
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    try {
      const res = await fetch(`${API_BASE}/admin/change-order-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        setOrders(prevOrders); // revert
        notify("error", data.message);
      } else {
        notify("success", "Status updated");
      }
    } catch (err) {
      setOrders(prevOrders); // revert
      notify("error", "Network Error");
    }
  };

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
                  <TableCell
                    className="font-bold"
                    style={{
                      fontWeight: 'bold',
                      border: '1px solid #d1d5db',
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-8 text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-8 text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>{order.id}</TableCell>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>{order.date}</TableCell>
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>
                        <ul className="list-disc pl-4">
                          {(order.items || []).map((item, idx) => (
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
                      <TableCell style={{ border: '1px solid #e5e7eb' }}>
                        <Select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          size="small"
                          variant="outlined"
                          style={{ minWidth: 120, marginRight: 8 }}
                        >
                          {statusOptions.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <span className="flex items-center gap-2">
                                {opt.icon}
                                {opt.label}
                              </span>
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
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