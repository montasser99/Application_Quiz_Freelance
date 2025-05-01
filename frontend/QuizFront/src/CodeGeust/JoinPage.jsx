import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VALID_CODE = "5@klpphr12";

export default function JoinPage() {
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        if (code === VALID_CODE) {
            setStep(2);
            setError("");
        } else {
            setError("Code invalide. Veuillez réessayer.");
        }
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (email.includes("@") && email.includes(".")) {
          // Nouvelle version avec query params
          navigate(`/quizguest/${code}?email=${encodeURIComponent(email)}`);
        } else {
          setError("Veuillez entrer une adresse email valide.");
        }
      };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#006674] p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#46D3E5] opacity-10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3ab8c9] opacity-10 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full filter blur-xl"></div>
            </div>

            {/* Floating bubbles animation */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 0, x: Math.random() * 100 }}
                    animate={{
                        y: [0, -100, -200, -300],
                        x: [Math.random() * 100, Math.random() * 100 + 50, Math.random() * 100],
                        opacity: [0.3, 0.6, 0.3, 0]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: '-50px'
                    }}
                />
            ))}

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-[#006674] to-[#3ab8c9] p-6 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            {step === 1 ? "Rejoindre le Quiz Wevioo" : "Presque là !"}
                        </h1>
                        <p className="text-white opacity-90 mt-2">
                            {step === 1 
                                ? "Entrez votre code d'accès unique" 
                                : "Un dernier détail pour commencer"}
                        </p>
                    </div>

                    <div className="p-8">
                        {step === 1 ? (
                            <form onSubmit={handleCodeSubmit} className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#46D3E5] focus:ring-2 focus:ring-[#46D3E5]/30 text-center font-medium placeholder-gray-400"
                                        placeholder="Entrez votre code ici"
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#006674] to-[#3ab8c9] text-white py-4 px-6 rounded-xl hover:opacity-90 transition-opacity text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Vérifier le code
                                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-6 py-5 text-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#46D3E5] focus:ring-2 focus:ring-[#46D3E5]/30 text-center font-medium placeholder-gray-400"
                                        placeholder="votre@email.com"
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                )}
                                
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Retour
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-[#006674] to-[#3ab8c9] text-white py-4 px-6 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        Commencer le quiz
                                        <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-gray-600 text-sm">
                                Vous n'avez pas de compte ?{' '}
                                <a href="/register" className="text-[#006674] font-medium hover:underline">
                                    S'inscrire maintenant
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-6 text-center text-white opacity-80 text-sm">
                    <p>Plateforme de quiz professionnelle Wevioo © {new Date().getFullYear()}</p>
                </div>
            </motion.div>
        </div>
    );
}