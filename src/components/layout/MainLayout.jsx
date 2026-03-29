import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="erp-layout">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <div className="erp-main">
                <Topbar onToggleSidebar={toggleSidebar} />

                <main className="erp-content">
                    <Outlet />
                </main>
            </div>

            {sidebarOpen && <div className="erp-overlay" onClick={closeSidebar}></div>}
        </div>
    );
}

export default MainLayout;