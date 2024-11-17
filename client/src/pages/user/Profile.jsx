import { useEffect, useRef, useState } from 'react';
import profileImg from '/src/assets/default-avatar-icon-of-social-media-user-vector.jpg';
import { authenticate, getAuthToken, request, useAuth } from '../../context/AuthProvider';
import { useLoadingContext } from '../../context/LoaderProvider';

export default function Profile() {
    const [formData, setFormData] = useState({
        username: '',
        address: '',
        email: '',
        userimg: profileImg,
        error: null,
    });
    const { setLoading } = useLoadingContext();
    const imgRef = useRef();
    const { userDetails, setUserDetails } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value || '',
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prevData) => ({
                ...prevData,
                userimg: imageUrl,
            }));
        }
    };

    const handleUpdate = async () => {
        setFormData((prevData) => ({ ...prevData, error: null }));

        if (!formData.username || !formData.address) {
            setFormData((prevData) => ({
                ...prevData,
                error: 'Username and Address cannot be empty.',
            }));
            return;
        }

        setLoading(true);

        const authToken = getAuthToken();
        const formDataToSend = new FormData();
        formDataToSend.append('username', formData.username);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('route', 'update');
        formDataToSend.append('authToken', authToken);

        if (imgRef.current?.files?.length > 0) {
            formDataToSend.append('img', imgRef.current.files[0]);
        }

        try {
            const req = await request('user', 'post', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (req.status === 200 && req.data.success) {
                const updatedUserDetails = {
                    ...userDetails,
                    username: formData.username,
                    address: formData.address,
                    email: formData.email,
                    userimg: formData.userimg,
                };

                setUserDetails(updatedUserDetails);
                alert('Profile updated!');
            } else {
                alert('Failed to update profile: ' + (req.data.err ?? req.error));
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const authToken = getAuthToken();
            if (authToken) {
                const response = await authenticate(authToken);
                if (response?.data?.success && response.data.details) {
                    const user = response.data.details[0];
                    setFormData((prev) => ({
                        ...prev,
                        username: user.username || '',
                        address: user.address || '',
                        email: user.email || '',
                        userimg: user.userimg || profileImg,
                        error: null,
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        error: 'Failed to load profile details.',
                    }));
                }
            }
            setLoading(false);
        };

        if (userDetails.length) {
            setFormData({ ...userDetails, error: '' })
            return;
        }

        fetchDetails();
    }, [setLoading]);

    return (
        <div className="row p-3 g-0 m-0">
            <div className="col-lg-11 mx-auto">
                <div className="bg-white rounded-4 p-4">
                    <h3>My Profile</h3>
                    <hr />
                    {formData.error && <div className="alert alert-danger">{formData.error}</div>}
                    <div className="row gap-2">
                        <div className="col-md-4 gap-2 text-center">
                            <div className="d-flex flex-center">
                                <label htmlFor="profileImg">
                                    <div className="position-relative">
                                        <img
                                            src={formData.userimg}
                                            alt="Profile"
                                            className="rounded-circle bg-light d-block mx-auto"
                                            style={{ height: '70px', aspectRatio: '1/1', objectFit: 'cover' }}
                                        />
                                        <div className="position-absolute bottom-0 end-0 rounded-4 py-1 px-2 bg-primary">
                                            <i className="bi bi-plus-circle text-light"></i>
                                        </div>
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="profileImg"
                                    accept="image/*"
                                    hidden
                                    onChange={handleImageChange}
                                    ref={imgRef}
                                />
                            </div>
                            <h5 className="mt-3 bg-light p-2 rounded-2">{formData.username}</h5>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    readOnly
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    onChange={handleInputChange}
                                    style={{ minHeight: '70px' }}
                                    value={formData.address}
                                />
                            </div>
                            <button onClick={handleUpdate} className="btn btn-primary w-100">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
