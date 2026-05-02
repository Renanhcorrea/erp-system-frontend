import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import ProductFormPage from "../pages/ProductFormPage";
import UsersPage from "../pages/UsersPage";
import UserFormPage from "../pages/UserFormPage";

import ProductsPage from "../pages/ProductsPage";

function PlaceholderPage({ title }) {
    return <h2 className="mt-5 ms-3">{title}</h2>;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />

                    <Route path="/products" element={<ProtectedRoute section="products"><ProductsPage /></ProtectedRoute>} />
                    <Route path="/products/new" element={<ProtectedRoute section="products"><ProductFormPage /></ProtectedRoute>} />
                    <Route path="/products/edit/:id" element={<ProtectedRoute section="products"><ProductFormPage /></ProtectedRoute>} />


                    { <Route path="/users" element={<ProtectedRoute section="users"><UsersPage /></ProtectedRoute>} />}
                    { <Route path="/users/new" element={<ProtectedRoute section="users"><UserFormPage /></ProtectedRoute>} />}
                    { <Route path="/users/edit/:id" element={<ProtectedRoute section="users"><UserFormPage /></ProtectedRoute>} />}

                    {/* Routes below are disabled for now until the pages are implemented */}
                    {/* <Route path="/stock" element={<ProtectedRoute section="stock"><PlaceholderPage title="Stock" /></ProtectedRoute>} /> */}
                    {/* <Route path="/purchases" element={<ProtectedRoute section="purchases"><PlaceholderPage title="Purchases" /></ProtectedRoute>} /> */}
                    {/* <Route path="/sales" element={<ProtectedRoute section="sales"><PlaceholderPage title="Sales" /></ProtectedRoute>} /> */}
                    {/* <Route path="/suppliers" element={<ProtectedRoute section="suppliers"><PlaceholderPage title="Suppliers" /></ProtectedRoute>} /> */}
                    {/* <Route path="/finance" element={<ProtectedRoute section="finance"><PlaceholderPage title="Finance" /></ProtectedRoute>} /> */}
                    {/* <Route path="/settings" element={<ProtectedRoute section="settings"><PlaceholderPage title="Settings" /></ProtectedRoute>} /> */}

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
