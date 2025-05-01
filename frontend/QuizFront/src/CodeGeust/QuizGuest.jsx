import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

// Questions statiques pour le quiz
const STATIC_QUESTIONS = [
    {
        id: 1,
        question: "Quel élément HTML est utilisé pour le contenu principal d'une page ?",
        options: ["<main>", "<body>", "<section>", "<div>"],
        correctAnswer: "<main>",
        difficulty: "facile",
        points: 10,
        time: 30
    },
    {
        id: 2,
        question: "Quelle propriété CSS est utilisée pour changer la couleur du texte ?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: "color",
        difficulty: "facile",
        points: 10,
        time: 25
    },
    {
        id: 3,
        question: "Comment déclarer une variable en JavaScript qui ne peut pas être réaffectée ?",
        options: ["var", "let", "const", "static"],
        correctAnswer: "const",
        difficulty: "moyen",
        points: 15,
        time: 20
    },
    {
        id: 4,
        question: "Quelle méthode JavaScript permet d'ajouter un élément à la fin d'un tableau ?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: "push()",
        difficulty: "moyen",
        points: 15,
        time: 20
    },
    {
        id: 5,
        question: "Quel sélecteur CSS cible tous les éléments <p> qui sont des descendants directs d'un <div> ?",
        options: ["div p", "div > p", "div + p", "div ~ p"],
        correctAnswer: "div > p",
        difficulty: "difficile",
        points: 20,
        time: 15
    }
];

