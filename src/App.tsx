import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import dayjs, { Dayjs } from "dayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./App.css";

function App() {
  const [cartValue, setCartValue] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [itemAmount, setItemAmount] = useState(0);
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs("2022-04-17"));

  const calculateDeliveryPrice = () => {
    let cartSurcharge = 0;
    if (cartValue <= 10) {
      cartSurcharge = 10 - cartValue;
    }
    const deliveryFee = Math.ceil(deliveryDistance / 500) * 1;
    let itemSurcharge = 0;
    if (itemAmount > 4) {
      itemSurcharge = (itemAmount - 4) * 0.5;
    }
    if (itemAmount > 12) {
      itemSurcharge += 1.2;
    }
    let initialDeliveryPrice = cartSurcharge + deliveryFee + itemSurcharge;
    if (
      dateTime != null &&
      dateTime.day() === 5 &&
      dateTime.hour() >= 15 &&
      dateTime.hour() <= 19
    ) {
      initialDeliveryPrice = initialDeliveryPrice * 1.2;
    }
    adjustDeliveryPrice(initialDeliveryPrice);
  };

  const adjustDeliveryPrice = (initialDeliveryPrice: number) => {
    if (initialDeliveryPrice > 15) {
      setDeliveryPrice(15);
    } else if (cartValue >= 200) {
      setDeliveryPrice(0);
    } else {
      setDeliveryPrice(initialDeliveryPrice);
    }
  };

  const onChangeCartValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCartValue(Number(event.target.value));
  };

  const onChangeDeliveryDistance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryDistance(Number(event.target.value));
  };

  const onChangeAmountOfItems = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setItemAmount(Number(event.target.value));
  };

  return (
    <Container maxWidth="sm">
      <h2>Delivery Fee Calculator</h2>
      <p>
        <TextField
          id="outlined-basic"
          label="Cart Value (€)"
          variant="outlined"
          data-test-id="cartValue"
          onChange={onChangeCartValue}
        />
      </p>
      <p>
        <TextField
          id="outlined-basic"
          label="Delivery Distance (m)"
          variant="outlined"
          data-test-id="deliveryDistance"
          onChange={onChangeDeliveryDistance}
        />
      </p>
      <p>
        <TextField
          id="outlined-basic"
          label="Amount of items"
          variant="outlined"
          data-test-id="numberOfItems"
          onChange={onChangeAmountOfItems}
        />
      </p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoItem label="Delivery time">
          <MobileDateTimePicker
            defaultValue={dayjs("2022-04-17T15:30")}
            data-test-id="orderTime"
            onChange={(newValue): void => setDateTime(newValue)}
          />
        </DemoItem>
      </LocalizationProvider>
      <div className="margin-top-5">
        <Button variant="contained" onClick={(): void => calculateDeliveryPrice()}>
          Calculate delivery price
        </Button>
      </div>
      <p>Delivery price:</p>
      <div title="fee" data-test-id="fee">{Math.round(deliveryPrice * 100) / 100}</div>
    </Container>
  );
}

export default App;
