import { motion } from "framer-motion";
import AuthLayout from "../Layout/AuthLayout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
    const userid = JSON.parse(localStorage.getItem("user")).id;
    const [user, setUser] = useState();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/getbyid/${userid}`).then((response) => {
            setUser(response.data);
            setFormData({
                email: response.data.email,
                username: response.data.username,
                password: '' // On ne charge pas le mot de passe existant
            });
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            // Mise à jour côté serveur
            await axios.put(
                `http://localhost:8000/api/users/modif/${userid}`,
                formData
            );
    
            // Re-fetch de l'utilisateur à jour
            const response = await axios.get(`http://localhost:8000/api/users/getbyid/${userid}`);
            const updatedUser = response.data;
    
            setUser(updatedUser);
            setFormData({
                email: updatedUser.email,
                username: updatedUser.username,
                password: '' // pas besoin de charger l'ancien mot de passe
            });
    
            // Mise à jour du localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({
                ...currentUser,
                username: updatedUser.username
            }));
    
            setSuccess(true);
            setEditMode(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthLayout>
            <div className="pt-28 min-h-screen bg-gradient-to-r from-[#ececec] via-[#ffffff] to-[#eeeeee] py-12 px-4 sm:px-6 lg:px-8">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <motion.div
                        className="bg-[#eeeeee] bg-opacity-10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-8 md:p-12">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Profile Picture Section */}
                                <motion.div
                                    className="flex-shrink-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <div className="relative w-40 h-40 mx-auto md:mx-0">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1">
                                            <div className="h-full w-full rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                                                <span className="text-5xl font-bold text-white">
                                                    {user?.username?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.div
                                            className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            {user?.role}
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Profile Details */}
                                <motion.div
                                    className="flex-grow"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {editMode ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
     

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="••••••••"
                                                />
                                            </div>

                                            <div className="flex space-x-3 pt-4">
                                                <motion.button
                                                    type="submit"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    disabled={loading}
                                                    className={`px-6 py-3 bg-gradient-to-r from-[#46c7d8] to-[#0b94a7] rounded-full text-white font-medium shadow-lg ${loading ? 'opacity-50' : ''}`}
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center justify-center">
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Saving...
                                                        </span>
                                                    ) : 'Save Changes'}
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setEditMode(false)}
                                                    disabled={loading}
                                                    className="px-6 py-3 bg-gray-200 rounded-full text-gray-800 font-medium shadow-lg"
                                                >
                                                    Cancel
                                                </motion.button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-3xl font-bold text-gray-900 mb-1">{user?.username}</h2>
                                                <p className="text-gray-900">{user?.email}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-white bg-opacity-5 p-4 rounded-xl">
                                                    <h3 className="text-sm font-medium text-purple-900 mb-1">Member Since</h3>
                                                    <p className="text-xl font-semibold text-gray-900">{user?.dateCreation}</p>
                                                </div>

                                                {user?.role == "ROLE_USER" && (
                                                    <div className="bg-white bg-opacity-5 p-4 rounded-xl">
                                                        <h3 className="text-sm font-medium text-purple-900 mb-1">Total Points</h3>
                                                        <div className="flex items-center">
                                                            <p className="text-xl font-semibold text-gray-900 mr-2">{user?.pointsTotalAll}</p>
                                                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pt-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setEditMode(true)}
                                                    className="px-6 py-3 bg-gradient-to-r from-[#46c7d8] to-[#0b94a7] rounded-full text-white font-medium shadow-lg"
                                                >
                                                    Edit Profile
                                                </motion.button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        {!editMode && (
                            <motion.div
                                className="bg-[#eeeeee] bg-opacity-5 p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Stats</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Quizzes Taken", value: 12, icon: "📊" },
                                        { label: "Correct Answers", value: 84, icon: "✅" },
                                        { label: "Highest Score", value: 950, icon: "🏆" },
                                        { label: "Current Streak", value: 5, icon: "🔥" }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white bg-opacity-10 p-4 rounded-lg text-center"
                                            whileHover={{ y: -5 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                        >
                                            <div className="text-2xl mb-2">{stat.icon}</div>
                                            <p className="text-sm text-purple-900 mb-1">{stat.label}</p>
                                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthLayout>
    );
}