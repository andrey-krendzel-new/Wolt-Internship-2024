import { describe, expect, it, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import App from '../App';

describe('Renders main page correctly', async () => {
    afterEach(() => {
        cleanup();
    });
    /**
     * Passes - shows title correctly
     */
    it('Should render the page correctly', async () => {
        // Setup
        await render(<App />);
        const h2 = await screen.queryByText('Delivery Fee Calculator');

        // Post Expectations
        expect(h2).not.toBeNull();
    });

    /**
     * Passes - shows the button count correctly present
     */
    it('Delivery price should be 0 on page load', async () => {
        // Setup
        await render(<App />);
        const counter = await screen.queryByText('0');

        // Expectations
        expect(counter).not.toBeNull();
    });

    /**
     * Passes - clicks the button 3 times and shows the correct count
     */
    it('Clicking calculate button should return cart surcharge (10€) by default', async () => {
        // Setup
        await render(<App />);
        const button = await screen.queryByText('Calculate delivery price');
        const counter = await screen.queryByText('0');
        
        // Pre Expectations
        expect(button).not.toBeNull();

        // Actions
        fireEvent.click(button as HTMLElement);
        
        // Post Expectations
        expect(counter?.innerHTML).toBe('10');
    });

    it('A small order surcharge is added to the delivery price. If the cart value is 8.90€, the surcharge will be 1.10€.', async () => {
        // Setup
        await render(<App />);
        const button = await screen.queryByText('Calculate delivery price');
        const counter = await screen.queryByText('0');
        const input = screen.getByLabelText("Cart Value (€)");
        
        // Pre Expectations
        expect(button).not.toBeNull();

        // Actions
        fireEvent.change(input, {target: {value: '8.90'}})
        fireEvent.click(button as HTMLElement);
        
        // Post Expectations
        expect(counter?.innerHTML).toBe('1.1');
    });

    it('A delivery fee for the first 1000 meters (=1km) is 2€', async () => {
        // Setup
        await render(<App />);
        const button = await screen.queryByText('Calculate delivery price');
        const counter = await screen.getByTitle("fee");
        const input = screen.getByLabelText("Delivery Distance (m)");

        // Pre Expectations
        expect(button).not.toBeNull();

        // Actions
        fireEvent.change(input, {target: {value: '1000'}})
        fireEvent.click(button as HTMLElement);
        
        // Post Expectations
        expect(input.value).toBe('1000')
        expect(counter?.innerHTML).toBe('12');
    });

    it('If the number of items is 14, 6.20€ surcharge is added', async () => {
        // Setup
        await render(<App />);
        const button = await screen.queryByText('Calculate delivery price');
        const counter = await screen.queryByText('0');
        const input = screen.getByLabelText("Amount of items");

        // Pre Expectations
        expect(button).not.toBeNull();

        // Actions
        fireEvent.change(input, {target: {value: '14'}})
        fireEvent.click(button as HTMLElement);
        
        // Post Expectations
        expect(counter?.innerHTML).toBe('16.2');
    });
});