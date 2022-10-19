import React from 'react';
import {useSelector} from 'react-redux';
import {Product, MobileMiniCart, Banners, FooterBonuses } from '../components';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import {_clone, _isMobile} from '../components/helpers.js';
import TopCategoriesMenu from '../components/TopCategoriesMenu';
import { Button } from '@mui/material';

export default function Home() {

    const {products, categories, bonuses_items} = useSelector( ({products}) => {
        return {
          products: products.items,
          categories: products.categories,
          bonuses_items: products.bonuses_items
        }
    });

    const [activeCategoryTags, setActiveCategoryTags] = React.useState({});

    const handleClickCategoryTag = (categoryID, tagID) => {
        let tmpArray = _clone(activeCategoryTags);
        if( !tmpArray.hasOwnProperty(categoryID) ) 
            tmpArray[categoryID] = [tagID];
        else if( !tmpArray[categoryID].includes(tagID) )
            tmpArray[categoryID].push(tagID);
        else if( tmpArray[categoryID].includes(tagID) )
            tmpArray[categoryID] = tmpArray[categoryID].filter( ( tag ) => tag !== tagID );

        setActiveCategoryTags(tmpArray);
    }
    
    return (
        <div className="home">

            <Banners />

            <TopCategoriesMenu />

            { categories ? (
                categories.map( (item, index) => 
                <Container key={`container-category-${item.term_id}`} id={`category-${item.term_id}`} className={`category-${item.term_id}`}>
                    <h2 key={`title-${item.term_id}`}>{item.name}</h2>
                    

                    { item.tags && Object.values(item.tags).map( (tag, tagIndex) =>  (
                        <Button 
                            key={`tag-${tag.term_id}`} 
                            variant="button" 
                            className={`btn btn--tag ${ activeCategoryTags.hasOwnProperty(item.term_id) ? activeCategoryTags[item.term_id].includes(tag.term_id) ? 'btn--tag-active' : '' : '' }`} 
                            sx={{mr: 1, mb: 1}} 
                            onClick={() => 
                            handleClickCategoryTag(item.term_id, tag.term_id)}
                            >
                            {tag.name}
                        </Button>
                    ) ) }

                    <div key={`grid-${item.term_id}`} className="product-grid-list">
                        { products ? ( Object.values(products).sort((product1, product2) => product1['order'] > product2['order'] ? 1 : -1).map( (product) => 
                            product.categories.includes(item.term_id) ? 
                                activeCategoryTags.hasOwnProperty(item.term_id) && activeCategoryTags[item.term_id].length ? 
                                    Object.values(product.tags).filter( productTag => activeCategoryTags[item.term_id].includes(productTag.term_id) ).length ? <Product key={product.id} product={product} />  
                                    : '' 
                                : <Product key={product.id} product={product} /> 
                            : ''
                         ) ) : <Skeleton variant="text" animation="wave" /> }
                    </div>
                </Container>
                )
            ) : <Skeleton variant="text" animation="wave" /> 
            }

            { _isMobile() ? 
                <MobileMiniCart />
            : '' }
  
            { (bonuses_items !== undefined && bonuses_items.length) ?
                <FooterBonuses />
            : '' }

        </div>
    )
}