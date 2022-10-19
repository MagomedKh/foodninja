import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MiniCart } from '../components';
import ScrollContainer from 'react-indiana-drag-scroll'
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import {Button, Link as AnimateLink } from "react-scroll";
import {_isMobile} from '../components/helpers.js';
import '../css/top-categories-menu.css';

export default function TopCategoriesMenu() {

    const stickedBarRef = useRef();
    const categoriesMenuRef = useRef();
    const [sticked, setSticked] = useState( false );
    const {categories} = useSelector( ({products}) => {
        return {
            categories: products.categories
        }
    });

    const [showedCategories, setShowedCategories] = useState(categories)
    const [restCategories, setRestCategories] = useState([])
    const showedCategoriesRef = useRef();
    showedCategoriesRef.current = showedCategories;
    const restCategoriesRef = useRef();
    restCategoriesRef.current = restCategories;

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        };
    }, [sticked]);    
    
    useEffect(() => {
        if( !_isMobile() ) {
            window.addEventListener("resize", checkFlexMenu)
            checkFlexMenu();
        }
        return () => {
            window.removeEventListener("resize", checkFlexMenu)
        };
    }, []);

    const checkFlexMenu = () => {
        let flex = true;
        let menuWidth, allLi, allLiLength, breakIndex = 0;

        menuWidth = document.querySelector("#topCategoriesMenu").offsetWidth;

        allLi = document.querySelectorAll("#topCategoriesMenu li");
        allLiLength = 100;
        for(let i = 0; i < allLi.length; i++) {
            allLiLength += allLi[i].offsetWidth;
            if( menuWidth < allLiLength && !breakIndex ) {
                breakIndex = i;
            }
        }
        if( !_isMobile() && breakIndex )
            changeFlexMenu( 'decrease', allLi.length-breakIndex );
        else {
            flex = false;
            menuWidth = document.querySelector("#topCategoriesMenu").offsetWidth;
            allLi = document.querySelectorAll("#topCategoriesMenu li");
            allLiLength = 0;
            for(let i = 0; i < allLi.length; i++) 
                allLiLength += allLi[i].offsetWidth;
        
            if( menuWidth-allLiLength > 100 )
                changeFlexMenu( 'increase', 1 );  
        } 
 
    }
    const changeFlexMenu = ( type, countEl ) => {
        // decrease
        if( !_isMobile() && type == 'decrease' ) {
            setRestCategories([
                ...restCategoriesRef.current,
                ...showedCategoriesRef.current.slice(
                    showedCategoriesRef.current.length - countEl, showedCategoriesRef.current.length
                )
            ])
            setShowedCategories(
                showedCategoriesRef.current.slice(0, showedCategoriesRef.current.length - countEl)
            )
        } else if( !_isMobile() && type == 'increase' ) {
            setShowedCategories([
                ...showedCategoriesRef.current,
                ...restCategoriesRef.current.slice(
                    restCategoriesRef.current.length - countEl, restCategoriesRef.current.length
                )
            ])
            setRestCategories(
                restCategoriesRef.current.slice(0, restCategoriesRef.current.length - countEl)
            )
        }
    }

    const handleScroll = () => {
        if( window.scrollY >= stickedBarRef.current.offsetTop & !sticked ) setSticked(true);
        if( window.scrollY < stickedBarRef.current.offsetTop & sticked ) setSticked(false);
    }

    return (
        <div className={`sticked-top-bar ${ sticked ? 'sticked' : 'no-sticked'}`} ref={stickedBarRef}>
            <Container className="inner-wrapper">
                { categories ? (
                    
                    <ul id="topCategoriesMenu" className="categories-menu" ref={categoriesMenuRef}>
                        { showedCategories.map( (item, index) => <li key={item.term_id}>
                            <AnimateLink
                                activeClass="active"
                                to={`category-${item.term_id}`}
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >{item.name}</AnimateLink>
                        </li> )} 

                        { restCategories.length &&
                            <li className="flexmenu--more">
                                <div className="btn btn--action">Ещё</div>
                                <ul className="flexmenu--dropdown">
                                    { restCategories.map(item => <li><AnimateLink
                                        key={item.term_id}
                                        activeClass="active"
                                        to={`category-${item.term_id}`}
                                        spy={true}
                                        smooth={true}
                                        offset={-70}
                                        duration={500}
                                    >{item.name}</AnimateLink></li>) }
                                </ul>
                            </li>
                        }
                    </ul>  ) : <Skeleton variant="text" animation="wave" /> 
                }
                { !_isMobile() && <MiniCart /> }
            </Container>
        </div>
    )
}