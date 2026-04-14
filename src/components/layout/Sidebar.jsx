import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "bi-speedometer2" },
        { label: "Products", path: "/products", icon: "bi-box-seam" },
        { label: "Stock", path: "/stock", icon: "bi-boxes" },
        { label: "Purchases", path: "/purchases", icon: "bi-cart-check" },
        { label: "Sales", path: "/sales", icon: "bi-bag-check" },
        { label: "Suppliers", path: "/suppliers", icon: "bi-truck" },
        { label: "Finance", path: "/finance", icon: "bi-cash-stack" },
        { label: "Settings", path: "/settings", icon: "bi-gear" }
    ];

    return (
        <aside className={`erp-sidebar ${isOpen ? "open" : ""}`}>
            <div className="erp-sidebar-brand">
                ERP System
            </div>

            <nav className="erp-sidebar-nav">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`erp-sidebar-link ${isActive ? "active" : ""}`}
                            onClick={onClose}
                        >
                            <i className={`bi ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;