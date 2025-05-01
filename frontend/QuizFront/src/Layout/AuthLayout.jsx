import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Assurez-vous d'importer useNavigate

export default function AuthLayout({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [isQuizMenuOpen, setIsQuizMenuOpen] = useState(false);
    const navigate = useNavigate(); // Utiliser useNavigate pour récupérer la fonction navigate

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-gray-100">
            {/* Navbar */}
            <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 lg:px-24 fixed z-50 border-b border-gray-100">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    {/* Logo/Brand */}
                    <motion.div
                        className="flex items-center space-x-3 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (user?.role === "ROLE_ADMIN") {
                                navigate('/admin'); // Utilisez navigate pour rediriger vers '/admin'
                            } else {
                                navigate('/home'); // Utilisez navigate pour rediriger vers '/home'
                            }
                        }}
                    >
                        <img src="/logo.png" alt="Wevioo Quiz Logo" className="h-10 w-10 object-contain" />
                        <span className="text-2xl text-[#006674] font-bold font-serif tracking-tight">
                            Wevioo Quiz
                        </span>
                    </motion.div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <NavLink
                            to={user?.role === "ROLE_ADMIN" ? "/admin" : "/home"}
                            className={({ isActive }) =>
                                `flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-[#46D3E5]/10 text-[#006674] font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-[#006674] font-medium"
                                }`
                            }
                        >
                            <span className="w-8 h-8 flex items-center justify-center bg-[#46D3E5]/20 rounded-full text-[#006674] font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </span>
                            <span>{user?.username}</span>
                        </NavLink>

                        {user?.role === "ROLE_USER" && (
                            <NavLink
                                to="/play"
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-[#46D3E5]/10 text-[#006674] font-semibold"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-[#006674] font-medium"
                                    }`
                                }
                            >
                                Play
                            </NavLink>
                        )}


                        {/* Quiz Dropdown Menu */}
                        {user?.role === "ROLE_ADMIN" && (
                            <div className="relative group">
                                <button
                                    onClick={() => setIsQuizMenuOpen(!isQuizMenuOpen)}
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#006674] font-medium transition-all duration-200"
                                >
                                    Managment
                                    <svg
                                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${isQuizMenuOpen ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Content */}
                                {isQuizMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                    >
                                        <NavLink
                                            to="/admin/quiz"
                                            end
                                            className={({ isActive }) =>
                                                `block px-4 py-2 text-gray-700 hover:bg-[#46D3E5]/10 hover:text-[#006674] ${isActive ? "bg-[#46D3E5]/10 text-[#006674]" : ""
                                                }`
                                            }
                                            onClick={() => setIsQuizMenuOpen(false)}
                                        >
                                            Quizzes
                                        </NavLink>
                                        <NavLink
                                            to="/admin/quiz/questions"
                                            end
                                            className={({ isActive }) =>
                                                `block px-4 py-2 text-gray-700 hover:bg-[#46D3E5]/10 hover:text-[#006674] ${isActive ? "bg-[#46D3E5]/10 text-[#006674]" : ""
                                                }`
                                            }
                                            onClick={() => setIsQuizMenuOpen(false)}
                                        >
                                            Affectation Questions
                                        </NavLink>
                                        <NavLink
                                            to="/admin/quiz/users"
                                            end
                                            className={({ isActive }) =>
                                                `block px-4 py-2 text-gray-700 hover:bg-[#46D3E5]/10 hover:text-[#006674] ${isActive ? "bg-[#46D3E5]/10 text-[#006674]" : ""
                                                }`
                                            }
                                            onClick={() => setIsQuizMenuOpen(false)}
                                        >
                                            Affectation Users
                                        </NavLink>
                                        <NavLink
                                            to="/admin/languages"
                                            end
                                            className={({ isActive }) =>
                                                `block px-4 py-2 text-gray-700 hover:bg-[#46D3E5]/10 hover:text-[#006674] ${isActive ? "bg-[#46D3E5]/10 text-[#006674]" : ""
                                                }`
                                            }
                                        >
                                            Languages
                                        </NavLink>
                                        <NavLink
                                            to="/admin/questions"
                                            className={({ isActive }) =>
                                                `block px-4 py-2 text-gray-700 hover:bg-[#46D3E5]/10 hover:text-[#006674] ${isActive ? "bg-[#46D3E5]/10 text-[#006674]" : ""
                                                }`
                                            }
                                        >
                                            Questions
                                        </NavLink>

                                    </motion.div>
                                )}
                            </div>
                        )}


                        <NavLink
                            to="/admin/historique"
                            end
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-[#46D3E5]/10 text-[#006674] font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-[#006674] font-medium"
                                }`
                            }
                        >
                            Historique
                        </NavLink>
                        <NavLink
                            to="/profile"
                            end
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-[#46D3E5]/10 text-[#006674] font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-[#006674] font-medium"
                                }`
                            }
                        >
                            Profile
                        </NavLink>


                        <NavLink
                            to="/login"
                            onClick={() => {
                                localStorage.removeItem("user");
                            }}
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 font-medium transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white py-4 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Wevioo Quiz. All rights reserved.
                </div>
            </footer>
        </div>
    );
}