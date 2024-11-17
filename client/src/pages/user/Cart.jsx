import { useEffect, useState } from "react";
import { useLoadingContext } from "../../context/LoaderProvider";
import { getCart } from "../../utils/functions";
import { getAuthToken, useAuth } from "../../context/AuthProvider";
import Error from "../../components/Error";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { setLoading } = useLoadingContext();
    const [items, setCartItems] = useState([]);
    const [err, setErr] = useState('');
    const [products, setProducts] = useState([]);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCart() {
            try {
                setLoading(true);
                const authToken = getAuthToken();
                if (authToken) {
                    const cartItems = await getCart(authToken);
                    if (cartItems) {
                        setCartItems(cartItems);
                        const productRequests = cartItems.map(item =>
                            axios.get(`https://dummyjson.com/products/${item.pid}`)
                        );
                        const productResponses = await Promise.all(productRequests);
                        setProducts(productResponses.map(res => res.data));
                    }
                } else {
                    logout();
                    navigate('/login');
                }
            } catch (error) {
                setErr('Failed to load cart items!');
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, [setLoading]);

    if (err) return <Error err={err} />;

    return (
        <div className="container py-4">
            <div className="row row-cols-1 row-cols-md-3 g-4 m-0">
                {products.map((product, i) => (
                    <div className="col" key={i} onClick={() => navigate(`/view?p=${product.id}`)}>
                        <div className="card border-0 h-100 rounded-4 overflow-hidden position-relative">
                            <div className="position-absolute top-0 start-0 p-2">
                                <span className="badge bg-warning">
                                    <span className='text-light me-2'>{Math.round(product.rating)}</span>
                                    <i className="bi bi-star text-light"></i>
                                </span>
                                <br />
                                <button className="btn bg-white rounded-3 mt-2 border-0"><i className="bi bi-cart"></i></button>
                            </div>
                            <img src={product.thumbnail} className="card-img-top bg-light w-100" alt={product.title} style={{ height: "clamp(160px, 30vw,200px)", objectFit: "contain" }} />
                            <div className="card-body">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text">{product.description.slice(0, 50)}...</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <h5 className="text-muted m-0">${product.price}</h5>
                                <button className="btn btn-outline-secondary rounded-5">
                                    <i className="bi bi-bag-fill"></i> <span>Browse</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
