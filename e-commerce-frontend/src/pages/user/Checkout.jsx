import React, { useContext, useState } from "react";
import { GlobalContext } from "../../components/UserContext/UserContext";
import { FaUser, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCreditCard } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stepper, Step, StepLabel, Paper } from "@mui/material";

const steps = ["Personal Info", "Delivery Info", "Payment"];

function Checkout() {
  const { total } = useContext(GlobalContext);

  // Stepper state
  const [activeStep, setActiveStep] = useState(0);

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Delivery Info
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  // Payment Info
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  // Handle changes
  const handlePersonalChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };
  const handleDeliveryChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };
  const handleCardChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  // Stepper navigation
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Dummy submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle the order placement logic
    alert("Order placed successfully!");
  };

  // Responsive container
  return (
    <div className="my-8 mx-5 #f5f0f0 flex items-center justify-center">
      <Paper elevation={4} className=" p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-2">
          <MdPayment className="text-pink-500" size={32} />
          Checkout
        </h2>
        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <span className="font-semibold">{label}</span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaUser />
                Personal Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Full Name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaUser className="mr-2 text-pink-400" />,
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaEnvelope className="mr-2 text-pink-400" />,
                  }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={handlePersonalChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: <FaPhoneAlt className="mr-2 text-pink-400" />,
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={
                    !personalInfo.name || !personalInfo.email || !personalInfo.phone
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaMapMarkerAlt />
                Delivery Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="City"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="State"
                  name="state"
                  value={deliveryInfo.state}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
                <TextField
                  label="ZIP Code"
                  name="zip"
                  value={deliveryInfo.zip}
                  onChange={handleDeliveryChange}
                  required
                  fullWidth
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleBack}
                  className="border-pink-600 text-pink-600"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  className="bg-pink-600 hover:bg-pink-700"
                  disabled={
                    !deliveryInfo.address ||
                    !deliveryInfo.city ||
                    !deliveryInfo.state ||
                    !deliveryInfo.zip
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-pink-600 text-lg font-semibold mb-2">
                <FaCreditCard />
                Payment
              </div>
              <FormControl component="fieldset" className="mb-4">
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                  row
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio color="secondary" />}
                    label="Credit/Debit Card"
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio color="secondary" />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
              {paymentMethod === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Card Number"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Name on Card"
                    name="nameOnCard"
                    value={cardInfo.nameOnCard}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Expiry (MM/YY)"
                    name="expiry"
                    value={cardInfo.expiry}
                    onChange={handleCardChange}
                    required
                    fullWidth
                  />
                  <TextField
                    label="CVV"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardChange}
                    required
                    fullWidth
                    type="password"
                  />
                </div>
              )}
              <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mt-6">
                <div className="text-lg font-bold text-pink-700">
                  Total: <span className="text-black">₹{total}/-</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleBack}
                    className="border-pink-600 text-pink-600"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700"
                    disabled={
                      paymentMethod === "card" &&
                      (!cardInfo.cardNumber ||
                        !cardInfo.expiry ||
                        !cardInfo.cvv ||
                        !cardInfo.nameOnCard)
                    }
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
}

export default Checkout;