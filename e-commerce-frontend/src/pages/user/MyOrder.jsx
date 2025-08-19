import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, MenuItem, Select } from '@mui/material';
import { MdReceipt, MdLocalShipping, MdCheckCircle, MdCancel } from "react-icons/md";

// Dummy order data for demonstration
const initialOrders = [
  {
    id: 'ORD123456',
    date: '2024-06-01',
    status: 'Delivered',
    total: 1299,
    items: [
      { title: 'Wireless Headphones rwtwtwtwtwtwtwtwtwtwtwtre', qty: 1, price: 999 },
      { title: 'USB-C Cable', qty: 2, price: 150 }
    ]
  },
  {
    id: 'ORD123457',
    date: '2024-05-28',
    status: 'Shipped',
    total: 499,
    items: [
      { title: 'Bluetooth Mouse drswyre ersy tryesysw', qty: 1, price: 499 }
    ]
  },
  {
    id: 'ORD123458',
    date: '2024-05-20',
    status: 'Cancelled',
    total: 799,
    items: [
      { title: 'Smart Watch', qty: 1, price: 799 }
    ]
  }
];

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
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className='mx-5 my-8 #f5f0f0'>
      <div className="bg-white p-3 rounded">
        <h2 className="text-2xl font-bold mb-4 flex justify-center items-center gap-2 text-pink-600">
          <MdReceipt className="!text-pink-600" /> My Orders
        </h2>
        <div className="overflow-x-auto">
          <TableContainer
            component={Paper}
            className="min-w-[600px]"
            style={{
              border: '1px solid #e5e7eb', // Tailwind gray-200
              backgroundColor: '#f3f4f6', // Tailwind gray-100
            }}
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
                    Total (₹)
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
                {orders.map(order => (
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
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-8 text-gray-500" style={{ border: '1px solid #e5e7eb' }}>
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