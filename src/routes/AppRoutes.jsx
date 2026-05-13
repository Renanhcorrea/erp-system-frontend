import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import ProductFormPage from "../pages/ProductFormPage";
import UsersPage from "../pages/UsersPage";
import UserFormPage from "../pages/UserFormPage";
import ProductsPage from "../pages/ProductsPage";
import PurchasePage from "../pages/PurchasePage";
import SalesPage from "../pages/SalesPage";
import SupplierPage from "../pages/SupplierPage";
import FinancePage from "../pages/FinancePage";
import SettingsPage from "../pages/SettingsPage";
import WorkCenterPage from "../pages/WorkCenterPage";
import WorkCenterFormPage from "../pages/WorkCenterFormPage";

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
                    <Route path="/dashboard" element={<div className="mt-5 ms-3"><h2>Dashboard</h2></div>} />

                    <Route path="/products" element={<ProtectedRoute section="products"><ProductsPage /></ProtectedRoute>} />
                    <Route path="/products/new" element={<ProtectedRoute section="products"><ProductFormPage /></ProtectedRoute>} />
                    <Route path="/products/edit/:id" element={<ProtectedRoute section="products"><ProductFormPage /></ProtectedRoute>} />


                    { <Route path="/users" element={<ProtectedRoute section="users"><UsersPage /></ProtectedRoute>} />}
                    { <Route path="/users/new" element={<ProtectedRoute section="users"><UserFormPage /></ProtectedRoute>} />}
                    { <Route path="/users/edit/:id" element={<ProtectedRoute section="users"><UserFormPage /></ProtectedRoute>} />}

                    <Route path="/purchases" element={<ProtectedRoute section="purchases"><PurchasePage /></ProtectedRoute>} />
                    <Route path="/sales" element={<ProtectedRoute section="sales"><SalesPage /></ProtectedRoute>} />
                    <Route path="/suppliers" element={<ProtectedRoute section="suppliers"><SupplierPage /></ProtectedRoute>} />
                    <Route path="/finance" element={<ProtectedRoute section="finance"><FinancePage /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute section="settings"><SettingsPage /></ProtectedRoute>} />

                    <Route path="/work-centers" element={<ProtectedRoute section="work-centers"><WorkCenterPage /></ProtectedRoute>} />
                    <Route path="/work-centers/new" element={<ProtectedRoute section="work-centers"><WorkCenterFormPage /></ProtectedRoute>} />
                    <Route path="/work-centers/:id/edit" element={<ProtectedRoute section="work-centers"><WorkCenterFormPage /></ProtectedRoute>} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
