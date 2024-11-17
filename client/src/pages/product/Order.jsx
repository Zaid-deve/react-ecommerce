import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { authenticate, getAuthToken, useAuth } from "../../context/AuthProvider";
import NotFound from "./NotFound";
import Loader from "../../components/Loader";

export default function Order() {
    const { isLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { userDetails, setUserDetails } = useAuth();
    const [product, setProduct] = useState({});
    const [total, setTotal] = useState();
    const [placing, setOrderPlacing] = useState(false);
    const [pid, setPid] = useState(new URLSearchParams(location.search).get("p"));
    const [err, setErr] = useState(null);

    useEffect(() => {
        async function getProduct() {
            if (!pid) {
                setErr("Something went wrong!");
                return;
            }
            try {
                const resp = await axios.get(`https://dummyjson.com/products/${pid}`);
                if (resp.status === 200) {
                    setProduct(resp.data);
                    setTotal(resp.data.price);
                } else {
                    setErr("Sorry, cannot get product details!");
                }
            } catch (error) {
                setErr("An error occurred while fetching product details!");
            }
        }

        async function getUserDetails() {
            const resp = authenticate(getAuthToken());
            if (!resp) {
                alert("You need to set your address and other details to place an order!");
                navigate("/dashboard/profile");
            }

            setUserDetails(resp);
        }

        if (!userDetails) {
            getUserDetails();
        }

        getProduct();
    }, [pid]);

    useEffect(() => {
        if (!isLogin) navigate("/login");
    }, [isLogin, navigate]);

    async function placeOrder() {
        setOrderPlacing(true);
        const payload = {
            pid,
            qty: 1,
            total,
            route: "place_order",
            ...userDetails,
            authToken: getAuthToken(),
        };

        const resp = await axios.post("/api/product.php", payload);
        setOrderPlacing(false);

        if (resp.data.err) {
            if (resp.data.err === "SHIPPING_DETAILS_REQUIRED") {
                alert("Please add shipping details to place a order");
                navigate("/dashboard/profile");
            } else if (resp.data.err === "Login Expired") {
                navigate("/login");
            } else {
                setErr(resp.data.err);
            }
            return;
        }

        setOrderPlacing("placed");
    }

    if (err) return <NotFound err={err} />;

    if (placing === "placed") {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <h2 className="text-success">
                        <i className="bi bi-check-circle"></i> Order Placed Successfully!
                    </h2>
                    <p className="mt-3">Your order has been placed and will be delivered in 2 days.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/dashboard/orders")}>
                        View Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5 px-4 h-100">
            <div className="row col-gap-4 bg-white rounded-4 overflow-hidden position-relative">
                {placing === true && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 text-center bg-white z-1 d-flex flex-column flex-center">
                        <Loader />
                        Placing order, please wait...
                    </div>
                )}

                <div className="col-md-6 p-4">
                    <img
                        src={product.thumbnail}
                        alt="#"
                        className="h-100 w-100"
                        style={{ objectFit: "contain", maxHeight: "275px" }}
                    />
                    <div className="h5 d-flex align-items-center gap-2">
                        <i className="bi bi-basket3-fill text-primary"></i>
                        <span>Qty:</span>
                        <select
                            className="form-select form-select-sm w-auto bg-dark text-light border-secondary rounded-pill"
                            onChange={(e) => setTotal(e.target.value * product.price)}
                            defaultValue="1"
                        >
                            {[...Array(3)].map((_, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                    {idx + 1} {idx === 0 ? "Unit" : "Units"}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="h5 mt-3 fw-bold d-flex align-items-center gap-2">
                        <i className="bi bi-tags-fill"></i>
                        <span>Total Price:</span>
                        <span className="text-danger">${total}</span>
                    </div>

                    <div className="mt-3 d-flex gap-3 flex-wrap">
                        <button className="btn btn-outline-secondary has-icon flex-grow-1" onClick={() => navigate(-1)}>
                            <i className="bi bi-x-circle me-2"></i>
                            <span>Cancel Order</span>
                        </button>
                        <button className="btn btn-dark has-icon flex-grow-1" onClick={placeOrder}>
                            <i className="bi bi-check-circle me-2"></i>
                            <span>Place Order</span>
                        </button>
                    </div>
                </div>
                <div className="col p-4">
                    <h5>
                        <i className="bi bi-info-circle"></i> Product Details:
                    </h5>
                    <hr />
                    <h4>{product.title}</h4>
                    <h5>at ${product.price}</h5>

                    <div className="bg-light p-3 rounded-3 mt-5">
                        <h5>
                            <i className="bi bi-truck"></i> Shipping Details:
                        </h5>
                        <hr />
                        <div className="bg-white p-3 rounded-3 h5">
                            <i className="bi bi-geo-alt"></i> {userDetails?.address ?? "No address"}
                        </div>
                        <h5>
                            <i className="bi bi-person-fill"></i> To: {userDetails?.username ?? "No name"}
                        </h5>
                        <h5 className="bg-success py-2 px-3 text-light mt-3 rounded-5">
                            <i className="bi bi-clock text-light me-1"></i> Delivery: Expected in 2 days
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
}
