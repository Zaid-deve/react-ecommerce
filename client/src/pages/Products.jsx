import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoadingContext } from '../context/LoaderProvider';
import { addToCart, getCart } from '../utils/functions';
import { getAuthToken } from '../context/AuthProvider';
import Error from '../components/Error';
import './products.css';

const icons = [
    { className: 'bi bi-box', text: 'products' },
    { className: 'bi bi-tv', text: 'tv' },
    { className: 'bi bi-phone', text: 'smart phone' },
    { className: 'bi bi-broadcast', text: 'radio' },
    { className: 'bi bi-book', text: 'books' },
];

export default function Products() {
    const [i, setIndex] = useState(0);
    const [data, setData] = useState(icons[0]);
    const [val, setVal] = useState('');
    const [results, setResults] = useState(null);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const { setLoading } = useLoadingContext();
    const navigate = useNavigate();

    function searchProduct(e) {
        let qry = e.target.value;
        setVal(qry);
        if (qry === '') {
            setResults(null);
        }
    }

    useEffect(() => {
        if (val !== '') {
            return;
        }
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [val]);

    useEffect(() => {
        setData(icons[i]);
    }, [i]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://dummyjson.com/products');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        const fetchCartItems = async () => {
            try {
                const items = await getCart(getAuthToken());
                setCartItems(items || []);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        };

        fetchData();
        fetchCartItems();
    }, [setLoading]);

    const atocart = async (productId) => {
        const updatedCart = [...cartItems];
        const targetIndex = updatedCart.findIndex(item => item.pid === productId);

        if (targetIndex === -1) {
            updatedCart.push({ pid: productId });
            setCartItems(updatedCart);
        }

        try {
            const success = await addToCart(productId, getAuthToken());
            if (!success) throw new Error('Cart update failed');
        } catch (error) {
            alert('An error occurred updating your cart');
            setCartItems(cartItems.filter(item => item.pid !== productId));
        }
    };

    const search = (e) => {
        e.preventDefault();
        if (!val) {
            setResults(null);
            return;
        }
        const items = products.filter(p => p.title.match(val));
        setResults(items);
    };

    if (error) {
        return <Error err={error} />;
    }

    const displayProducts = results || products;

    return (
        <div className="container h-100">
            {/* Search Bar */}
            <div className="search-bar">
                <form className="my-3 d-flex bg-white search-bar" onSubmit={search}>
                    <div className="icon h-100 ps-4 d-flex align-items-center">
                        <i className={data.className}></i>
                    </div>
                    <input
                        className="form-control form-control-lg w-100 border-0 search-inp px-3"
                        type="text"
                        placeholder={`Search ${data.text}...`}
                        value={val}
                        onChange={searchProduct}
                    />
                    <button className="btn bg-light h-100 px-4 border-0" type="submit">
                        <i className="bi bi-search"></i>
                    </button>
                </form>
            </div>

            {/* Products List */}
            <div className="container py-4">
                <div className="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-4 m-0">
                    {displayProducts.length === 0 ? (
                        <div className="col-12">
                            <p>No results found</p>
                        </div>
                    ) : (
                        displayProducts.map((product) => {
                            const isInCart = cartItems.some(item => item.pid === product.id);
                            return (
                                <div className="col" key={product.id}>
                                    <div className="card border-0 h-100 rounded-4 overflow-hidden position-relative">
                                        <div className="position-absolute top-0 start-0 p-2">
                                            <span className="badge bg-warning">
                                                <span className="text-light">5</span> <i className="bi bi-star text-light"></i>
                                            </span> <br />
                                            {isInCart ? (
                                                <button className="btn bg-success rounded-3 mt-2 border-0" disabled>
                                                    <i className="bi bi-cart-check-fill text-light"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn bg-white rounded-3 mt-2 border-0"
                                                    onClick={() => atocart(product.id)}
                                                >
                                                    <i className="bi bi-cart"></i>
                                                </button>
                                            )}
                                        </div>
                                        <img
                                            src={product.thumbnail}
                                            className="card-img-top bg-light w-100"
                                            alt={product.title}
                                            style={{ height: "clamp(160px, 30vw,200px)", objectFit: "contain" }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.title}</h5>
                                            <p className="card-text">{product.description.slice(0, 50)}...</p>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between align-items-center">
                                            <h5 className="text-muted m-0">${product.price}</h5>
                                            <button
                                                className="btn btn-outline-secondary rounded-5"
                                                onClick={() => navigate(`/view?p=${product.id}`)}
                                            >
                                                <i className="bi bi-bag-fill"></i> <span>Browse</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
