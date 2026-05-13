import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../services/productService";
import { getFriendlyApiError } from "../services/api";

const PRODUCT_TYPES = [
    "SCREW",
    "STEEL_SHEET",
    "STEEL_TUBE",
    "STAINLESS_STEEL_SHEET",
    "STAINLESS_STEEL_TUBE",
    "WELDING",
    "PAINT",
    "CUTTING",
    "PRODUCTION",
    "ASSEMBLY"
];

const PAGE_SIZE = 10;

function ProductsPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(PAGE_SIZE);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterSku, setFilterSku] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterUnit, setFilterUnit] = useState("");
    const [filterActive, setFilterActive] = useState("");

    const [debouncedFilters, setDebouncedFilters] = useState({
        sku: "",
        name: "",
        type: "",
        unit: "",
        active: ""
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters({
                sku: filterSku,
                name: filterName,
                type: filterType,
                unit: filterUnit,
                active: filterActive
            });

            setCurrentPage(0);
        }, 500);

        return () => clearTimeout(timer);
    }, [filterSku, filterName, filterType, filterUnit, filterActive]);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {};

            if (debouncedFilters.sku.trim()) filters.sku = debouncedFilters.sku.trim();
            if (debouncedFilters.name.trim()) filters.name = debouncedFilters.name.trim();
            if (debouncedFilters.type) filters.type = debouncedFilters.type;
            if (debouncedFilters.unit.trim()) filters.unit = debouncedFilters.unit.trim();
            if (debouncedFilters.active !== "") {
                filters.active = debouncedFilters.active === "true";
            }

            const response = await getAllProducts(currentPage, pageSize, filters);

            if (Array.isArray(response)) {
                setProducts(response);
                setTotalElements(response.length);
                setTotalPages(1);
                return;
            }

            setProducts(response.content ?? []);
            setTotalPages(response.totalPages ?? 0);
            setTotalElements(response.totalElements ?? 0);
        } catch (requestError) {
            console.error("Error loading products:", requestError);
            setError(getFriendlyApiError(requestError, "Failed to load products."));
        } finally {
            setLoading(false);
        }
    }, [
        currentPage,
        pageSize,
        debouncedFilters 
    ]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const updateFilter = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleClearFilters = () => {
        setFilterSku("");
        setFilterName("");
        setFilterType("");
        setFilterUnit("");
        setFilterActive("");

        setDebouncedFilters({
            sku: "",
            name: "",
            type: "",
            unit: "",
            active: ""
        });

        setCurrentPage(0);
    };

    const handlePreviousPage = () => {
        setCurrentPage((page) => Math.max(0, page - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((page) => {
            if (page + 1 >= totalPages) {
                return page;
            }

            return page + 1;
        });
    };

    const handleDelete = async (id, name) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete/deactivate the product "${name}"?`
        );

        if (!confirmed) return;

        try {
            await deleteProduct(id);

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id ? { ...product, active: false } : product
                )
            );
        } catch (requestError) {
            console.error("Error deleting product:", requestError);
            setError(getFriendlyApiError(requestError, "Failed to delete product."));
            }
        };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Products Management</h1>

                <Link to="/products/new" className="btn btn-primary">
                    Add New Product
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-3 mb-4">
                <h5 className="mb-3">Filters</h5>

                <div className="row g-3">
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="SKU"
                            value={filterSku}
                            onChange={updateFilter(setFilterSku)}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={filterName}
                            onChange={updateFilter(setFilterName)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={updateFilter(setFilterType)}
                        >
                            <option value="">All types</option>
                            {PRODUCT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Unit"
                            value={filterUnit}
                            onChange={updateFilter(setFilterUnit)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterActive}
                            onChange={updateFilter(setFilterActive)}
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <p className="text-muted">No products found.</p>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered align-middle products-table">
                            <thead className="table-dark">
                                <tr>
                                    <th className="col-id">ID</th>
                                    <th className="col-sku">SKU</th>
                                    <th className="col-name">Name</th>
                                    <th className="col-price">Price</th>
                                    <th className="col-quantity">Quantity</th>
                                    <th className="col-unit">Unit</th>
                                    <th className="col-type">Type</th>
                                    <th className="col-status">Status</th>
                                    <th className="col-actions">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="col-id">{product.id}</td>
                                        <td className="col-sku">{product.sku || "-"}</td>
                                        <td className="col-name">{product.name}</td>
                                        <td className="col-price">
                                            €{Number(product.price ?? 0).toFixed(2)}
                                        </td>

                                        <td className="col-quantity">
                                            {product.availableQuantity ?? product.quantity ?? 0}
                                        </td>

                                        <td className="col-unit">{product.unit}</td>
                                        <td className="col-type">{product.type}</td>
                                        <td className="col-status">
                                            <span
                                                className={`badge ${
                                                    product.active ? "bg-success" : "bg-secondary"
                                                }`}
                                            >
                                                {product.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="col-actions">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => navigate(`/products/edit/${product.id}`)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(product.id, product.name)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <small className="text-muted">
                            Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages} —{" "}
                            {totalElements} total
                        </small>

                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                            >
                                ← Previous
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleNextPage}
                                disabled={currentPage + 1 >= totalPages}
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProductsPage;