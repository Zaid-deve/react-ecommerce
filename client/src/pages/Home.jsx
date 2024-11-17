import { Link } from 'react-router-dom';
import './home.css';

export default function Home() {
    return (
        <div className="container-fluid h-100 d-flex flex-center px-5 bg-white home-container">
            <div className="row">
                <div className="col-md-5 col-lg-4 p-4 rounded-5 position-relative z-1">
                    <h1 className='logo'>Welcome to E-Commerce Website</h1>
                    <p className='text-muted'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid saepe ipsum distinctio commodi itaque dolor, quibusdam earum velit impedit, laborum sed fugit cupiditate reiciendis fuga nam inventore reprehenderit aut? Sed.</p>
                    <Link to="/products" className="btn btn-outline-dark has-icon px-4 rounded-5 ms-auto w-100"><i className="fa-brands fa-edge"></i> <span>Explore</span></Link>
                </div>
            </div>
        </div>
    )
}