const QuizGuest = () => {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const email = decodeURIComponent(searchParams.get('email') || '');
    const navigate = useNavigate();

    // États du quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const currentQuestion = STATIC_QUESTIONS[currentQuestionIndex];
    const totalQuestions = STATIC_QUESTIONS.length;
    const totalPoints = STATIC_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;


    const [isListening, setIsListening] = useState(false);
    const [voiceAnswer, setVoiceAnswer] = useState('');
    const recognitionRef = useRef(null);

    // Initialiser la reconnaissance vocale
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setVoiceAnswer(transcript);
                checkVoiceAnswer(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Erreur de reconnaissance vocale:', event.error);
                setIsListening(false);
            };
        } else {
            console.warn('La reconnaissance vocale n\'est pas supportée par ce navigateur');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [currentQuestionIndex]);


    const checkVoiceAnswer = (transcript) => {
        // Trouver l'option qui correspond le mieux à la transcription
        const matchedOption = currentQuestion.options.find(option =>
            option.toLowerCase().includes(transcript.toLowerCase()) ||
            transcript.toLowerCase().includes(option.toLowerCase())
        );

        if (matchedOption) {
            setSelectedOption(matchedOption);
        }
    };

    const toggleVoiceRecognition = () => {
        if (!isListening) {
            setVoiceAnswer('');
            recognitionRef.current.start();
            setIsListening(true);
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let timer;
        if (quizStarted && !quizCompleted && timeLeft !== null && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleNextQuestion();
        }
        return () => clearInterval(timer);
    }, [quizStarted, quizCompleted, timeLeft]);

    const startQuiz = () => {
        setTimeLeft(STATIC_QUESTIONS[0].time);
        setQuizStarted(true);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        // Enregistrer la réponse
        const newAnswer = {
            question: currentQuestion.question,
            reponse: selectedOption,
            isCorrect: selectedOption === currentQuestion.correctAnswer,
            timeLeft: timeLeft
        };
        setUserAnswers([...userAnswers, newAnswer]);

        // Mettre à jour le score si correct
        if (selectedOption === currentQuestion.correctAnswer) {
            setScore(prev => prev + currentQuestion.points);
        }

        // Passer à la question suivante ou terminer
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setTimeLeft(STATIC_QUESTIONS[currentQuestionIndex + 1].time);
        } else {
            completeQuiz();
        }
    };

    const completeQuiz = () => {
        setQuizCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!quizStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#006674] to-[#3ab8c9] p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center"
                >
                    <h1 className="text-3xl font-bold text-[#006674] mb-4">Bienvenue au Quiz Invité</h1>
                    <p className="text-gray-600 mb-6">
                        Vous allez passer un quiz sur les technologies web avec {totalQuestions} questions.
                    </p>

                    <div className="mb-8 text-left space-y-4">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-[#46D3E5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Thèmes : HTML, CSS, JavaScript</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-[#46D3E5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Temps estimé : 2-3 minutes</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-[#46D3E5] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Score maximum : {totalPoints} points</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500">
                            Connecté en tant qu'invité : <span className="font-medium text-[#006674]">{email}</span>
                        </p>
                    </div>

                    <button
                        onClick={startQuiz}
                        className="w-full bg-gradient-to-r from-[#006674] to-[#3ab8c9] text-white py-3 px-6 rounded-xl hover:opacity-90 transition-opacity text-lg font-medium shadow-md"
                    >
                        Commencer le quiz
                    </button>
                </motion.div>
            </div>
        );
    }

    if (quizCompleted) {
        const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6f9fc] to-[#eef2f5] p-4 relative">
                {showConfetti && (
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                    />
                )}

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center"
                >
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-[#006674] mb-2">Quiz Terminé !</h1>
                    <p className="text-gray-600 mb-8">Merci d'avoir participé, {email.split('@')[0]} !</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800">Score</h3>
                            <p className="text-2xl font-bold text-blue-600">{score}/{totalPoints}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-purple-800">Réponses</h3>
                            <p className="text-2xl font-bold text-purple-600">{correctAnswers}/{totalQuestions}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-800">Taux de réussite</h3>
                            <p className="text-2xl font-bold text-green-600">{percentage}%</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-yellow-800">Code</h3>
                            <p className="text-xl font-bold text-yellow-600">{code}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gradient-to-r from-[#006674] to-[#3ab8c9] text-white py-3 px-6 rounded-xl hover:opacity-90 transition-opacity font-medium flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Retour à l'accueil
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6f9fc] to-[#eef2f5] p-4">
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <span className="text-sm font-medium text-gray-500">
                                Question {currentQuestionIndex + 1}/{totalQuestions}
                            </span>
                            <h2 className="text-xl font-bold text-[#006674]">Quiz Web Technologies</h2>
                        </div>
                        {timeLeft !== null && (
                            <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
                                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-bold text-red-500">{formatTime(timeLeft)}</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <div
                            className="bg-[#46D3E5] h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-6">
                            {currentQuestion.question}
                        </h3>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedOption === option
                                        ? 'border-[#46D3E5] bg-[#46D3E5]/10'
                                        : 'border-gray-200 hover:border-[#46D3E5]/50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedOption === option
                                            ? 'border-[#46D3E5] bg-[#46D3E5]'
                                            : 'border-gray-300'
                                            }`}>
                                            {selectedOption === option && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="font-medium">{option}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Ajoutez cette section pour la réponse vocale */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-700">Ou répondre par voix :</h4>
                                <button
                                    onClick={toggleVoiceRecognition}
                                    type="button"
                                    className={`flex items-center px-4 py-2 rounded-lg ${isListening
                                        ? 'bg-red-500 text-white'
                                        : 'bg-[#46D3E5] text-white'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                            Arrêter
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                            </svg>
                                            Répondre par voix
                                        </>
                                    )}
                                </button>
                            </div>

                            {voiceAnswer && (
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p className="text-gray-800">Vous avez dit : <span className="font-medium">{voiceAnswer}</span></p>
                                    {selectedOption && (
                                        <p className="text-sm mt-1">
                                            Sélectionné : <span className="font-medium text-[#006674]">{selectedOption}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {isListening && !voiceAnswer && (
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <p className="text-blue-800">Parlez maintenant...</p>
                                </div>
                            )}
                        </div>
                    </div>
       

                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Difficulté: <span className="font-medium capitalize">{currentQuestion.difficulty}</span> •
                        Points: <span className="font-medium">{currentQuestion.points}</span>
                    </div>
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedOption}
                        className={`px-6 py-2 rounded-lg font-medium ${selectedOption
                            ? 'bg-[#006674] text-white hover:bg-[#005566]'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant'}
                    </button>
                </div>
        </div>
            </motion.div >
        </div >
    );
};

export default QuizGuest;