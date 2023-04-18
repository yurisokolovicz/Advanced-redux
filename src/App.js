import { useEffect } from 'react'; // To watch for changes in our cart state
import { useSelector } from 'react-redux';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

function App() {
    const showCart = useSelector(state => state.ui.cartIsVisible);
    const cart = useSelector(state => state.cart);

    useEffect(() => {
        // The PUT method replaces the entire resource with the request payload. The difference to POST is that PUT is idempotent: calling it once or several times successively has the same effect (that is no side effect), where successive identical POST may each have additional effects, like passing an order several times.
        fetch('https://react-http-f7e2d-default-rtdb.firebaseio.com/cart.json', { method: 'PUT', body: JSON.stringify(cart) });
    }, [cart]);
    // We add cart as dependency to useEffect because we want to watch for changes in our cart state.

    return (
        <Layout>
            {showCart && <Cart />}
            <Products />
        </Layout>
    );
}

export default App;

// The useSelector sets up a subscription to Redux. SO whenever the state changes (Redux store change), the component will re-render and we will get the latest state (In this case, the latest cart). The useEffect hook will run after every component re-render cycle. So we can use it to send.

// AND WE CAN KEEP our logic for updating the cart inside of the reducer. Because we changed the order, we first update our Redux store and then we select the updated store to send the request We can do that by using the useEffect hook. The useEffect hook allows us to execute some code whenever a component re-renders. We can use it to send a Http reques
