import axios from "axios"
import {    deleteProductStart,deleteProductSuccess,deleteProductFailed,loginStart ,loginFailed, loginSuccess, registerStart, registerSuccess, registerFailed,addProductStart,addProductSuccess,addProductFailed } from "./authSlice";

// export const loginUser = async (user, dispatch, navigate) => {
//     dispatch(loginStart());

//     try{
//         const res = await axios.post("http://localhost:8000/v1/auth/login",user)
//         dispatch(loginSuccess(res.data))
//         navigate("/")
//     }catch(err){
//         dispatch(loginFailed())
//     }
// }
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await axios.post("http://localhost:8000/v1/auth/login", user);

        dispatch(loginSuccess(res.data));

        // ✅ Lưu user vào localStorage để giữ trạng thái khi F5
        localStorage.setItem("user", JSON.stringify(res.data));

        navigate("/");
    } catch (err) {
        dispatch(loginFailed());
        console.error("Đăng nhập thất bại:", err);
    }
};
export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());

    try{
        const res = await axios.post("http://localhost:8000/v1/auth/register",user)
        dispatch(registerSuccess(res.data))
        navigate("/login")
    }catch(err){
        dispatch(registerFailed())
    }

}
export const addToCart = async (data, dispatch)=>{
    dispatch(addProductStart());
    
    try{
        const res = await axios.post(`http://localhost:8000/v1/cart/${data.user_id}` ,
        { product_id: data.product_id } 

            
        )
        dispatch(addProductSuccess(res.data));

    }catch(err){
        console.log(err)
        dispatch(addProductFailed())
    }
}
export const deleteProduct = async (data, dispatch)=> {
    dispatch(deleteProductStart())

    try{
        const res = await axios.delete(`http://localhost:8000/v1/product/${data.product_id}`)
    
        dispatch(deleteProductSuccess(res.data))
    }catch(err){
        console.log(deleteProductFailed())
    }
}

export const deleteToCart = async (data, dispatch) => {
  dispatch(deleteProductStart());
  try {
    await axios.delete(`http://localhost:8000/v1/cart/${data.user_id}/${data.product_id}`
    //     , {
    //   data: { product_id: data.product_id }, } 
    );
    dispatch(deleteProductSuccess());
  } catch (err) {
    dispatch(deleteProductFailed());
    console.error(err);
  }
};