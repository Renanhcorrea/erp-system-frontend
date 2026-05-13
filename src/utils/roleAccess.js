export const ROLE_ACCESS = {
    ADMIN: ["dashboard", "products", "stock", "purchases", "sales", "suppliers", "finance", "settings", "users", "work-centers"],
    MANAGER: ["dashboard", "products", "stock", "purchases", "sales", "suppliers", "finance", "work-centers"],
    SALES: ["dashboard", "sales", "products"],
    FINANCE: ["dashboard", "finance"],
    PURCHASE: ["dashboard", "purchases", "suppliers", "products"],
    OPERATIONS: ["dashboard", "stock", "products", "work-centers"]
};

export function hasAccess(role, section) {
    if (!role) return false;
    return ROLE_ACCESS[role]?.includes(section) ?? false;
}
