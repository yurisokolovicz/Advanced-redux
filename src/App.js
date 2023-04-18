import { Fragment, useEffect } from 'react'; // use Effect to watch for changes in our cart state
import { useSelector, useDispatch } from 'react-redux';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { sendCartData, fetchCartData } from './store/cart-actions';

let isInitial = true;

function App() {
    const dispatch = useDispatch();
    const showCart = useSelector(state => state.ui.cartIsVisible);
    const cart = useSelector(state => state.cart);
    const notification = useSelector(state => state.ui.notification);

    useEffect(() => {
        dispatch(fetchCartData());
    }, [dispatch]);

    useEffect(() => {
        if (isInitial) {
            isInitial = false;
            return;
        }

        dispatch(sendCartData(cart));
    }, [cart, dispatch]);

    return (
        <Fragment>
            {notification && <Notification status={notification.status} title={notification.title} message={notification.message} />}
            <Layout>
                {showCart && <Cart />}
                <Products />
            </Layout>
        </Fragment>
    );
}

export default App;

// After creating a showNotification in the ui-slice we want to dispatch to show notification action when we start sending the data, when we are done with the data (already sent) and if we have an error.(we import useSispatch from react-redux). In the function App we code  const dispatch = useDispatch(). And we import our uiActions from store/ui-slice. And then in useEffect when we sent the cart data we initially dispatch UI action showNotification(). We also do it when we have an error and when we are done sending the data.
