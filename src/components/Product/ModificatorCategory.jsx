import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmptyRequiredCategory,
    deleteEmptyRequiredCategory,
} from "../../redux/actions/productModal";
import { Alert, Collapse } from "@mui/material";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";
import ModificatorProduct from "./ModificatorProduct";
import { useEffect } from "react";

const ModificatorCategory = ({ category, handleSetModificatorsCondition }) => {
    const dispatch = useDispatch();
    const { items: products } = useSelector((state) => state.products);

    const { productModal } = useSelector((state) => state.productModal);

    const modificatorProducts = [].concat.apply(
        [],
        Object.values(products).filter((obj) =>
            category.products.includes(obj.id)
        )
    );

    const totalCategoryCount = useMemo(
        () =>
            productModal.choosenModificators
                .filter((el) => category.products.includes(el.id))
                .reduce((total, el) => total + el.count, 0),
        [productModal]
    );

    const isRequiredCategoryEmpty = useMemo(
        () =>
            category.required === "yes" &&
            ((category.count_products_type === "manual" &&
                totalCategoryCount < category.count_products.min) ||
                (category.count_products_type === "one" &&
                    totalCategoryCount < 1) ||
                (category.count_products_type === "all" &&
                    !totalCategoryCount)),
        [productModal]
    );

    console.log(isRequiredCategoryEmpty);

    const disabledAddButton = useMemo(
        () =>
            (category.count_products_type === "one" &&
                totalCategoryCount >= 1) ||
            (category.count_products_type === "manual" &&
                totalCategoryCount >= category.count_products.max),
        [totalCategoryCount]
    );

    useEffect(() => {
        if (isRequiredCategoryEmpty) {
            dispatch(addEmptyRequiredCategory(category.category_id));
        } else if (!isRequiredCategoryEmpty && category.required === "yes") {
            dispatch(deleteEmptyRequiredCategory(category.category_id));
        }
    }, [isRequiredCategoryEmpty]);

    console.log(category);

    return (
        <div className="addon-products" key={category.category_id}>
            <h3 className="addon-products--title">{category.category_title}</h3>
            <Collapse sx={{ mt: 1 }} in={isRequiredCategoryEmpty}>
                <Alert severity="info">
                    {category.count_products_type === "manual"
                        ? `Выберите хотя бы ${category.count_products.min} ${
                              category.count_products.min == 1
                                  ? "продукт"
                                  : 1 <= category.count_products.min <= 4
                                  ? "продукта"
                                  : "продуктов"
                          } из категории`
                        : category.count_products_type === "one"
                        ? `Выберите продукт из категории`
                        : category.count_products_type === "all"
                        ? `Выберите хотя бы 1 продукт из категории`
                        : null}
                </Alert>
            </Collapse>
            <div className="addon-products--grid-list">
                {modificatorProducts.map((product) => (
                    <ModificatorProduct
                        key={product.id}
                        product={product}
                        category={category}
                        disabledAddButton={disabledAddButton}
                    />
                ))}
            </div>
        </div>
    );
};

export default ModificatorCategory;
