import React from "react";
import axios from "axios";

// main api client 
export const api = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
})
