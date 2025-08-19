import React, { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";

function Address() {
  const [addressInfo, setAddressInfo] = useState({
    address: "Basantabati",
    city: "Arambagh",
    state: "hooghly",
    zip: "712617",
  });

  const handleChange = (e) => {
    setAddressInfo({
      ...addressInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would save the address to backend or context
    alert(
      `Address Saved!\nAddress: ${addressInfo.address}\nCity: ${addressInfo.city}\nState: ${addressInfo.state}\nZip: ${addressInfo.zip}`
    );
  };

  return (
    <div className="my-8 mx-5 flex items-center justify-center">
      <Paper elevation={4} className="p-6 rounded-lg shadow-lg bg-white w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Address Details</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <TextField
            label="Address"
            name="address"
            value={addressInfo.address}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={addressInfo.city}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="State"
            name="state"
            value={addressInfo.state}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Zip Code"
            name="zip"
            value={addressInfo.zip}
            onChange={handleChange}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            className="!bg-pink-600 hover:!bg-black !text-white !font-semibold !rounded-md"
            fullWidth
          >
            Save Address
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default Address;
