import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { TextField, Autocomplete, Button } from "@mui/material";
import { Product } from "../components";
import { setStoredInputValue } from "../redux/actions/search";
import { _isCategoryDisabled } from "./helpers";

const SearchBar = ({
    dontShowList,
    dontShowButton,
    products = [],
    handleFilter = () => {},
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { storedInputValue } = useSelector((state) => state.search);
    const { categories } = useSelector((state) => state.products);

    const [inputValue, setInputValue] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [optionsOpen, setOptionsOpen] = useState(false);

    const fuse = new Fuse(products, {
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

    useEffect(() => {
        if (dontShowList && filteredProducts && filteredProducts.length) {
            const temp = filteredProducts.map((el) => el.item);
            handleFilter(temp);
        } else if (dontShowList && inputValue) {
            handleFilter([]);
        } else if (dontShowList && !inputValue) {
            handleFilter(null);
        }
    }, [filteredProducts, inputValue]);

    const disabledCategoriesId = categories
        ?.filter((el) => _isCategoryDisabled(el))
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
        <div className="product-grid-list">
            {filteredProducts.map((el) => (
                <Product
                    product={el.item}
                    disabled={el.item.categories.some((r) =>
                        disabledCategoriesId?.includes(r)
                    )}
                    key={el.id}
                />
            ))}
        </div>
    ) : (
        <div>К сожалению, ничего не найдено</div>
    );

    console.log(filteredProducts);

    return (
        <>
            <div style={{ display: "flex" }}>
                <Autocomplete
                    freeSolo
                    autoSelect={true}
                    inputValue={inputValue || ""}
                    id="search-bar"
                    open={optionsOpen}
                    onClose={() => setOptionsOpen(false)}
                    options={products}
                    getOptionLabel={(option) =>
                        option.title ? option.title : ""
                    }
                    renderOption={(props, option) => {
                        return (
                            <li {...props} key={option.id}>
                                {option.title}
                            </li>
                        );
                    }}
                    onChange={(e, value, reason) => {
                        if (reason === "blur") {
                            return;
                        }
                        if (value) {
                            inputChangeHandler(value.title);
                        } else {
                            inputChangeHandler("");
                            setFilteredProducts(null);
                        }
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
                            inputProps={{
                                ...params.inputProps,
                                onKeyDown: (e) => {
                                    if (e.key === "Enter") {
                                        e.stopPropagation();
                                    }
                                },
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
                {dontShowButton ? null : (
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
                )}
            </div>
            {filteredPoructsList}
        </>
    );
};

export default SearchBar;
