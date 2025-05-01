import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Layout/Layout";
import axios from "axios";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isHovered, setIsHovered] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        rest: {
            scale: 1,
            background: "linear-gradient(135deg, #46D3E5 0%, #3ab8c9 100%)"
        },
        hover: {
            scale: 1.05,
            background: "linear-gradient(135deg, #FC5C15 0%, #e04e10 100%)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        const response = await axios.post("http://localhost:8000/api/login", {
            email: formData.email,
            password: formData.password
        }).then((response) => {
            console.log(JSON.stringify(response.data));
            
            localStorage.setItem("user", JSON.stringify(response.data)); // Store user data in local storage response.data);
            console.log(response.data.role);
            
            if (response.data.role === "ROLE_ADMIN") {
                navigate("/admin");
            }else{
               navigate("/home"); 
            }
            
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred during login");
            }
        }).finally(() => {
            setIsLoading(false);
        });
    };


    return (
        <Layout>
            {/* Main Login Content */}
            <main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-24">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="bg-white rounded-3xl shadow-xl overflow-hidden"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Login Header */}
                        <div className="relative h-40 bg-gradient-to-r from-[#46D3E5] to-[#3ab8c9] overflow-hidden">
                            <motion.div
                                className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#FC5C15] opacity-20"
                                animate={{
                                    x: [0, 100, 0],
                                    y: [0, 50, 0],
                                }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <motion.div
                                className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white opacity-10"
                                animate={{
                                    x: [0, -100, 0],
                                    y: [0, -50, 0],
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                                <motion.h2
                                    className="text-3xl font-bold text-white mb-2"
                                    variants={itemVariants}
                                >
                                    Welcome Back!
                                </motion.h2>
                                <motion.p
                                    className="text-white opacity-90"
                                    variants={itemVariants}
                                >
                                    Sign in to continue your quiz journey
                                </motion.p>
                            </div>
                        </div>

                        {/* Login Form */}
                        <motion.form
                            className="p-8"
                            onSubmit={handleSubmit}
                            variants={containerVariants}
                        >
                            {error && (
                                <motion.div
                                    className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
                                    variants={itemVariants}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.div className="mb-6" variants={itemVariants}>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#46D3E5] focus:ring-2 focus:ring-[#46D3E5]/50 transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </motion.div>

                            <motion.div className="mb-6" variants={itemVariants}>
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#46D3E5] focus:ring-2 focus:ring-[#46D3E5]/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="flex justify-end mt-2">
                                    <Link to="/forgot-password" className="text-sm text-[#46D3E5] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div className="mb-6" variants={itemVariants}>
                                <motion.button
                                    type="submit"
                                    className="w-full px-6 py-4 rounded-full text-white font-bold text-lg shadow-lg flex items-center justify-center"
                                    variants={buttonVariants}
                                    initial="rest"
                                    whileHover="hover"
                                    animate="rest"
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing In...
                                        </>
                                    ) : (
                                        isHovered ? "Let's Go! 🚀" : "Sign In"
                                    )}
                                </motion.button>
                            </motion.div>

                            <motion.div
                                className="text-center text-gray-600"
                                variants={itemVariants}
                            >
                                Don't have an account?{' '}
                                <Link to="/register" className="text-[#46D3E5] font-medium hover:underline">
                                    Sign up
                                </Link>
                            </motion.div>

                            <motion.div
                                className="flex items-center my-6"
                                variants={itemVariants}
                            >
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="mx-4 text-gray-500">or</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </motion.div>

                            <motion.div
                                className="grid grid-cols-2 gap-4"
                                variants={itemVariants}
                            >
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.786-1.667-4.167-2.698-6.735-2.698-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                    </svg>
                                    Facebook
                                </button>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </motion.div>
            </main>
        </Layout>
    );
}