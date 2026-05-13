import api from "./api";

// DTOs
export const getAllProducts = async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, sort: "id,asc", ...filters };
    const response = await api.get("/products", { params });
    return response.data; 
}

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data; 
}

export const createProduct = async (productDTO) => {
    const response = await api.post("/products", productDTO);
    return response.data;
}

export const updateProduct = async (id, productDTO) => {
    const response = await api.put(`/products/${id}`, productDTO);
    return response.data; 
}

export const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
}