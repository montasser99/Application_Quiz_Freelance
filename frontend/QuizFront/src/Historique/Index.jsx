import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthLayout from '../Layout/AuthLayout';

const Index = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        role: 'ROLE_USER',
        userId: '',
        quizName: '',
        dateFrom: '',
        dateTo: ''
    });
    const [expandedAttempt, setExpandedAttempt] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    const [currentUserRole, setCurrentUserRole] = useState(user.role);

    // Fetch user role on component mount (you might get this from your auth context)
    useEffect(() => {
        // This is a placeholder - replace with your actual role fetching logic
        const fetchUserRole = async () => {
            try {
                // const response = await axios.get('/api/user/role');
                // setCurrentUserRole(response.data.role);
                setCurrentUserRole(user.role); // Default for demo
            } catch (err) {
                console.error('Error fetching user role:', err);
            }
        };
        fetchUserRole();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            let requestBody = {};

            if (currentUserRole === 'ROLE_ADMIN') {
                requestBody = { role: 'ROLE_ADMIN' };
            } else {
                requestBody = {
                    role: 'ROLE_USER',
                    userId: user.id || null // Use null if no userId provided
                };
            }

            const response = await axios.post(
                'http://localhost:8000/actions/get_all_historique_user',
                requestBody
            );
            setHistory(response.data);
        } catch (err) {
            setError('Failed to fetch history data');
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [currentUserRole]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        fetchHistory();
    };

    const toggleAttemptDetails = (id) => {
        setExpandedAttempt(expandedAttempt === id ? null : id);
    };

    const filteredHistory = history.filter(attempt => {
        const matchesQuiz = filters.quizName ?
            attempt.quiz.nom.toLowerCase().includes(filters.quizName.toLowerCase()) : true;

        const matchesDate = () => {
            if (!filters.dateFrom && !filters.dateTo) return true;

            const attemptDate = new Date(attempt.dateCreation);
            const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
            const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

            if (fromDate && toDate) {
                return attemptDate >= fromDate && attemptDate <= toDate;
            } else if (fromDate) {
                return attemptDate >= fromDate;
            } else if (toDate) {
                return attemptDate <= toDate;
            }
            return true;
        };

        return matchesQuiz && matchesDate();
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculatePercentage = (correctAnswers) => {
        const [correct, total] = correctAnswers.split('/').map(Number);
        return total > 0 ? Math.round((correct / total) * 100) : 0;
    };

    return (
        <AuthLayout>
            <div className="container mx-auto px-4 py-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-800 mb-8"
                >
                    Quiz Attempt History
                </motion.h1>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-lg shadow p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Name</label>
                            <input
                                type="text"
                                name="quizName"
                                placeholder="Search by quiz name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.quizName}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                            <input
                                type="date"
                                name="dateFrom"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.dateFrom}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                            <input
                                type="date"
                                name="dateTo"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={filters.dateTo}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>


                </motion.div>

                {/* Loading and Error States */}
                {loading && (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* History List */}
                {!loading && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {filteredHistory.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-700">No quiz attempts found</h3>
                                <p className="mt-1 text-gray-500">Try adjusting your filters or complete some quizzes</p>
                            </div>
                        ) : (
                            filteredHistory.map(attempt => (
                                <motion.div
                                    key={attempt.id}
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-lg shadow overflow-hidden"
                                >
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => toggleAttemptDetails(attempt.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{attempt.user.username}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(attempt.dateCreation)} • {attempt.quiz.nom}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-center">
                                                    <span className="block text-2xl font-bold text-blue-600">
                                                        {attempt.scorePoints}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Points</span>
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-2xl font-bold text-green-600">
                                                        {calculatePercentage(attempt.correctAnswers)}%
                                                    </span>
                                                    <span className="text-xs text-gray-500">Correct</span>
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: expandedAttempt === attempt.id ? 180 : 0 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedAttempt === attempt.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-gray-200"
                                        >
                                            <div className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Quiz Info */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Quiz Information</h4>
                                                        <div className="space-y-2">
                                                            <p><span className="text-gray-600">Total Questions:</span> {attempt.quiz.nb_question}</p>
                                                            <p><span className="text-gray-600">Total Points:</span> {attempt.quiz.points_total}</p>
                                                            <p><span className="text-gray-600">Date Range:</span> {formatDate(attempt.quiz.date_debut)} - {formatDate(attempt.quiz.date_fin)}</p>
                                                            <p><span className="text-gray-600">Type:</span> {attempt.quiz.type}</p>
                                                        </div>
                                                    </div>

                                                    {/* Attempt Info */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2">Attempt Details</h4>
                                                        <div className="space-y-2">
                                                            <p><span className="text-gray-600">Correct Answers:</span> {attempt.correctAnswers}</p>
                                                            <p><span className="text-gray-600">Time Spent:</span> {attempt.user_time_total_selon_time_total}</p>
                                                            <p><span className="text-gray-600">Score:</span> {attempt.scorePoints} points</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* User Answers */}
                                                <div className="mt-6">
                                                    <h4 className="font-medium text-gray-700 mb-3">Question Breakdown</h4>
                                                    <div className="space-y-3">
                                                        {attempt.userAnswer.map((answer, index) => (
                                                            <div
                                                                key={index}
                                                                className={`p-3 rounded-lg border ${answer.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="font-medium text-gray-800">{answer.question}</p>
                                                                        <p className="text-sm mt-1">
                                                                            <span className="text-gray-600">Your answer:</span> {answer.reponse}
                                                                        </p>
                                                                        {!answer.correct && (
                                                                            <p className="text-sm mt-1">
                                                                                <span className="text-gray-600">Correct answer:</span> {answer.correctAnswer}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className={`px-2 py-1 rounded-full text-xs ${answer.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                            }`}>
                                                                            {answer.correct ? 'Correct' : 'Incorrect'}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {answer.time_user_quest}s
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </div>
        </AuthLayout>
    );
};

export default Index;