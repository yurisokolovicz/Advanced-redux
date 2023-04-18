import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], totalQuantity: 0 },
    reducers: {
        // replaceCart(state, action) {
        //     state.totalQuantity = action.payload.totalQuantity;
        //     state.items = action.payload.items;
        // },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice = existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                // We remove the item from the cart by filtering it out the item with the id we want to remove. We keep all items that do not match the id we want to remove.
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
            }
        }
    }
});

/////////// ACTION CREATOR - function that return an action object with a type and so on.
// Before we call dispatch in the Action creator we can perform any async code, any side effects, because we will not reach the reducer until we call dispatch.
export const sendCartData = cart => {
    return async dispatch => {
        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data!'
            })
        );

        const sedRequest = async () => {
            const response = await fetch('https://react-http-f7e2d-default-rtdb.firebaseio.com/cart.json', {
                method: 'PUT',
                body: JSON.stringify(cart)
            });

            if (!response.ok) {
                throw new Error('Sending cart data failed.');
            }
        };

        try {
            await sedRequest();

            dispatch(
                uiActions.showNotification({
                    status: 'success',
                    title: 'Success!',
                    message: 'Sent cart data successfully!'
                })
            );
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Sending cart data failed!'
                })
            );
        }
    };
};

export const cartActions = cartSlice.actions;

export default cartSlice;

// We are creating a function sendCartData which immediately, without doing anything else, returns another function, a async function. We don't know yet who will execute that function but we will soon know it. But in that function we then dispatch a notification action. Then we created a new function (nested) and we send the request. This function is called by us. We call it in the try block. We call it in the try block because we want to catch any errors that might occur. If we don't have an error, we dispatch the success notification, if we do have an error, we dispatch the error notification.

// We wanna use sendCartData as an ACTION CREATOR so in App.js we still wanna dispatch after the initial check. We will dispatch the sendCartData and pass cart as an argument.

// THE GREAT THING about Redux when using Redux toolkit is that it does not just accept action objects with a type property instead it also does accept action creators that return functions. And if it see that you are dispatching an action which is actually a function instead of action object it will execute that function for you. So Redux will execute that function for you. SO in that executed function we can dispatch again. It is an alternative to having that logic in our component. But it is a good idea to not have too much logic in the component. And moving that logic to this action creator function we did achieve this. The App.js component is now LEANER and cleaner (It only dispatch one action, not multiple actions, it does not care about sending the HTTP request and all the hard work happens inside of our custom action creator function in our Redux files). We can also use this action creator function in other places in our application.
