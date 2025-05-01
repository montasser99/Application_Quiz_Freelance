<?php

namespace App\Controller;

use App\Entity\AffectUserQuiz;
use App\Entity\Langages;
use App\Entity\Question;
use App\Entity\Quiz;
use App\Entity\QuizQuestion;
use App\Entity\User;
use App\Entity\UserQuiz;
use App\Repository\AffectUserQuizRepository;
use App\Repository\QuestionRepository;
use App\Repository\QuizQuestionRepository;
use App\Repository\QuizRepository;
use App\Repository\UserQuizRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ActionsController extends AbstractController
{
    #[Route('/actions', name: 'app_actions')]
    public function index(): Response
    {
        return $this->render('actions/index.html.twig', [
            'controller_name' => 'ActionsController',
        ]);
    }

    #[Route('/actions/stats', name: 'app_actions_stats', methods: ['POST'])]
    public function stats(
        EntityManagerInterface $em,
        Request $request,
        UserRepository $userRepository
    ): JsonResponse {
        // Get data from request body
        $data = json_decode($request->getContent(), true);

        // Validate required fields
        if (!isset($data['role'])) {
            return $this->json(['error' => 'Missing role in request'], 400);
        }
        if (!isset($data['id'])) {
            return $this->json(['error' => 'Missing id in request'], 400);
        }

        $userId = $data['id'];
        $role = $data['role'];

        // Verify user exists
        $user = $userRepository->find($userId);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        // Check role and get appropriate stats
        if ($role === 'ROLE_ADMIN') {
            $stats = [
                'langages_count' => $em->getRepository(Langages::class)->count(['deleted' => false]),
                'users_count' => $em->getRepository(User::class)->count([]),
                'questions_count' => $em->getRepository(Question::class)->count(['deleted' => false]),
                'quizzes_count' => $em->getRepository(Quiz::class)->count(['deleted' => false]),
                'user_quiz_attempts_count' => $em->getRepository(UserQuiz::class)->count([]),
                'assigned_quizzes_count' => $em->createQueryBuilder()
                    ->select('COUNT(auq.id)')
                    ->from(AffectUserQuiz::class, 'auq')
                    ->join('auq.quiz', 'q')
                    ->where('q.deleted = false')
                    ->getQuery()
                    ->getSingleScalarResult(),
                    
            ];
        } else {
            // Initialize stats array for regular users
            $stats = [
                // Basics
                'langages_count' => $em->getRepository(Langages::class)->count([]),
                'assigned_quizzes_count' => $em->getRepository(AffectUserQuiz::class)->count(['user' => $userId]),

                // Quiz status
                'completed_quizzes_count' => $em->getRepository(AffectUserQuiz::class)->count([
                    'user' => $userId,
                    'status' => "completed"
                ]),
                'pending_quizzes_count' => $em->getRepository(AffectUserQuiz::class)->count([
                    'user' => $userId,
                    'status' => "pending"
                ]),

                // Performance
                'total_quiz_attempts' => $em->getRepository(UserQuiz::class)->count(['user' => $userId]),
                'average_score' => round($em->getRepository(UserQuiz::class)
                    ->createQueryBuilder('uq')
                    ->select('AVG(uq.scorePoints)')
                    ->where('uq.user = :user')
                    ->setParameter('user', $userId)
                    ->getQuery()
                    ->getSingleScalarResult() ?? 0, 2),
                'best_score' => $em->getRepository(UserQuiz::class)
                    ->createQueryBuilder('uq')
                    ->select('MAX(uq.scorePoints)')
                    ->where('uq.user = :user')
                    ->setParameter('user', $userId)
                    ->getQuery()
                    ->getSingleScalarResult(),
            ];

            // Recent activity - last attempt with questions
            $lastAttempt = $em->getRepository(UserQuiz::class)->findOneBy(
                ['user' => $userId],
                ['dateCreation' => 'DESC']
            );

            if ($lastAttempt) {
                $quiz = $lastAttempt->getQuiz();
                $questions = [];

                // Get all quiz questions
                $quizQuestions = $em->getRepository(QuizQuestion::class)->findBy(['quiz' => $quiz]);

                foreach ($quizQuestions as $quizQuestion) {
                    $question = $quizQuestion->getQuestion();
                    $language = $question->getLanguage();

                    $questions[] = [
                        'id' => $question->getId(),
                        'question' => $question->getQuestion(),
                        'options' => $question->getOptions(),
                        'correctAnswer' => $question->getCorrectAnswer(),
                        'difficulty' => $question->getDifficulty(),
                        'points' => $question->getPoints(),
                        'time' => $question->getTime(),
                        'language' => $language ? [
                            'id' => $language->getId(),
                            'nom' => $language->getNom(),
                            'icon' => $language->getIcon(),
                            'color' => $language->getColor()
                        ] : null
                    ];
                }

                $stats['last_attempt'] = [
                    'id' => $lastAttempt->getId(),
                    'user' => $lastAttempt->getUser(),
                    'userAnswer' => $lastAttempt->getUserAnswer(),
                    'quiz' => $quiz,
                    'questions' => $questions,
                    'scorePoints' => $lastAttempt->getScorePoints(),
                    'correctAnswers' => $lastAttempt->getCorrectAnswers(),
                    'dateCreation' => $lastAttempt->getDateCreation()
                ];
            }

            // Quizzes completed this month
            $stats['quizzes_completed_this_month'] = $em->getRepository(AffectUserQuiz::class)
                ->createQueryBuilder('auq')
                ->select('COUNT(auq.id)')
                ->where('auq.user = :user')
                ->andWhere('auq.status = :status')
                ->andWhere('auq.dateAffectation BETWEEN :start AND :end')
                ->setParameter('user', $userId)
                ->setParameter('status', 'completed')
                ->setParameter('start', new \DateTime('first day of this month'))
                ->setParameter('end', new \DateTime('last day of this month'))
                ->getQuery()
                ->getSingleScalarResult();
        }

        return $this->json($stats);
    }

    #[Route('/actions/assign-questions-to-quiz', name: 'app_assign_questions_to_quiz', methods: ['POST'])]
    public function assignQuestionsToQuiz(
        Request $request,
        EntityManagerInterface $em,
        QuizRepository $quizRepository,
        QuestionRepository $questionRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        if (!isset($data['quizId'])) {
            return $this->json(['error' => 'quizId manquant dans la requête'], 400);
        }
        if (!isset($data['questionIds']) || !is_array($data['questionIds'])) {
            return $this->json(['error' => 'questionIds manquant ou invalide dans la requête'], 400);
        }

        // Trouver le quiz
        $quiz = $quizRepository->find($data['quizId']);
        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        $addedQuestions = [];
        $alreadyAssignedQuestions = [];
        $totalNewPoints = 0;

        foreach ($data['questionIds'] as $questionId) {
            $question = $questionRepository->find($questionId);
            if (!$question) continue;

            // Vérifier si la relation existe déjà
            $existingRelation = $em->getRepository(QuizQuestion::class)->findOneBy([
                'quiz' => $quiz,
                'question' => $question
            ]);

            if ($existingRelation) {
                $alreadyAssignedQuestions[] = $questionId;
                continue;
            }

            // Créer la nouvelle relation
            $quizQuestion = new QuizQuestion();
            $quizQuestion->setQuiz($quiz);
            $quizQuestion->setQuestion($question);
            $em->persist($quizQuestion);

            $addedQuestions[] = $questionId;
            $totalNewPoints += $question->getPoints();
        }

        // Si aucune question ajoutée
        if (empty($addedQuestions)) {
            return $this->json([
                'message' => 'Aucune nouvelle question ajoutée. Toutes les questions sont déjà affectées.',
                'questions_deja_affectees' => $alreadyAssignedQuestions
            ]);
        }

        $em->flush(); // Enregistrer d'abord les nouvelles relations

        // Mettre à jour les points totaux **en recalculant**
        $relations = $em->getRepository(QuizQuestion::class)->findBy(['quiz' => $quiz]);
        $totalPoints = 0;
        foreach ($relations as $rel) {
            $totalPoints += $rel->getQuestion()->getPoints();
        }
        $quiz->setPointsTotal($totalPoints);

        // Mettre à jour le nombre de questions
        $quiz->setNbQuestion(count($relations));

        $em->flush(); // Enregistrer les mises à jour du quiz

        return $this->json([
            'message' => 'Affectation des questions terminée',
            'quiz_id' => $quiz->getId(),
            'questions_ajoutees' => $addedQuestions,
            'questions_deja_affectees' => $alreadyAssignedQuestions,
            'points_total' => $quiz->getPointsTotal(),
            'nb_question' => $quiz->getNbQuestion()
        ]);
    }

    #[Route('/actions/assign-quiz', name: 'app_assign_quiz', methods: ['POST'])]
    public function assignQuiz(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        QuizRepository $quizRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        if (!isset($data['userId']) || !isset($data['quizId'])) {
            return $this->json(['error' => 'userId ou quizId manquant dans la requête'], 400);
        }

        // Recherche des entités User et Quiz
        $user = $userRepository->find($data['userId']);
        $quiz = $quizRepository->find($data['quizId']);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        // Vérifier si cette affectation existe déjà
        $existing = $em->getRepository(AffectUserQuiz::class)->findOneBy([
            'user' => $user,
            'quiz' => $quiz
        ]);

        if ($existing) {
            return $this->json(['error' => 'Ce quiz est déjà affecté à cet utilisateur'], 400);
        }

        // Création de l'affectation
        $affectation = new AffectUserQuiz();
        $affectation->setUser($user);
        $affectation->setQuiz($quiz);

        $em->persist($affectation);
        $em->flush();

        return $this->json([
            'message' => 'Quiz affecté avec succès à l\'utilisateur',
            'assignmentId' => $affectation->getId()
        ], 201);
    }

    #[Route('/actions/unassign-quiz', name: 'app_unassign_quiz', methods: ['POST'])]
    public function unassignQuiz(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        QuizRepository $quizRepository,
        AffectUserQuizRepository $affectUserQuizRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        if (!isset($data['userId']) || !isset($data['quizId'])) {
            return $this->json(['error' => 'userId et quizId sont requis'], 400);
        }

        // Recherche des entités User et Quiz
        $user = $userRepository->find($data['userId']);
        $quiz = $quizRepository->find($data['quizId']);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        // Rechercher l'affectation existante
        $affectation = $affectUserQuizRepository->findOneBy([
            'user' => $user,
            'quiz' => $quiz
        ]);

        if (!$affectation) {
            return $this->json(['error' => 'Aucune affectation trouvée pour ce user et ce quiz'], 404);
        }

        // Suppression de l'affectation
        $em->remove($affectation);
        $em->flush();

        return $this->json([
            'message' => 'Quiz désaffecté avec succès',
            'deletedAssignmentId' => $affectation->getId(),
            'userId' => $user->getId(),
            'quizId' => $quiz->getId()
        ]);
    }

    #[Route('/actions/quiz-questions/{quizId}', name: 'app_get_questions_by_quiz', methods: ['GET'])]
    public function getQuestionsByQuizId(
        int $quizId,
        EntityManagerInterface $em,
        QuizRepository $quizRepository
    ): JsonResponse {
        // Récupérer le quiz
        $quiz = $quizRepository->find($quizId);
        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        // Récupérer toutes les relations QuizQuestion associées
        $quizQuestions = $em->getRepository(\App\Entity\QuizQuestion::class)->findBy(['quiz' => $quiz]);

        // Extraire les question_ids
        $questionIds = [];
        foreach ($quizQuestions as $relation) {
            $question = $relation->getQuestion();
            if ($question) {
                $questionIds[] = $question->getId();
            }
        }

        return $this->json([
            'quiz_id' => $quizId,
            'question_ids' => $questionIds
        ]);
    }


    #[Route('/actions/unissign-question-from-quiz/{idquiz}/{idquestion}', name: 'app_delete_question_from_quiz', methods: ['POST'])]
    public function deleteQuestionFromQuiz(
        int $idquiz,
        int $idquestion,
        EntityManagerInterface $em
    ): JsonResponse {
        // Rechercher l'entité QuizQuestion correspondante
        $quizQuestion = $em->getRepository(QuizQuestion::class)->findOneBy([
            'quiz' => $idquiz,
            'question' => $idquestion
        ]);

        if (!$quizQuestion) {
            return $this->json(['error' => 'Relation Quiz - Question non trouvée'], 404);
        }

        // Supprimer la relation
        $em->remove($quizQuestion);
        $em->flush();

        // Recalculer les points et nb_question du quiz
        $quiz = $quizQuestion->getQuiz();

        $relations = $em->getRepository(QuizQuestion::class)->findBy(['quiz' => $quiz]);
        $totalPoints = 0;
        foreach ($relations as $rel) {
            $totalPoints += $rel->getQuestion()->getPoints();
        }
        $quiz->setPointsTotal($totalPoints);
        $quiz->setNbQuestion(count($relations));
        $em->flush();

        return $this->json([
            'message' => 'Question supprimée du quiz avec succès',
            'quiz_id' => $quiz->getId(),
            'points_total' => $quiz->getPointsTotal(),
            'nb_question' => $quiz->getNbQuestion()
        ]);
    }

    #[Route('/actions/get_all_historique_user', name: 'test_get_all_user_quiz', methods: ['POST'])]
    public function getAllQuizUser(
        Request $request,
        UserQuizRepository $userQuizRepository,
        QuizQuestionRepository $quizQuestionRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des paramètres
        if (!isset($data['role'])) {
            return $this->json(['error' => 'Le paramètre role est requis'], 400);
        }

        // Récupération des historiques selon le rôle
        if ($data['role'] === 'ROLE_ADMIN') {
            // Admin: récupère tout l'historique
            $userQuizzes = $userQuizRepository->findBy([], ['dateCreation' => 'DESC']);
        } elseif ($data['role'] === 'ROLE_USER') {
            // User: récupère uniquement son historique
            if (!isset($data['userId'])) {
                return $this->json(['error' => 'userId est requis pour ROLE_USER'], 400);
            }
            $userQuizzes = $userQuizRepository->findBy(
                ['user' => $data['userId']],
                ['dateCreation' => 'DESC']
            );
        } else {
            return $this->json(['error' => 'Rôle non valide'], 400);
        }

        $formatted = [];

        foreach ($userQuizzes as $uq) {
            $quiz = $uq->getQuiz();

            // Récupérer toutes les questions du quiz
            $quizQuestions = $quizQuestionRepository->findBy(['quiz' => $quiz]);
            $totalQuestions = count($quizQuestions);

            $questionsData = [];
            $totalTime = 0;
            $userTotalTime = 0;

            // Créer une map des questions pour correspondance avec les réponses
            $questionsMap = [];
            foreach ($quizQuestions as $qq) {
                $question = $qq->getQuestion();
                $language = $question->getLanguage();
                $questionTime = $question->getTime();
                $totalTime += $questionTime ?? 0;

                // Normaliser le texte de la question pour la correspondance
                $normalizedQuestion = mb_strtolower(trim($question->getQuestion()));
                $questionsMap[$normalizedQuestion] = [
                    'id' => $question->getId(),
                    'correctAnswer' => $question->getCorrectAnswer(),
                    'originalQuestion' => $question->getQuestion(),
                    'questionTime' => $questionTime
                ];

                $questionsData[] = [
                    'id' => $question->getId(),
                    'question' => $question->getQuestion(),
                    'options' => $question->getOptions(),
                    'correctAnswer' => $question->getCorrectAnswer(),
                    'difficulty' => $question->getDifficulty(),
                    'points' => $question->getPoints(),
                    'time' => $questionTime,
                    'language' => $language ? [
                        'id' => $language->getId(),
                        'name' => $language->getNom(),
                        'description' => $language->getDescription(),
                        'icon' => $language->getIcon(),
                        'color' => $language->getColor()
                    ] : null
                ];
            }

            // Traitement des réponses utilisateur
            $userAnswers = $uq->getUserAnswer();
            $processedUserAnswers = [];

            if (is_array($userAnswers)) {
                foreach ($userAnswers as $answer) {
                    if (isset($answer['time_user_quest'])) {
                        $userTotalTime += (int)$answer['time_user_quest'];

                        // Normaliser la question de la réponse utilisateur
                        $userQuestion = mb_strtolower(trim($answer['question'] ?? ''));
                        $correctAnswer = '';
                        $isCorrect = false;
                        $originalQuestion = $answer['question'] ?? '';

                        // Trouver la question correspondante
                        if (isset($questionsMap[$userQuestion])) {
                            $questionData = $questionsMap[$userQuestion];
                            $correctAnswer = $questionData['correctAnswer'];
                            $originalQuestion = $questionData['originalQuestion'];

                            // Comparaison tolérante aux espaces et à la casse
                            $isCorrect = (mb_strtolower(trim($answer['reponse'])) === mb_strtolower(trim($correctAnswer)));
                        }

                        $processedAnswer = [
                            'reponse' => $answer['reponse'] ?? '',
                            'question' => $originalQuestion,
                            'time_user_quest' => $answer['time_user_quest'],
                            'correct' => $isCorrect,
                            'correctAnswer' => $correctAnswer,
                            'questionId' => $questionsMap[$userQuestion]['id'] ?? null
                        ];

                        $processedUserAnswers[] = $processedAnswer;
                    }
                }
            }

            $formatted[] = [
                'id' => $uq->getId(),
                'scorePoints' => $uq->getScorePoints(),
                'correctAnswers' => $uq->getCorrectAnswers() . '/' . $totalQuestions,
                'dateCreation' => $uq->getDateCreation()->format('Y-m-d H:i:s'),
                'user_time_total_selon_time_total' => $userTotalTime . '/' . $totalTime,
                'userAnswer' => $processedUserAnswers,
                'user' => [
                    'id' => $uq->getUser()->getId(),
                    'username' => $uq->getUser()->getUsername(),
                    'email' => $uq->getUser()->getEmail(),
                    'roles' => $uq->getUser()->getRoles(),
                ],
                'quiz' => [
                    'id' => $quiz->getId(),
                    'nom' => $quiz->getNom(),
                    'nb_question' => $quiz->getNbQuestion(),
                    'points_total' => $quiz->getPointsTotal(),
                    'date_debut' => $quiz->getDateDebut()?->format('Y-m-d H:i:s'),
                    'date_fin' => $quiz->getDateFin()?->format('Y-m-d H:i:s'),
                    'type' => $quiz->getType(),
                    'date_creation_quiz' => $quiz->getDateCreation()->format('Y-m-d H:i:s'),
                    'questions' => $questionsData,
                ]
            ];
        }

        return $this->json($formatted);
    }

    #[Route('/actions/create-history', name: 'app_create_history', methods: ['POST'])]
    public function creationHistorique(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        QuizRepository $quizRepository,
        AffectUserQuizRepository $affectUserQuizRepository // Ajout du repository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        $requiredFields = ['userId', 'quizId', 'scorePoints', 'correctAnswers', 'userAnswer'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return $this->json(['error' => "Le champ $field est requis"], 400);
            }
        }

        // Trouver l'utilisateur et le quiz
        $user = $userRepository->find($data['userId']);
        $quiz = $quizRepository->find($data['quizId']);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }
        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        // Créer un nouvel historique
        $userQuiz = new UserQuiz();
        $userQuiz->setUser($user);
        $userQuiz->setQuiz($quiz);
        $userQuiz->setScorePoints($data['scorePoints']);
        $userQuiz->setCorrectAnswers($data['correctAnswers']);
        $userQuiz->setUserAnswer($data['userAnswer']);
        $em->persist($userQuiz);

        // Mettre à jour l'AffectUserQuiz correspondant
        $affectation = $affectUserQuizRepository->findOneBy([
            'user' => $user,
            'quiz' => $quiz
        ]);

        if ($affectation) {
            $affectation->setStatus('completed');
            $em->persist($affectation);
        }

        $em->flush();

        return $this->json([
            'message' => 'Historique enregistré avec succès',
            'historyId' => $userQuiz->getId(),
            'userId' => $user->getId(),
            'quizId' => $quiz->getId(),
            'score' => $userQuiz->getScorePoints(),
            'date' => $userQuiz->getDateCreation()->format('Y-m-d H:i:s'),
            'affectationUpdated' => $affectation !== null
        ], 201);
    }


    #[Route('/actions/start-quiz', name: 'app_start_quiz', methods: ['POST'])]
    public function startQuiz(
        Request $request,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        QuizRepository $quizRepository,
        AffectUserQuizRepository $affectUserQuizRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des champs requis
        if (!isset($data['userId']) || !isset($data['quizId'])) {
            return $this->json(['error' => 'userId et quizId sont requis'], 400);
        }

        // Trouver l'utilisateur et le quiz
        $user = $userRepository->find($data['userId']);
        $quiz = $quizRepository->find($data['quizId']);

        if (!$user) {
            return $this->json(['error' => 'Utilisateur non trouvé'], 404);
        }
        if (!$quiz) {
            return $this->json(['error' => 'Quiz non trouvé'], 404);
        }

        // Trouver l'affectation existante
        $affectation = $affectUserQuizRepository->findOneBy([
            'user' => $user,
            'quiz' => $quiz
        ]);

        if (!$affectation) {
            return $this->json(['error' => 'Ce quiz n\'est pas affecté à cet utilisateur'], 400);
        }

        // Mettre à jour l'affectation
        $affectation->setNombrePassed($affectation->getNombrePassed() + 1);
        $affectation->setStatus('in progress');

        $em->persist($affectation);
        $em->flush();

        return $this->json([
            'message' => 'Quiz démarré avec succès',
            'affectationId' => $affectation->getId(),
            'nombrePassed' => $affectation->getNombrePassed(),
            'status' => $affectation->getStatus()
        ]);
    }


    #[Route('/actions/get-affected-quiz-by-user', name: 'app_get_affected_quiz_by_user', methods: ['POST'])]
    public function getAffectedQuizByUser(
        Request $request,
        AffectUserQuizRepository $affectUserQuizRepository,
        QuizQuestionRepository $quizQuestionRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validation des paramètres
        if (!isset($data['userId'])) {
            return $this->json(['error' => 'Le paramètre userId est requis'], 400);
        }


        // Récupérer les quiz affectés à l'utilisateur
        $affectedQuizzes = $affectUserQuizRepository->createQueryBuilder('a')
            ->innerJoin('a.quiz', 'q') // Joindre la table quiz
            ->where('a.user = :userId') // Filtrer par userId
            ->andWhere('a.status = :status') // Filtrer par status 'pending'
            ->andWhere('q.deleted = :deleted') // Ajouter la condition pour exclure les quiz supprimés
            ->setParameter('userId', $data['userId'])
            ->setParameter('status', 'pending')
            ->setParameter('deleted', false) // Seulement les quiz non supprimés
            ->getQuery()
            ->getResult();

        $formatted = [];

        foreach ($affectedQuizzes as $affectation) {
            $quiz = $affectation->getQuiz();

            // Récupérer toutes les questions du quiz avec leurs langages
            $quizQuestions = $quizQuestionRepository->findBy(['quiz' => $quiz]);
            $questionsData = [];

            foreach ($quizQuestions as $qq) {
                $question = $qq->getQuestion();
                $language = $question->getLanguage();

                $questionsData[] = [
                    'id' => $question->getId(),
                    'question' => $question->getQuestion(),
                    'options' => $question->getOptions(),
                    'correctAnswer' => $question->getCorrectAnswer(),
                    'difficulty' => $question->getDifficulty(),
                    'points' => $question->getPoints(),
                    'time' => $question->getTime(),
                    'language' => $language ? [
                        'id' => $language->getId(),
                        'name' => $language->getNom(),
                        'description' => $language->getDescription(),
                        'icon' => $language->getIcon(),
                        'color' => $language->getColor()
                    ] : null
                ];
            }

            $formatted[] = [
                'affectationId' => $affectation->getId(),
                'quiz' => [
                    'id' => $quiz->getId(),
                    'name' => $quiz->getNom(),
                    'totalQuestions' => $quiz->getNbQuestion(),
                    'totalPoints' => $quiz->getPointsTotal(),
                    'startDate' => $quiz->getDateDebut()?->format('Y-m-d H:i:s'),
                    'endDate' => $quiz->getDateFin()?->format('Y-m-d H:i:s'),
                    'type' => $quiz->getType(),
                    'questions' => $questionsData
                ],
                'dateAffectation' => $affectation->getDateAffectation()->format('Y-m-d H:i:s'),
                'attempts' => $affectation->getNombrePassed(),
                'status' => $affectation->getStatus()
            ];
        }

        return $this->json([
            'count' => count($formatted),
            'quizzes' => $formatted
        ]);
    }


    #[Route('/actions/get-all-affected-users', name: 'app_get_all_affected_users', methods: ['GET'])]
    public function getAllAffectedUsers(
        AffectUserQuizRepository $affectUserQuizRepository,
        QuizQuestionRepository $quizQuestionRepository
    ): JsonResponse {
        // Récupérer toutes les affectations triées par date
        $affectedQuizzes = $affectUserQuizRepository->createQueryBuilder('a')
            ->innerJoin('a.quiz', 'q') // Joindre la table quiz
            ->where('q.deleted = :deleted') // Ajouter la condition pour exclure les quiz supprimés
            ->setParameter('deleted', false) // Seulement les quiz non supprimés
            ->orderBy('a.dateAffectation', 'DESC') // Trier par dateAffectation
            ->getQuery()
            ->getResult();

        $formatted = [];

        foreach ($affectedQuizzes as $affectation) {
            $user = $affectation->getUser();
            $quiz = $affectation->getQuiz();

            // Récupérer les questions du quiz (simplifié pour la vue admin)
            $quizQuestions = $quizQuestionRepository->findBy(['quiz' => $quiz]);
            $questionsCount = count($quizQuestions);

            $formatted[] = [
                'affectationId' => $affectation->getId(),
                'user' => [
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                    'email' => $user->getEmail()
                ],
                'quiz' => [
                    'id' => $quiz->getId(),
                    'name' => $quiz->getNom(),
                    'totalQuestions' => $quiz->getNbQuestion(),
                    'totalPoints' => $quiz->getPointsTotal()
                ],
                'dateAffectation' => $affectation->getDateAffectation()->format('Y-m-d H:i:s'),
                'attempts' => $affectation->getNombrePassed(),
                'status' => $affectation->getStatus(),
                'quizDetails' => [
                    'startDate' => $quiz->getDateDebut()?->format('Y-m-d H:i:s'),
                    'endDate' => $quiz->getDateFin()?->format('Y-m-d H:i:s'),
                    'questionsCount' => $questionsCount
                ]
            ];
        }

        return $this->json([
            'count' => count($formatted),
            'affectations' => $formatted
        ]);
    }
}
