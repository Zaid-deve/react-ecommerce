import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { useAuth, reqAuth, request, getAuthToken } from '../../context/AuthProvider';

export default function Login() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        err: null
    });
    const [form, setForm] = useState(true);  // true for Login, false for Signup
    const [loading, setLoading] = useState(false);
    const { isLogin, setLogin, setUserDetails } = useAuth();
    const navigate = useNavigate();

    if (isLogin) {
        navigate('/dashboard');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value, err: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            route: form ? 'login' : 'signup',
            email: formData.email,
            password: formData.password,
            ...(form ? {} : {
                username: formData.username,
                confirmPassword: formData.confirmPassword
            })
        };

        const response = await reqAuth(payload);

        if (response === true) {
            const authToken = getAuthToken();
            const resp = await request('user', 'post', { authToken });
            if (resp.status == 200) {
                if (resp.data.success && resp.data.details) {
                    setUserDetails(resp.data.details);
                }
            }
            setLogin(true);
            navigate('/dashboard');
        } else {
            setFormData(prevData => ({ ...prevData, err: response }));
        }
        setLoading(false);
    };

    return (
        <div className="row flex-center m-0 g-0 p-4">
            <div className="col-md-5">
                <div className="panel panel-login p-4 mt-3">
                    {formData.err && (
                        <div className="alert alert-danger">{formData.err}</div>
                    )}
                    <div className="panel-heading mb-3">
                        <h3 className='mb-4'>{form ? 'Login To Your Account' : 'Create New Account'}</h3>
                        <div className="row bg-light rounded-3 g-0">
                            <div className="col-6">
                                <button
                                    className={`btn ${form ? 'active' : ''} border-0 w-100`}
                                    onClick={() => setForm(true)}>
                                    Login
                                </button>
                            </div>
                            <div className="col-6">
                                <button
                                    className={`btn ${!form ? 'active' : ''} border-0 w-100`}
                                    onClick={() => setForm(false)}>
                                    Register
                                </button>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className="panel-body">
                        <form
                            onSubmit={handleSubmit}
                            className="d-flex flex-column gap-3">
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Email"
                                required
                            />
                            {!form && (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Username"
                                    required
                                />
                            )}
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="Password"
                                required
                            />
                            {!form && (
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    required
                                />
                            )}
                            <button
                                type="submit"
                                className={`form-control btn ${form ? 'btn-login' : 'btn-register'}`}
                                disabled={loading}>
                                {loading ? 'Processing...' : (form ? 'Log In' : 'Register Now')}
                            </button>
                            {form && (
                                <div className="text-center mt-2">
                                    <a href="#!" className="forgot-password">
                                        Forgot Password?
                                    </a>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
