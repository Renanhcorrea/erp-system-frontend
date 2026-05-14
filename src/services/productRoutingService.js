import api from "./api";

const normalizePagedResponse = (data) => {
    if (Array.isArray(data)) {
        return {
            content: data,
            totalElements: data.length,
            totalPages: 1,
            number: 0,
            size: data.length
        };
    }

    return {
        ...data,
        content: Array.isArray(data?.content) ? data.content : []
    };
};

export const getAllProductRoutings = async (page = 0, size = 10) => {
    const response = await api.get("/product-routings", { params: { page, size } });
    return normalizePagedResponse(response.data);
};

export const getProductRoutingById = async (id) => {
    const response = await api.get(`/product-routings/${id}`);
    return response.data;
};

export const getActiveProductRoutingByProductId = async (productId) => {
    const response = await api.get(`/product-routings/product/${productId}/active`);
    return response.data;
};

export const createProductRouting = async (dto) => {
    const response = await api.post("/product-routings", dto);
    return response.data;
};

export const updateProductRouting = async (id, dto) => {
    const response = await api.put(`/product-routings/${id}`, dto);
    return response.data;
};

export const activateProductRouting = async (id) => {
    const response = await api.patch(`/product-routings/${id}/activate`);
    return response.data;
};

export const deactivateProductRouting = async (id) => {
    const response = await api.patch(`/product-routings/${id}/deactivate`);
    return response.data;
};

export const deleteProductRouting = async (id) => {
    await api.delete(`/product-routings/${id}`);
};
