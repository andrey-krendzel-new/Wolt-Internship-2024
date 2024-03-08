import { describe, expect, it, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";

describe("Renders main page correctly", async () => {
  afterEach(() => {
    cleanup();
  });

  it("Should render the page correctly", async () => {
    await render(<App />);
    const h2 = await screen.queryByText("Delivery Fee Calculator");

    expect(h2).not.toBeNull();
  });

  it("Delivery price should be 0 on page load", async () => {
    await render(<App />);
    const counter = await screen.queryByText("0.00");

    expect(counter).not.toBeNull();
  });

  it("Clicking calculate button should return cart surcharge (10€) by default", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");

    expect(button).not.toBeNull();

    fireEvent.click(button as HTMLElement);

    expect(counter?.innerHTML).toBe("10.00");
  });

  it("A small order surcharge is added to the delivery price. If the cart value is 8.90€, the surcharge will be 1.10€.", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");
    const input = screen.getByTestId("cartValue");

    // As an alternative, getByLabelText can be used
    //const input = screen.getByLabelText("Cart Value (€)");

    expect(button).not.toBeNull();

    fireEvent.change(input, { target: { value: "8.90" } });
    fireEvent.click(button as HTMLElement);

    expect(counter?.innerHTML).toBe("1.10");
  });

  it("A delivery fee for the first 1000 meters (=1km) is 2€", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");
    const inputField = await screen.getByTestId("deliveryDistance");

    expect(button).not.toBeNull();

    fireEvent.change(inputField, { target: { value: "1000" } });
    fireEvent.click(button as HTMLElement);

    expect(inputField.value).toBe("1000");
    expect(counter?.innerHTML).toBe("12.00");
  });

  it("If the number of items is 10, 3€ surcharge is added", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");
    const input = screen.getByTestId("numberOfItems");
    //As an alternative, getByLabelText can be used
    //const input = screen.getByLabelText("Amount of items");

    expect(button).not.toBeNull();

    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.click(button as HTMLElement);

    expect(input.value).toBe("10");
    expect(counter?.innerHTML).toBe("13.00");
  });

  it("The delivery fee can never be more than 15€", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");
    const input = screen.getByTestId("numberOfItems");

    expect(button).not.toBeNull();

    fireEvent.change(input, { target: { value: "14" } });
    fireEvent.click(button as HTMLElement);

    expect(counter?.innerHTML).toBe("15.00");
  });

  it("The delivery is free when the cart value is equal or more than 200€", async () => {
    await render(<App />);
    const button = await screen.queryByText("Calculate delivery price");
    const counter = await screen.queryByText("0.00");
    const input = screen.getByTestId("cartValue");

    expect(button).not.toBeNull();

    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.click(button as HTMLElement);

    expect(input.value).toBe("200");
    expect(counter?.innerHTML).toBe("0.00");
  });
});
