import React, {useContext} from 'react'
import './FoodItem.css' 
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
const FoodItem = ({id, name, price, description, image, stock }) => {

    const{cartItems, addToCart, removeFromCart,url} = useContext(StoreContext);

    // Determine if the item is out of stock
    const isOutOfStock = stock <= 0;
    
    // Determine if adding one more would exceed available stock
    const currentQuantity = cartItems[id] || 0;
    const reachedMaxStock = currentQuantity >= stock;

  return (
    <div className='food-item'>
       <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt=""  />
        {isOutOfStock ? (
            <div className="out-of-stock">Out of Stock</div>
        ) : !cartItems[id] ? (
            <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
        ) : (
            <div className='food-item-counter'>
                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                <p>
                  {cartItems[id]}
                </p>
                {!reachedMaxStock ? (
                    <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=""/>
                ) : (
                    <img style={{opacity: 0.5}} src={assets.add_icon_green} alt=""/>
                )}
            </div>
        )}
        </div> 
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="food-item-desc">{description}</p>
            <div className="food-item-price-stock">
                <p className="food-item-price">₹{price}</p>
                <p className="food-item-stock">{stock > 0 ? `Stock: ${stock}` : "Out of Stock"}</p>
            </div>
        </div>
    </div>      
  )
}

export default FoodItem