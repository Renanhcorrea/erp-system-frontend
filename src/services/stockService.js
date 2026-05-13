import api from "./api";
import { STOCK_ACTIONS } from "../types/stockTypes";

const buildPayload = (productId, quantity, referenceId) => ({
    productId: Number(productId),
    quantity: Number(quantity),
    referenceId: referenceId ? Number(referenceId) : null
});

export const getProductStockBalance = async (productId) => {
    const response = await api.get(`/stocks/products/${productId}/balance`);
    return response.data;
};

export const getProductStock = getProductStockBalance;

export const getProductStockMovements = async (productId) => {
    const response = await api.get(`/stocks/products/${productId}/history`);
    return Array.isArray(response.data) ? response.data : [];
};

export const manualStockEntry = async (productId, quantity, referenceId = null) => {
    const payload = buildPayload(productId, quantity, referenceId);

    if (!payload.quantity || payload.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const response = await api.post("/stocks/manual-entry", payload);
    return response.data;
};

export const manualStockOutput = async (productId, quantity, referenceId = null) => {
    const payload = buildPayload(productId, quantity, referenceId);

    if (!payload.quantity || payload.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const response = await api.post("/stocks/manual-output", payload);
    return response.data;
};

export const executeStockAction = async (action, productId, request) => {
    const quantity = Number(request.quantity);
    const referenceId = request.referenceId || null;

    if (!quantity || quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    if (action === STOCK_ACTIONS.ADD) {
        return manualStockEntry(productId, quantity, referenceId);
    }

    if (action === STOCK_ACTIONS.REMOVE) {
        return manualStockOutput(productId, quantity, referenceId);
    }

    throw new Error(`Unsupported stock action: ${action}`);
};