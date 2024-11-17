import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, getAuthToken } from "../../context/AuthProvider";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";

export default function Orders() {
    const { isLogin } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const resp = await axios.post('/api/product.php', {
                    route: 'get_orders',
                    authToken: getAuthToken()
                });

                if (resp.status === 200 && resp.data.orders) {
                    const detailedOrders = await Promise.all(
                        resp.data.orders.map(async (order) => {
                            const productResp = await axios.get(`https://dummyjson.com/products/${order.opid}`);
                            return {
                                ...order,
                                ...productResp.data // Merge product details
                            };
                        })
                    );
                    setOrders(detailedOrders);
                } else {
                    setErr(resp.data.err || "Failed to fetch orders.");
                }
            } catch (error) {
                setErr("An error occurred while fetching orders.");
            } finally {
                setLoading(false);
            }
        }

        if (isLogin) {
            fetchOrders();
        } else {
            navigate('/login');
            setLoading(false);
        }
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            const resp = await axios.post('/api/product.php', {
                route: 'cancel_order',
                orderId,
                authToken: getAuthToken()
            });

            if (resp.status === 200 && resp.data.success) {
                setOrders(orders.filter(order => order.oid !== orderId));
            } else {
                alert(resp.data.err || "Failed to cancel the order.");
            }
        } catch (error) {
            alert("An error occurred while cancelling the order.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center h-100">
                <Loader />
            </div>
        );
    }

    if (err) {
        return (
            <div className="text-center text-danger p-4">
                <h4>{err}</h4>
            </div>
        );
    }

    return (
        <div className="container my-5 px-4">
            <h3 className="mb-4">Your Orders</h3>
            <div className="row gy-4">
                {orders.length === 0 ? (
                    <div className="text-center">No orders found.</div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="col-md-4">
                            <div className="card border-0 rounded-4 overflow-hidden shadow">
                                <img
                                    src={order.thumbnail}
                                    className="card-img-top rounded"
                                    alt={order.title}
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "0.5rem",
                                        borderTopRightRadius: "0.5rem",
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title text-truncate">{order.title}</h5>
                                    <p className="card-text d-flex align-items-center gap-2">
                                        <i className="bi bi-box-seam text-primary"></i>
                                        <strong>Quantity:</strong> {order.qty}
                                    </p>
                                    <p className="card-text d-flex align-items-center gap-2">
                                        <i className="bi bi-currency-dollar text-success"></i>
                                        <strong>Total:</strong> ${order.total}
                                    </p>
                                    <p className={`card-text fw-bold d-flex align-items-center gap-2 ${order.status === "Delivered" ? "text-success" : "text-warning"}`}>
                                        {order.status === "Delivered" ? (
                                            <i className="bi bi-check-circle-fill"></i>
                                        ) : (
                                            <i className="bi bi-hourglass-split"></i>
                                        )}
                                        <strong>Status:</strong> {order.status ?? "Processing"}
                                    </p>
                                    <div className="d-flex justify-content-between flex-wrap gap-3">
                                        <button
                                            className="btn btn-sm btn-warning flex-grow-1 d-flex align-items-center justify-content-center has-icon rounded-5"
                                            onClick={() => handleCancelOrder(order.oid)}>
                                            <i className="bi bi-x-circle me-2 text-light"></i>
                                            <span className="text-light">Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
}
