import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { TextField, Autocomplete, Button } from "@mui/material";
import { Product } from "../components";
import { setStoredInputValue } from "../redux/actions/search";
import { _isCategoryDisabled } from "./helpers";

const SearchBar = ({ dontShowList }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { storedInputValue } = useSelector((state) => state.search);
    const { items, categories } = useSelector((state) => state.products);

    const [filteredProducts, setFilteredProducts] = useState(null);
    const [inputValue, setInputValue] = useState(null);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const allProducts = [].concat.apply([], Object.values(items));

    const fuse = new Fuse(allProducts, {
        keys: ["title"],
        minMatchCharLength: 1,
        threshold: 0.2,
    });

    useEffect(() => {
        if (storedInputValue) {
            const temp = fuse.search(storedInputValue);
            setFilteredProducts(temp);
            dispatch(setStoredInputValue(null));
        }
    }, [dispatch]);

    const disabledCategoriesId = categories
        .filter((el) => _isCategoryDisabled(el))
        .map((el) => el.term_id);

    const inputChangeHandler = (value) => {
        setInputValue(value);
        const temp = fuse.search(value);
        setFilteredProducts(temp);
        if (value.length >= 1) {
            setOptionsOpen(true);
        } else setOptionsOpen(false);
    };

    const findButtonHandler = () => {
        dispatch(setStoredInputValue(inputValue));
    };

    const filteredPoructsList = dontShowList ? null : filteredProducts &&
      filteredProducts.length ? (
        filteredProducts.map((el) => (
            <Product
                product={el.item}
                disabled={el.item.categories.some((r) =>
                    disabledCategoriesId.includes(r)
                )}
            />
        ))
    ) : (
        <div>К сожалению, ничего не найдено</div>
    );

    return (
        <>
            <Autocomplete
                freeSolo
                autoSelect={true}
                clearOnBlur={true}
                clearOnEscape={false}
                id="search-bar"
                open={optionsOpen}
                onClose={() => setOptionsOpen(false)}
                options={allProducts.map((option) => option.title)}
                onChange={(e, value, reason) => {
                    if (value) {
                        inputChangeHandler(value);
                    } else setFilteredProducts(null);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="small"
                        label="Поиск товаров"
                        value={inputValue}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                findButtonHandler();
                                navigate("/search");
                            }
                        }}
                        onChange={(e) => {
                            inputChangeHandler(e.target.value);
                        }}
                        sx={{
                            mb: 2,
                            "& fieldset": {
                                borderRadius: "20px",
                            },
                        }}
                    />
                )}
                sx={{ flexGrow: 1 }}
            />
            {dontShowList ? (
                <Link to="/search" style={{ textDecoration: "none" }}>
                    <Button
                        className="btn--action"
                        variant="outlined"
                        sx={{ width: "100px", ml: 1 }}
                        onClick={findButtonHandler}
                    >
                        Найти
                    </Button>
                </Link>
            ) : null}
            <div className="product-grid-list">{filteredPoructsList}</div>
        </>
    );
};

export default SearchBar;
