import React, { useState } from 'react';
import s0 from '../assets/slider/s0.png';
import s1 from '../assets/slider/s1.jpg';
import s2 from '../assets/slider/s2.jpg';
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
  DialogActions
} from '@mui/material';
import { MdEdit, MdDelete, MdAddPhotoAlternate } from 'react-icons/md';
import notify from '../components/Notification/notify';

const initialSliders = [
  { id: 1, image: s0 },
  { id: 2, image: s1 },
  { id: 3, image: s2 }
];

function HomeSlider() {
  const [sliders, setSliders] = useState(initialSliders);

  // Add Slider Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [addImage, setAddImage] = useState(null);
  const [addPreview, setAddPreview] = useState('');

  // Edit Slider Dialog State
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');

  // Handle Add Slider
  const handleAddSlider = () => {
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

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (addImage) {
      const newSlider = {
        id: Date.now(),
        image: addPreview
      };
      setSliders([...sliders, newSlider]);
      setAddOpen(false);
      setAddImage(null);
      setAddPreview('');
      notify("success","Image Upload Successfully");
    }
  };

  // Handle Edit Slider
  const handleEdit = (id) => {
    const slider = sliders.find(s => s.id === id);
    setEditId(id);
    setEditImage(null);
    setEditPreview(slider.image);
    setEditOpen(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSliders(sliders.map(s =>
      s.id === editId
        ? { ...s, image: editPreview }
        : s
    ));
    setEditOpen(false);
    setEditId(null);
    setEditImage(null);
    setEditPreview('');
    notify("success","Image Update Successfully");
  };

  // Handle Delete
  const handleDelete = (id) => {
    setSliders(sliders.filter(s => s.id !== id));
    notify("warning","Image Remove Successfully")
  };

  // TableContainer style: if more than 4 sliders, set maxHeight and overflowY
  const tableContainerSx = {
    borderRadius: 2,
    border: '1px solid #e5e7eb',
    bgcolor: '#f3f4f6',
    ...(sliders.length > 4
      ? { maxHeight: '60vh', overflowY: 'auto', display: 'block' }
      : {})
  };

  return (
    <Box sx={{ m: 2,p:1, bgcolor: '#fff' }}>
      {/* Top Section: Slider List title and Add Slider button */}
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
          color="secondary"
          sx={{ color: '#ec4899', mb: { xs: 1, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}
        >
          Home Slider List
        </Typography>
        <Button
          variant="contained"
          startIcon={<MdAddPhotoAlternate />}
          sx={{
            bgcolor: '#db2777',
            '&:hover': { bgcolor: 'black' },
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 160,
          }}
          onClick={handleAddSlider}
        >
          Add Slider
        </Button>
      </Box>

      {/* Table Section: Only show images in table */}
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold', border: '1px solid #d1d5db' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sliders.map(slider => (
              <TableRow key={slider.id}>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <img
                    src={slider.image}
                    alt={`Slider ${slider.id}`}
                    style={{ width: 200, height: 80, objectFit: 'cover', borderRadius: 8, background: '#fff' }}
                  />
                </TableCell>
                <TableCell sx={{ border: '1px solid #d1d5db' }}>
                  <IconButton color="primary" onClick={() => handleEdit(slider.id)}>
                    <MdEdit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(slider.id)}>
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sliders.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No sliders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Slider Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Slider</DialogTitle>
        <form onSubmit={handleAddSubmit}>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAddPhotoAlternate />}
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
                  style={{ width: 300, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!addPreview}>
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Slider Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Slider</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Button
              variant="contained"
              component="label"
              startIcon={<MdAddPhotoAlternate />}
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
                  style={{ width: 300, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={!editPreview}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default HomeSlider;