import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addEmptyRequiredCategory,
    deleteEmptyRequiredCategory,
} from "../../redux/actions/productModal";
import { Alert, Collapse, Grid } from "@mui/material";
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

    return (
        <div className="modificator-products" key={category.category_id}>
            <h3 className="modificator-products--title">
                {category.category_title}
            </h3>
            <Collapse sx={{ mt: 1 }} in={isRequiredCategoryEmpty}>
                <Alert severity="info" sx={{ border: "1px solid #99dfff" }}>
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
            <Grid container spacing={1} sx={{ mt: "8px" }}>
                {modificatorProducts.map((product) => (
                    <Grid
                        item
                        mobilexs={6}
                        mobilesm={4}
                        mobilemd={3}
                        mobilelg={2}
                        desctop={4}
                    >
                        <ModificatorProduct
                            key={product.id}
                            product={product}
                            category={category}
                            disabledAddButton={disabledAddButton}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ModificatorCategory;
