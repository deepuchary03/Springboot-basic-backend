import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, apiRequest } from "../api/config";
import "./Auth.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode JWT to get user info (basic decoding, not secure validation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ username: payload.sub });
    } catch (e) {
      console.error("Invalid token");
      navigate("/login");
      return;
    }

    // Fetch products
    fetchProducts(token);
  }, [navigate]);

  const fetchProducts = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8081/api/products", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else if (response.status === 401) {
        setMessage("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setMessage("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "800px" }}>
        <div className="auth-header">
          <h1 className="auth-title">Welcome, {user?.username}!</h1>
          <p className="auth-subtitle">Available Products</p>
          <button 
            onClick={handleLogout}
            className="auth-button"
            style={{ marginBottom: "20px", maxWidth: "150px" }}
          >
            Logout
          </button>
        </div>

        {message && (
          <div className="error-message">
            {message}
          </div>
        )}

        <div className="products-container">
          {products.length > 0 ? (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className="product-name">{product.name}</td>
                      <td className="product-description">{product.description}</td>
                      <td className="product-category">{product.category}</td>
                      <td className="product-price">${product.price}</td>
                      <td className="product-stock">{product.stockQuantity}</td>
                      <td>
                        <span className={`status ${product.available ? 'available' : 'unavailable'}`}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;