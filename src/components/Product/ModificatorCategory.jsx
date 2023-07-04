import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Collapse, Grid } from "@mui/material";
import "../../css/product.css";
import "../../css/addon-product.css";
import soon from "../../img/photo-soon.svg";
import ModificatorProduct from "./ModificatorProduct";
import { useEffect } from "react";

const ModificatorCategory = ({
    category,
    choosenModificators,
    addEmptyRequiredCategory,
    deleteEmptyRequiredCategory,
    addProductModificator,
    decreaseProductModificator,
}) => {
    const { items: products } = useSelector((state) => state.products);

    const modificatorProducts = [].concat.apply(
        [],
        Object.values(products).filter((obj) =>
            category.products.includes(obj.id)
        )
    );

    const totalCategoryCount = useMemo(
        () =>
            choosenModificators
                .filter((el) => category.products.includes(el.id))
                .reduce((total, el) => total + el.count, 0),
        [choosenModificators]
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
        [choosenModificators]
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
            addEmptyRequiredCategory(category.category_id);
        } else if (!isRequiredCategoryEmpty && category.required === "yes") {
            deleteEmptyRequiredCategory(category.category_id);
        }
    }, [isRequiredCategoryEmpty]);

    return (
        <div className="modificator-products" key={category.category_id}>
            <div className="modificator-products--title">
                {category.category_title}
            </div>
            <Collapse sx={{ mt: 1 }} in={isRequiredCategoryEmpty} unmountOnExit>
                <Alert severity="info" sx={{ border: "1px solid #99dfff" }}>
                    {category.count_products_type === "manual"
                        ? `Выберите ${category.count_products.min} ${
                              category.count_products.min == 1
                                  ? "товар"
                                  : 2 <= category.count_products.min <= 4
                                  ? "товара"
                                  : "товаров"
                          } из категории`
                        : category.count_products_type === "one"
                        ? `Выберите товар из категории`
                        : category.count_products_type === "all"
                        ? `Выберите 1 товар из категории`
                        : null}
                </Alert>
            </Collapse>
            <Grid container spacing={1} sx={{ mt: "6px" }}>
                {modificatorProducts.map((product) => (
                    <Grid
                        item
                        mobilexs={6}
                        mobilesm={4}
                        mobilemd={3}
                        mobilelg={2}
                        desctop={4}
                        key={product.id}
                    >
                        <ModificatorProduct
                            product={product}
                            category={category}
                            disabledAddButton={disabledAddButton}
                            choosenModificators={choosenModificators}
                            addEmptyRequiredCategory={addEmptyRequiredCategory}
                            deleteEmptyRequiredCategory={
                                deleteEmptyRequiredCategory
                            }
                            addProductModificator={addProductModificator}
                            decreaseProductModificator={
                                decreaseProductModificator
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default ModificatorCategory;
