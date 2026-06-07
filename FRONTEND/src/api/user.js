import api from "./client";

export async function registerUser(data){
    const res=await api.post("users/register",data);
    return res.data;
}

export async function loginUser({email,password}){
    const res =  await api.post("users/login",{email,password});
    return res.data;
}

export async function getCurrentUser(){
    const res = await api.get("/users/current-user");
    return res.data.data || res.data.user || res.data; 
}

export async function logoutUser(){
    const res = await api.post("/users/logout");
    return res.data;
}