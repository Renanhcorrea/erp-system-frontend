import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { hasAccess } from "../../utils/roleAccess";

const ALL_MENU_ITEMS = [
    { label: "Dashboard",  path: "/dashboard",  icon: "bi-speedometer2", section: "dashboard"  },
    { label: "Products",   path: "/products",   icon: "bi-box-seam",     section: "products"   },
    { label: "Purchases",  path: "/purchases",   icon: "bi-cart-check",   section: "purchases"  },
    { label: "Sales",      path: "/sales",       icon: "bi-bag-check",    section: "sales"      },
    { label: "Suppliers",  path: "/suppliers",   icon: "bi-truck",        section: "suppliers"  },
    { label: "Finance",    path: "/finance",     icon: "bi-cash-stack",   section: "finance"    },
    { label: "Work Centers", path: "/work-centers", icon: "bi-building",    section: "work-centers" },
    { label: "Users",      path: "/users",       icon: "bi-people",       section: "users"      },
    { label: "Settings",   path: "/settings",    icon: "bi-gear",         section: "settings"   }
];

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = ALL_MENU_ITEMS.filter((item) =>
        hasAccess(user?.role, item.section)
    );

    return (
        <aside className={`erp-sidebar ${isOpen ? "open" : ""}`}>
            <div className="erp-sidebar-brand">
                ERP System
            </div>

            <nav className="erp-sidebar-nav">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

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