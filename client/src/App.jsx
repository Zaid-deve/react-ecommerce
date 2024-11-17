import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap/js/src/collapse.js'
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import Login from './pages/user/Login';
import AuthProvider from './context/AuthProvider';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import LoadingProvider from './context/LoaderProvider';
import View from './pages/product/View';
import Cart from './pages/user/Cart';
import Order from './pages/product/Order';
import Orders from './pages/user/Orders';
import AboutUs from './pages/About';
import ContactUs from './pages/Contact';

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <Router>
          <div className="vh-100 vw-100 d-flex flex-column overflow-auto">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/dashboard/*" element={<Dashboard />}>
                <Route path='profile' element={<Profile />}></Route>
                <Route path='cart' element={<Cart />}></Route>
                <Route path='order' element={<Order />}></Route>
                <Route path='orders' element={<Orders />}></Route>
              </Route>
              <Route path="/view" element={<View />} />
              <Route path="/order" element={<Order />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LoadingProvider>
  );
}
