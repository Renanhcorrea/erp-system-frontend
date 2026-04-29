export const ROLE_ACCESS = {
    ADMIN: ["dashboard", "products", "stock", "purchases", "sales", "suppliers", "finance", "settings", "users"],
    MANAGER: ["dashboard", "products", "stock", "purchases", "sales", "suppliers", "finance"],
    SALES: ["dashboard", "sales", "products"],
    FINANCE: ["dashboard", "finance"],
    PURCHASE: ["dashboard", "purchases", "suppliers", "products"],
    OPERATIONS: ["dashboard", "stock", "products"]
};

export function hasAccess(role, section) {
    if (!role) return false;
    return ROLE_ACCESS[role]?.includes(section) ?? false;
}
