import api from "./api";
import { STOCK_ACTIONS } from "../types/stockTypes";

const ACTION_ENDPOINT_CANDIDATES = {
    [STOCK_ACTIONS.ADD]: [
        (productId) => `/stock/products/${productId}/add`,
        (productId) => `/stock/add-stock/${productId}`,
        () => "/stock/add"
    ],
    [STOCK_ACTIONS.REMOVE]: [
        (productId) => `/stock/products/${productId}/remove`,
        (productId) => `/stock/remove-stock/${productId}`,
        () => "/stock/remove"
    ],
    [STOCK_ACTIONS.RESERVE]: [
        (productId) => `/stock/products/${productId}/reserve`,
        (productId) => `/stock/reserve/${productId}`,
        () => "/stock/reserve"
    ],
    [STOCK_ACTIONS.CONSUME_RESERVED]: [
        (productId) => `/stock/products/${productId}/consume-reserved`,
        (productId) => `/stock/consume-reserved/${productId}`,
        () => "/stock/consume-reserved"
    ],
    [STOCK_ACTIONS.RELEASE_RESERVATION]: [
        (productId) => `/stock/products/${productId}/release-reservation`,
        (productId) => `/stock/release-reservation/${productId}`,
        () => "/stock/release-reservation"
    ]
};

// TODO: if backend exposes a different contract for manual stock removal,
// replace STOCK_ACTIONS.REMOVE endpoint candidates above with the final route.

const STOCK_ENDPOINT_CANDIDATES = [
    (productId) => `/stock/products/${productId}`,
    (productId) => `/stock/${productId}`
];

const MOVEMENT_ENDPOINT_CANDIDATES = [
    (productId) => `/stock/products/${productId}/movements`,
    (productId) => `/stock/movements/product/${productId}`
];

const toStockPayload = (raw, productId) => ({
    productId,
    availableQuantity: Number(raw?.availableQuantity ?? raw?.quantity ?? 0),
    reservedQuantity: Number(raw?.reservedQuantity ?? 0),
    updatedAt: raw?.updatedAt || null
});

const tryPostWithCandidates = async (candidates, productId, payload) => {
    let lastError;

    for (const candidate of candidates) {
        const endpoint = candidate(productId);

        try {
            const response = await api.post(endpoint, payload);
            return response.data;
        } catch (error) {
            const status = error.response?.status;
            if (status === 404 || status === 405) {
                lastError = error;
                continue;
            }

            throw error;
        }
    }

    throw lastError || new Error("Stock endpoint not found");
};

export const getProductStock = async (productId) => {
    let lastError;

    for (const candidate of STOCK_ENDPOINT_CANDIDATES) {
        try {
            const response = await api.get(candidate(productId));
            return toStockPayload(response.data, productId);
        } catch (error) {
            if (error.response?.status === 404) {
                lastError = error;
                continue;
            }

            throw error;
        }
    }

    if (lastError?.response?.status === 404) {
        return {
            productId,
            availableQuantity: 0,
            reservedQuantity: 0,
            updatedAt: null
        };
    }

    throw lastError;
};

export const getProductStockMovements = async (productId) => {
    let lastError;

    for (const candidate of MOVEMENT_ENDPOINT_CANDIDATES) {
        try {
            const response = await api.get(candidate(productId));
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            if (error.response?.status === 404) {
                lastError = error;
                continue;
            }

            throw error;
        }
    }

    // TODO: replace fallback when backend confirms the stock history endpoint contract.
    if (lastError?.response?.status === 404) {
        return [];
    }

    throw lastError;
};

export const executeStockAction = async (action, productId, request) => {
    if (!ACTION_ENDPOINT_CANDIDATES[action]) {
        throw new Error(`Unsupported stock action: ${action}`);
    }

    const payload = {
        productId,
        quantity: Number(request.quantity),
        referenceId: request.referenceId?.trim() || null
    };

    if (!payload.quantity || payload.quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    return tryPostWithCandidates(ACTION_ENDPOINT_CANDIDATES[action], productId, payload);
};
