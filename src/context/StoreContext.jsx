import { createContext } from "react";  
import axios from 'axios';
import { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
export const StoreContext = createContext(null);
 const  StoreContextProvider = (props) => {

    const[cartItems, setCartItems] = useState({});

    const url="https://tastygo-frontend-clientside.vercel.app/myorders";
    const [token,setToken] = useState("");
    const [food_list, setFoodList] = useState([])
    const addToCart = async (itemId) => {
        // Find the food item in the food_list
        const foodItem = food_list.find(item => item._id === itemId);
        
        // Check if there's enough stock
        if (!foodItem || foodItem.stock <= 0) {
            toast.error("Item out of stock!");
            return;
        }
        
        // Check if adding one more would exceed available stock
        const currentQuantity = cartItems[itemId] || 0;
        if (currentQuantity + 1 > foodItem.stock) {
            toast.error(`Only ${foodItem.stock} items available!`);
            return;
        }
        
        if(!cartItems[itemId]){
            setCartItems((prev)=> ({...prev, [itemId]: 1}))
            toast.success("Added to cart");
        }
        else{
            setCartItems((prev)=> ({...prev, [itemId]: prev[itemId] + 1 }))
            toast.success("Added to cart");
        }
        
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async(itemId) => {
        setCartItems((prev)=> ({...prev, [itemId]: prev[itemId]-1}));
        toast.error('Removed from cart');
        
        if(token){
            await axios.post(url+"/api/cart/remove", {itemId},{headers:{token}})

        }
    }
   const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product._id ===item)
            totalAmount += itemInfo.price*cartItems[item];
            }
            
        }
        return totalAmount;
   }

   const fetchFoodList = async ()=> {
    const response = await axios.get(url+"/api/food/list");
    setFoodList(response.data.data)
   }

   const loadCartData = async(token) =>{
    const response = await axios.post(url+"/api/cart/get", {},{headers:{token}});
    setCartItems(response.data.cartData);
   }

   useEffect(()=> {
       
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
   },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }


    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}   
        </StoreContext.Provider>
    )
 }

 export default StoreContextProvider;
