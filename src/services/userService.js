import api from "./api";

const normalizeText = (value) => value?.trim().toLowerCase() || "";

export const normalizePhoneForApi = (phone) => {
    const digitsOnly = (phone || "").replace(/\D/g, "");
    return digitsOnly.startsWith("0") ? digitsOnly.slice(1) : digitsOnly;
};

const normalizeUserPayload = (userDTO) => ({
    ...userDTO,
    userName: normalizeText(userDTO.userName),
    userSurname: normalizeText(userDTO.userSurname),
    email: normalizeText(userDTO.email),
    phoneNumber: normalizePhoneForApi(userDTO.phoneNumber)
});

export const getAllUsers = async (page = 0, size = 10) => {
    try {
        const response = await api.get(`/users?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export const searchUsers = async ({
    userName = "",
    userSurname = "",
    phone = "",
    role = "",
    page = 0,
    size = 10,
    sort = ""
} = {}) => {
    try {
        const params = new URLSearchParams();

        if (userName.trim()) params.set("userName", userName.trim().toLowerCase());
        if (userSurname.trim()) params.set("userSurname", userSurname.trim().toLowerCase());
        if (phone.trim()) params.set("phone", normalizePhoneForApi(phone));
        if (role.trim()) params.set("role", role.trim());

        params.set("page", String(page));
        params.set("size", String(size));
        if (sort.trim()) params.set("sort", sort.trim());

        const response = await api.get(`/users/search?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
};

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
        const payload = normalizeUserPayload(userDTO);
        const response = await api.post("/users", payload);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }   
}

export const updateUser = async (id, userDTO) => {
    try {
        const normalizedPayload = normalizeUserPayload(userDTO);

        const payload = {
            userName: normalizedPayload.userName,
            userSurname: normalizedPayload.userSurname,
            phoneNumber: normalizedPayload.phoneNumber,
            email: normalizedPayload.email,
            role: normalizedPayload.role,
            active: normalizedPayload.active
        };

        if (userDTO.password && userDTO.password.trim()) {
            payload.password = userDTO.password;
        }

        const response = await api.put(`/users/${id}`, payload);
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