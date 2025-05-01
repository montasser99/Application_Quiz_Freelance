import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AuthLayout from "../Layout/AuthLayout";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    type: "technique",
    date_debut: "",
    date_fin: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/quizzes");
      setQuizzes(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Create or Update quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing quiz
        await axios.put(
          `http://localhost:8000/api/quizzes/${editingId}`,
          formData
        );
      } else {
        // Create new quiz
        await axios.post(
          "http://localhost:8000/api/quizzes",
          formData
        );
      }
      fetchQuizzes();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Edit quiz
  const handleEdit = (quiz) => {
    setFormData({
      nom: quiz.nom,
      type: quiz.type,
      date_debut: formatDateForInput(quiz.date_debut),
      date_fin: formatDateForInput(quiz.date_fin)
    });
    setEditingId(quiz.id);
    setIsModalOpen(true);
  };

  // Delete quiz
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      setError('le Quiz '+id+' ne peut pas etre supprimer car il a deja des questions et des affectations et des resultats');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nom: "",
      type: "technique",
      date_debut: "",
      date_fin: ""
    });
    setEditingId(null);
  };

  // Open modal for creating new quiz
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AuthLayout>
      <div className="pt-28 min-h-screen bg-gradient-to-r from-[#ececec] via-[#ffffff] to-[#eeeeee] px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Gestion des quiz</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
            >
              Add Quiz
            </motion.button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {quizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {quiz.nom}
                        </h2>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          quiz.type === 'technique' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {quiz.type}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-gray-500 text-sm">Start:</span>
                          <p className="text-gray-700">{formatDisplayDate(quiz.date_debut)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">End:</span>
                          <p className="text-gray-700">{formatDisplayDate(quiz.date_fin)}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(quiz)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(quiz.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#14111196] bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {editingId ? "Edit Quiz" : "Add New Quiz"}
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="nom"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Quiz Name
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label
                        htmlFor="type"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="technique">Technique</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label
                        htmlFor="date_debut"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="date_debut"
                        name="date_debut"
                        value={formData.date_debut}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label
                        htmlFor="date_fin"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="date_fin"
                        name="date_fin"
                        value={formData.date_fin}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {editingId ? "Update" : "Create"}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
}