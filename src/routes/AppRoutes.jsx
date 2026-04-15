import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProductsPage from "../pages/ProductsPage";
import ProductFormPage from "../pages/ProductFormPage";
import UsersPage from "../pages/UsersPage";
import UserFormPage from "../pages/UserFormPage";


function PlaceholderPage({ title }) {
    return <h2>{title}</h2>;
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />

                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/edit/:id" element={<ProductFormPage />} />
                    
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/users/new" element={<UserFormPage />} />
                    <Route path="/users/edit/:id" element={<UserFormPage />} />

                    <Route path="/stock" element={<PlaceholderPage title="Stock" />} />
                    <Route path="/purchases" element={<PlaceholderPage title="Purchases" />} />
                    <Route path="/sales" element={<PlaceholderPage title="Sales" />} />
                    <Route path="/suppliers" element={<PlaceholderPage title="Suppliers" />} />
                    <Route path="/finance" element={<PlaceholderPage title="Finance" />} />
                    <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;