import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditBanner = ({ onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Banner ID from URL params
    const [formData, setFormData] = useState({
        banner_header: "",
        banner_descp: "",
        banner_img: "",
        banner_link: "",
    });

    // Load existing banner data
    useEffect(() => {
        const bannerData = JSON.parse(localStorage.getItem("bannerData"));
        if (bannerData && bannerData._id === id) {
            setFormData(bannerData);
        } else {
            console.log("Fetching banner data for ID:", id);
        }
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, banner_img: file });
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        formDataToSend.append("banner_header", formData.banner_header);
        formDataToSend.append("banner_descp", formData.banner_descp);
        formDataToSend.append("banner_link", formData.banner_link);
        // Only append the image if a new file is provided
        if (formData.banner_img instanceof File) {
            formDataToSend.append("banner_img", formData.banner_img);
        }
        try {
            const response = await fetch(`https://3bf8-102-91-93-50.ngrok-free.app/api/update-banner/${id}`, {
                method: "PUT",
                headers: { "Content-type": "Application/Json" },
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to update banner");
            }

            const result = await response.json();
            console.log("Banner updated:", result);
              navigate("/getbanners"); 
        } catch (err) {
            setError("Failed to update banner. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Edit Banner</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Header Field */}
                    <div>
                        <label
                            htmlFor="banner_header"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Banner Header
                        </label>
                        <input
                            type="text"
                            id="banner_header"
                            name="banner_header"
                            value={formData.banner_header}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-blue-300 focus:outline-none"
                            placeholder="Enter Banner Header"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label
                            htmlFor="banner_descp"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Banner Description
                        </label>
                        <textarea
                            id="banner_descp"
                            name="banner_descp"
                            value={formData.banner_descp}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-blue-300 focus:outline-none"
                            placeholder="Enter Banner Description"
                        />
                    </div>

                    {/* Image Field */}
                    <div>
                        <label
                            htmlFor="banner_img"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Banner Image
                        </label>
                        {formData.banner_img && typeof formData.banner_img === "string" && (
                            <img
                                src={`https://3bf8-102-91-93-50.ngrok-free.app/${formData.banner_img}`}
                                alt="Banner"
                                className="w-24 h-24 object-cover rounded-lg my-2"
                            />
                        )}
                        <input
                            type="file"
                            id="banner_img"
                            name="banner_img"
                            onChange={handleImageChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-300 focus:outline-none"
                        />
                    </div>

                    {/* Link Field */}
                    <div>
                        <label
                            htmlFor="banner_link"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Banner Link
                        </label>
                        <input
                            type="text"
                            id="banner_link"
                            name="banner_link"
                            value={formData.banner_link}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 border rounded-lg focus:ring-blue-300 focus:outline-none"
                            placeholder="Enter Banner Link"
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBanner;
