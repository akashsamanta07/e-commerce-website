import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress
} from '@mui/material';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import notify from '../../components/Notification/notify';
import getImageUrl from '../../components/getImageUrl.js';

import API_BASE from '../../utils/API_BASE';

function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Category Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState('');

  // Edit Category Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/get-categories`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        // Sort categories by updatedAt ascending (oldest first)
        const sortedCategories = Array.isArray(data.data)
          ? [...data.data].sort((a, b) => {
              const dateA = new Date(a.updatedAt);
              const dateB = new Date(b.updatedAt);
              return dateA - dateB;
            })
          : [];
        setCategories(sortedCategories);
      } else {
        setCategories([]);
        notify("warning", "No Data");
      }
    } catch (err) {
      notify("error", "Fetch fail");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add Category
  const handleAddCategory = () => {
    setAddName('');
    setAddImage(null);
    setAddPreview('');
    setAddOpen(true);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImage(file);
      setAddPreview(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addName || !addImage) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', addName);
      formData.append('photo', addImage);

      const res = await fetch(`${API_BASE}/admin/add-category`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Category Upload Successfully");
        setAddOpen(false);
        setAddName('');
        setAddImage(null);
        setAddPreview('');
        fetchCategories();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // Handle Edit Category
  const handleEdit = (id) => {
    const category = categories.find(c => c._id === id);
    setEditId(id);
    setEditName(category?.name || '');
    setEditImage(null);
    setEditPreview(category ? getImageUrl(category.image) : '');
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editName);
      if (editImage) {
        formData.append('photo', editImage);
      }
      const res = await fetch(`${API_BASE}/admin/edit-category/${editId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Category Update Successfully");
        setEditOpen(false);
        setEditId(null);
        setEditName('');
        setEditImage(null);
        setEditPreview('');
        fetchCategories();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/delete-category/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        notify("success", "Category Remove Successfully");
        fetchCategories();
      } else {
        notify("error", data.message);
      }
    } catch (err) {
      notify("error", "Network Error");
    }
    setLoading(false);
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress size={32} />
          </Box>
        ) : (
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
                <TableRow key={category._id}>
                  <TableCell sx={{ border: '1px solid #d1d5db' }}>
                    {category.image ? (
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                          background: '#f3f4f6',
                          border: '1px solid #e5e7eb',
                          color: '#aaa',
                          fontSize: 14
                        }}
                      >
                        No Image
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #d1d5db', fontWeight: 500 }}>
                    {category.name}
                  </TableCell>
                  <TableCell sx={{ border: '1px solid #d1d5db' }}>
                    <IconButton color="primary" onClick={() => handleEdit(category._id)}>
                      <MdEdit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(category._id)}>
                      <MdDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Add Category Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <form onSubmit={handleAddSubmit} encType="multipart/form-data">
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
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!addName || !addPreview || loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <form onSubmit={handleEditSubmit} encType="multipart/form-data">
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
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!editName || !editPreview || loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Category;