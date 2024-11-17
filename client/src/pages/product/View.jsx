import NotFound from '../NotFound';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../context/LoaderProvider';
import axios from 'axios';
import { addToCart, getCart } from '../../utils/functions';
import { getAuthToken } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';

export default function View() {
    const [pid, setPid] = useState(new URLSearchParams(location.search).get('p'));
    const [product, setProduct] = useState({})
    const { setLoading } = useLoadingContext();
    const [cartStatus, setToCart] = useState('Add to cart')

    if (!pid) {
        return <NotFound />
    }

    setLoading(true);

    async function atocart(e) {
        setToCart('updating');
        if (await addToCart(pid, getAuthToken())) {
            setToCart('added to cart');
            return;
        }

        setToCart('Add to cart')
        alert('an error occured updating your cart')
    }

    useEffect(() => {
        async function getProduct() {
            const resp = await axios.get(`https://dummyjson.com/products/${pid}`)
            if (resp.status == 200) {
                if (resp.data) {
                    setProduct(resp.data)
                } else {
                    setProduct({ err: 'Failed to fetch product' })
                }
            }
        }

        async function find() {
            let items = await getCart(getAuthToken());
            if (items) {
                for (let i of items) {
                    if (i.pid == pid) {
                        setToCart('added');
                        break;
                    }
                }
            }
        }

        find();
        getProduct();
    }, [pid])

    return product.err ? <Error /> : (
        <div className='container p-3 pb-5 h-100'>
            <div className="row m-0 g-0 bg-white rounded-4 p-4">
                <div className="col-md-5">
                    <img src={product.thumbnail} alt="#" className='bg-light w-100 h-100 rounded-3' style={{ objectFit: "contain", minHeight: "250px", maxHeight: "320px" }} />
                </div>
                <div className='col ps-md-3 pt-md-0 pt-4'>
                    <div className="rounded-pill bg-success py-1 px-3 d-inline-block text-light fw-bolder">Free delivery</div>
                    <h2 className='text-muted mt-2'>{product.title}</h2>
                    <div className="h5">at ${product.price}</div>
                    <div className="h6 text-primary">People Rating: <i className="bi bi-star-fill text-primary"></i> {Math.round(product.rating)}</div>

                    <div className="d-flex mt-3 gap-3 flex-wrap">
                        <button
                            className='btn btn-outline-secondary has-icon flex-grow-1'
                            onClick={atocart}
                            disabled={cartStatus === 'added'}
                        >
                            <i className={`bi ${cartStatus === 'added' ? 'bi-check-circle-fill text-success' : 'bi-bag-plus-fill'}`}></i>
                            <span>{cartStatus === 'added' ? 'Added to cart' : 'Add to cart'}</span>
                        </button>
                        <Link to={`/order?p=${product.id}`} className='btn btn-dark has-icon flex-grow-1'>
                            <i className="bi bi-handbag-fill"></i>
                            <span>Buy Now</span>
                        </Link>
                    </div>
                    <div className="p-3 bg-light rounded-4 mt-4">
                        {product.description ?? 'no description'}
                    </div>
                </div>
            </div>
        </div>
    )
}