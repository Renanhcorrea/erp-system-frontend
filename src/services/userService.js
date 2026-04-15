import api from "./api";

// DTOs
export const getAllUsers = async (page = 0, size = 10) => {
    try {
        const response = await api.get(`/users?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
}

export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`/users/email/${email}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with email ${email}:`, error);
        throw error;
    }
}

export const getUsersByRole = async (role, page = 0, size = 10) => {
    try {
        const response = await api.get(`/users/role/${role}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching users with role ${role}:`, error);
        throw error;
    }  
}

export const getActiveUsersByRole = async (role, page = 0, size = 10) => {
    try {
        const response = await api.get(`/users/active/role/${role}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching active users with role ${role}:`, error);
        throw error;
    }   
}

export const searchUsersByName = async (userName, page = 0, size = 10) => {
    try {
        const response = await api.get(`/users/search?name=${
            encodeURIComponent(userName)}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching users with name ${
            encodeURIComponent(userName)}:`, error);
        throw error;
    }
}

export const searchUsersBySurname = async (userSurname, page = 0, size = 10) => {
    try {
        const response = await api.get(`/users/search?surname=${
            encodeURIComponent(userSurname)}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {       
        console.error(`Error searching users with surname ${
            encodeURIComponent(userSurname)}:`, error);
        throw error;
    }
}

export const searchUsersByPhone = async (phoneNumber, page = 0, size = 10) => {
    try {
        const response = await api.get(`/users/search?phone=${
            encodeURIComponent(phoneNumber)}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching users with phone number ${
            encodeURIComponent(phoneNumber)}:`, error);
        throw error;
    }
}

export const createUser = async (userDTO) => {
    try {
        const response = await api.post("/users", userDTO);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }   
}

export const updateUser = async (id, userDTO) => {
    try {
        const response = await api.put(`/users/${id}`, userDTO);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }   
}

export const deleteUser = async (id) => {
    try {
        await api.delete(`/users/${id}`);   
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }   
}