import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Macbook Pro 13 inch', price: 1999, description: 'Space Gray With M1 13 inch 16/256gb 8 core'},
    {id: '2', title: 'Macbook Pro 13 inch', price: 2199, description: 'Space Gray With M1 13 inch 16/512gb 8 core'},
    {id: '3', title: 'Macbook Pro 14 inch', price: 2499, description: 'Space Gray With M1pro 14 inch 16/512gb 12 core'},
    {id: '4', title: 'Macbook Pro 14 inch', price: 2899, description: 'Space Gray With M1pro 14 inch 32/512gb 16 core'},
    {id: '5', title: 'Macbook Pro 14 inch', price: 2999, description: 'Space Gray With M1 max 14 inch 16/256gb 20 core'},
    {id: '6', title: 'Macbook Pro 14 inch', price: 3099, description: 'Space Gray With M1 max 14 inch 32/512gb 20 core'},
    {id: '7', title: 'Macbook Pro 16 inch', price: 2799, description: 'Space Gray With M1 pro 14 inch 32/512gb 24 core'},
    {id: '8', title: 'Macbook Pro 16 inch', price: 3199, description: 'Space Gray With M1 max 14 inch 32/512gb 36 core'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Xarid qilish ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
