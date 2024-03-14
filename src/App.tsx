import React, { useState } from "react";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import dayjs, { Dayjs } from "dayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./App.css";

function App() {
  const [cartValue, setCartValue] = useState(0);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [itemAmount, setItemAmount] = useState(0);
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const [errorCartValue, setErrorCartValue] = useState("");
  const [errorItemAmount, setErrorItemAmount] = useState("");
  const [errorDeliveryDistance, setErrorDeliveryDistance] = useState("");

  const calculateDeliveryPrice = () => {
    //First validate the input elements
    formValidation();
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
      //If Friday, between 15 and 19pm, inclusive
      initialDeliveryPrice = initialDeliveryPrice * 1.2;
    }

    //Check the current delivery price, if it's over 15 or if cart
    //value is over 200 adjust accordingly, otherwise set it in state
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

  const formValidation = () => {
    if (cartValue === 0) {
      setErrorCartValue("Please enter a cart value");
    }

    if (itemAmount === 0) {
      setErrorItemAmount("Please enter an item amount");
    }

    if (deliveryDistance === 0) {
      setErrorDeliveryDistance("Please enter a delivery distance");
    }
  };

  function isNumerical(inputString: string): boolean {
    return /^-?\d*\.?\d+$/.test(inputString);
  }

  const onChangeCartValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumerical(event.target.value)) {
      setErrorCartValue("The value should be a numerical value");
    } else {
      setErrorCartValue("");
      setCartValue(Number(event.target.value));
    }
  };

  const onChangeDeliveryDistance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isNumerical(event.target.value)) {
      setErrorDeliveryDistance("The value should be a numerical value");
    } else {
      setErrorDeliveryDistance("");
      setDeliveryDistance(Number(event.target.value));
    }
  };

  const onChangeAmountOfItems = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isNumerical(event.target.value)) {
      setErrorItemAmount("The value should be a numerical value");
    } else {
      setErrorItemAmount("");
      setItemAmount(Number(event.target.value));
    }
  };

  return (
    <Container maxWidth="sm">
      <div className="form-box">
        <img
          className="logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Wolt-logo-2019.png/600px-Wolt-logo-2019.png"
        />
        <h2>Delivery Fee Calculator</h2>
        <form>
          <label>Cart Value (€):</label>
          <input
            className="formInput"
            type="text"
            name="username"
            data-testid="cartValue"
            onChange={onChangeCartValue}
          />
          <p className="errorMessage">{errorCartValue}</p>
          <label>Delivery Distance (m):</label>
          <input
            className="formInput"
            type="text"
            name="username"
            data-testid="deliveryDistance"
            onChange={onChangeDeliveryDistance}
          />
          <p className="errorMessage">{errorDeliveryDistance}</p>
          <label>Amount of items:</label>
          <input
            className="formInput"
            type="text"
            name="username"
            data-testid="numberOfItems"
            onChange={onChangeAmountOfItems}
          />
          <p className="errorMessage">{errorItemAmount}</p>
        </form>
        <label>Date/time:</label>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDateTimePicker
            className="date-time-picker"
            sx={{
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
            }}
            defaultValue={dayjs("2022-04-17T15:30")}
            data-testid="orderTime"
            onChange={(newValue): void => setDateTime(newValue)}
          />
        </LocalizationProvider>
        <div className="margin-top-2">
          <button
            className="blue"
            onClick={(): void => calculateDeliveryPrice()}
          >
            Calculate delivery price
          </button>
        </div>
        <div className="container">
          <p>
            <b>Delivery price:</b>
          </p>
          <div title="fee" data-testid="fee">
            {deliveryPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default App;
