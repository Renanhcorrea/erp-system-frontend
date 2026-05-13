import api from "./api";

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Normalises GET /work-centers, which may return either a plain array or a
 * Spring Page object.  Returns the page envelope (with guaranteed content[])
 * so callers can access pagination metadata when needed.
 */
const normalizePagedResponse = (data) => {
    if (Array.isArray(data)) {
        return { content: data, totalElements: data.length, totalPages: 1, number: 0, size: data.length };
    }
    return {
        ...data,
        content: Array.isArray(data?.content) ? data.content : []
    };
};

// ─── Read ────────────────────────────────────────────────────────────────────

export const getAllWorkCenters = async (page = 0, size = 100) => {
    const response = await api.get("/work-centers", { params: { page, size } });
    return normalizePagedResponse(response.data);
};

export const getWorkCenterById = async (id) => {
    const response = await api.get(`/work-centers/${id}`);
    return response.data;
};

// ─── Write ───────────────────────────────────────────────────────────────────

export const createWorkCenter = async (dto) => {
    const response = await api.post("/work-centers", dto);
    return response.data;
};

export const updateWorkCenter = async (id, dto) => {
    const response = await api.put(`/work-centers/${id}`, dto);
    return response.data;
};

export const deleteWorkCenter = async (id) => {
    await api.delete(`/work-centers/${id}`);
};

// ─── Status transitions ──────────────────────────────────────────────────────

export const activateWorkCenter = async (id) => {
    const response = await api.post(`/work-centers/${id}/activate`);
    return response.data;
};

export const deactivateWorkCenter = async (id) => {
    const response = await api.post(`/work-centers/${id}/deactivate`);
    return response.data;
};
