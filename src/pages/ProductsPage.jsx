import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getAllProducts } from "../services/productService";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [pageData, setPageData] = useState({
        number: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filterName, setFilterName] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterUnit, setFilterUnit] = useState("");
    const [filterActive, setFilterActive] = useState("");

    const navigate = useNavigate();

    const fetchProducts = async (page = 0) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAllProducts(page, 10);

            if (Array.isArray(data)) {
                setProducts(data);
                setPageData({
                    number: 0,
                    size: data.length || 10,
                    totalPages: 1,
                    totalElements: data.length
                });
                return;
            }

            setProducts(data.content || []);
            setPageData({
                number: data.number ?? 0,
                size: data.size ?? 10,
                totalPages: data.totalPages ?? 0,
                totalElements: data.totalElements ?? 0
            });
        } catch (error) {
            console.error("Error loading products:", error);
            setError("Failed to load products: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(0);
    }, []);

     const handleDelete = async (id, name) => {
        const confirmed = window.confirm(`Are you sure you want to delete/deactivate the product "${name}"?`);
        if (!confirmed) return;

        try {
            await deleteProduct(id);
            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id ? { ...product, active: false } : product
                )
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product: " + error.message);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesName = product.name?.toLowerCase().includes(filterName.toLowerCase());
            const matchesType = filterType ? product.type === filterType : true;
            const matchesUnit = product.unit?.toLowerCase().includes(filterUnit.toLowerCase());
            const matchesActive =
                filterActive === ""
                    ? true
                    : filterActive === "true"
                    ? product.active === true
                    : product.active === false;

            return matchesName && matchesType && matchesUnit && matchesActive;
        });
    }, [products, filterName, filterType, filterUnit, filterActive]);

    if (loading) {
        return (
            <div className="container mt-5">
                <p>⏳ Loading products...</p>
            </div>
        );
    }

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
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All types</option>
                            <option value="SCREW">Screw</option>
                            <option value="STEEL_SHEET">Steel Sheet</option>
                            <option value="STAINLESS_STEEL_SHEET">Stainless Steel Sheet</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Unit"
                            value={filterUnit}
                            onChange={(e) => setFilterUnit(e.target.value)}
                        />
                    </div>

                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="col-md-1">
                        <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => {
                                setFilterName("");
                                setFilterType("");
                                setFilterUnit("");
                                setFilterActive("");
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
    <p className="text-muted">No products found.</p>
) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Unit</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>€{Number(p.price).toFixed(2)}</td>
                                    <td>{p.quantity}</td>
                                    <td>{p.unit}</td>
                                    <td>{p.type}</td>
                                    <td>
                                        <span className={`badge ${p.active ? "bg-success" : "bg-secondary"}`}>
                                            {p.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/products/edit/${p.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(p.id, p.name)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
                <span>
                    Total products: <strong>{pageData.totalElements}</strong>
                </span>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pageData.number === 0}
                        onClick={() => fetchProducts(pageData.number - 1)}
                    >
                        Previous
                    </button>

                    <span className="align-self-center">
                        Page {pageData.number + 1} of {pageData.totalPages || 1}
                    </span>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={pageData.number + 1 >= pageData.totalPages}
                        onClick={() => fetchProducts(pageData.number + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage;