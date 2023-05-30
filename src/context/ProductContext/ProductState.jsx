import { createContext, useReducer } from 'react';
import axios from 'axios';
import ProductReducer from './ProductReducer';

const API_URL = 'https://fakestoreapi.com/';

const cart = JSON.parse(localStorage.getItem('cart')) || [];
const initialState = {
    products: [],
};

export const ProductContext = createContext(initialState);

export const ProductProvider = ({ children }) => {
    const [state, dispatch] = useReducer(ProductReducer, initialState);

    const getProducts = async () => {
        try {
            const res = await axios.get(API_URL + 'products/');
            dispatch({
                type: 'GET_PRODUCTS',
                payload: res.data,
            });
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <ProductContext.Provider
            value={{
                products: state.products,
                getProducts,

            }}
        >
            {children}
        </ProductContext.Provider>
    );
};