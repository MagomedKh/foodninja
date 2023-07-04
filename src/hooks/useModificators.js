import React, { useState, useEffect } from "react";

const useModificators = (productId) => {
    const [choosenModificators, setChoosenModificators] = useState([]);
    const [emptyModificatorCategories, setEmptyModificatorCategories] =
        useState([]);
    const [modificatorsAmount, setModificatorsAmount] = useState(0);
    const [modificatorsCondition, setModificatorsCondition] = useState(true);

    useEffect(() => {
        if (choosenModificators.length) {
            setChoosenModificators([]);
        }
        if (emptyModificatorCategories.length) {
            setEmptyModificatorCategories([]);
        }
        if (modificatorsAmount) {
            setModificatorsAmount(0);
        }
        if (!modificatorsCondition) {
            setModificatorsCondition(true);
        }
    }, [productId]);

    const addEmptyRequiredCategory = (categoryId) => {
        if (emptyModificatorCategories.includes(categoryId)) {
            return;
        }
        const newArray = [...emptyModificatorCategories, categoryId];
        setEmptyModificatorCategories(newArray);
        if (modificatorsCondition) {
            setModificatorsCondition(false);
        }
    };
    const deleteEmptyRequiredCategory = (categoryId) => {
        const newArray = [...emptyModificatorCategories];
        const deletedModificatorInx = newArray.findIndex(
            (el) => el === categoryId
        );
        if (deletedModificatorInx >= 0) {
            newArray.splice(deletedModificatorInx, 1);
        }
        setEmptyModificatorCategories(newArray);
        if (!newArray.length) {
            setModificatorsCondition(true);
        }
    };

    const addProductModificator = (product) => {
        const updatedModificators = [...choosenModificators];
        const existModificatorInx = updatedModificators.findIndex(
            (el) => el.id === product.id
        );
        if (existModificatorInx >= 0) {
            updatedModificators[existModificatorInx].count++;
        } else {
            updatedModificators.push(product);
        }
        setChoosenModificators(updatedModificators);
        setModificatorsAmount(
            (prevAmount) => prevAmount + product.options._price
        );
    };

    const decreaseProductModificator = (product) => {
        const updatedModificators = [...choosenModificators];
        const existModificatorInx = updatedModificators.findIndex(
            (el) => el.id === product.id
        );
        if (existModificatorInx >= 0) {
            updatedModificators[existModificatorInx].count--;
            if (updatedModificators[existModificatorInx].count <= 0) {
                updatedModificators.splice(existModificatorInx, 1);
            }
        }
        setChoosenModificators(updatedModificators);
        setModificatorsAmount(
            (prevAmount) => prevAmount - product.options._price
        );
    };

    return {
        choosenModificators,
        emptyModificatorCategories,
        modificatorsAmount,
        modificatorsCondition,
        addEmptyRequiredCategory,
        deleteEmptyRequiredCategory,
        addProductModificator,
        decreaseProductModificator,
    };
};

export default useModificators;
