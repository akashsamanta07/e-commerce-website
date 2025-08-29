import React, { useState } from 'react';
import s1 from '../../assets/menu/fashion.png';
import s2 from '../../assets/menu/electronics.png';
import s3 from '../../assets/menu/bags.png';
import s4 from '../../assets/menu/footwear.png';
import s5 from '../../assets/menu/groceries.png';
import s6 from '../../assets/menu/beauty.png';
import s7 from '../../assets/menu/wellness.png';
import s8 from '../../assets/menu/jewellery.png';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import notify from '../../components/Notification/notify';

const initialCategories = [
  { id: 1, name: 'Fashion', image: s1 },
  { id: 2, name: 'Electronics', image: s2 },
  { id: 3, name: 'Bags', image: s3 },
  { id: 4, name: 'Footwear', image: s4 },
  { id: 5, name: 'Groceries', image: s5 },
  { id: 6, name: 'Beauty', image: s6 },
  { id: 7, name: 'Wellness', image: s7 },
  { id: 8, name: 'Jewellery', image: s8 },
];

function Category() {
  const [categories, setCategories] = useState(initialCategories);

  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPreview, setAddPreview] = useState('');

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPreview, setEditPreview] = useState('');

  const handleAddCategory = () => {
    setAddName('');
    setAddPreview('');
    setAddOpen(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addName && addPreview) {
      const newCategory = {
        id: Date.now(),
        name: addName,
        image: addPreview
      };
      setCategories([...categories, newCategory]);
      setAddOpen(false);
      setAddName('');
      setAddPreview('');
      notify("success","Category Upload Successfully");
    }
  };

  const handleEdit = (id) => {
    const category = categories.find(c => c.id === id);
    setEditId(id);
    setEditName(category.name);
    setEditPreview(category.image);
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCategories(categories.map(c =>
      c.id === editId
        ? { ...c, name: editName, image: editPreview }
        : c
    ));
    setEditOpen(false);
    setEditId(null);
    setEditName('');
    setEditPreview('');
    notify("success","Category Update Successfully");
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    notify("warning","Category Remove Successfully");
  };

  const tableContainerSx = {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    bgcolor: '#f3f4f6',
    ...(categories.length > 4
      ? { maxHeight: '60vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <Box sx={{ m: 2, p: 1, bgcolor: '#fff' }}>
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
          sx={{ color: '#ec4899', mb: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}
        >
          Category List
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
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                  />
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db', fontWeight: 500 }}>
                  {category.name}
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <IconButton color="primary" onClick={() => handleEdit(category.id)}>
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(category.id)}>
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent>
            <TextField
              label="Category Name"
              value={addName}
              onChange={e => setAddName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAdd />}
              sx={{
                bgcolor: '#db2777',
                '&:hover': { bgcolor: 'black' },
                textTransform: 'none',
                fontWeight: 500,
                mb: 2
              }}
              fullWidth
            >
              Select Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAddImageChange}
                required
              />
            </Button>
            {addPreview && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={addPreview}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!addName || !addPreview}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <TextField
              label="Category Name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAdd />}
              sx={{
                bgcolor: '#db2777',
                '&:hover': { bgcolor: 'black' },
                textTransform: 'none',
                fontWeight: 500,
                mb: 2
              }}
              fullWidth
            >
              Change Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleEditImageChange}
              />
            </Button>
            {editPreview && (
              <Box mt={2} display="flex" justifyContent="center">
                <img
                  src={editPreview}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!editName || !editPreview}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Category;