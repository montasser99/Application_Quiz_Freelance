<?php

namespace App\Controller;

use App\Entity\Quiz;
use App\Repository\QuizRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/quizzes', name: 'api_quizzes_')]
class QuizController extends AbstractController
{
    private $em;
    private $quizRepository;

    public function __construct(EntityManagerInterface $em, QuizRepository $quizRepository)
    {
        $this->em = $em;
        $this->quizRepository = $quizRepository;
    }

    // Lister tous les quizzes
    #[Route('/', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $quizzes = $this->quizRepository->findAllActive();

        
        $data = array_map(function (Quiz $quiz) {
            return [
                'id' => $quiz->getId(),
                'nom' => $quiz->getNom(),
                'nb_question' => $quiz->getNbQuestion(),
                'points_total' => $quiz->getPointsTotal(),
                'type' => $quiz->getType(),
                'date_debut' => $quiz->getDateDebut()?->format('Y-m-d H:i:s'),
                'date_fin' => $quiz->getDateFin()?->format('Y-m-d H:i:s'),
                'date_creation' => $quiz->getDateCreation()?->format('Y-m-d H:i:s'),
            ];
        }, $quizzes);

        return $this->json($data);
    }

    // Récupérer un quiz par son ID
    #[Route('/{id}', name: 'get', methods: ['GET'])]
    public function getQuiz(int $id): JsonResponse
    {
        $quiz = $this->quizRepository->find($id);
        
        if (!$quiz) {
            return $this->json(['message' => 'Quiz not found'], 404);
        }
        
        return $this->json([
            'id' => $quiz->getId(),
            'nom' => $quiz->getNom(),
            'nb_question' => $quiz->getNbQuestion(),
            'points_total' => $quiz->getPointsTotal(),
            'type' => $quiz->getType(),
            'date_debut' => $quiz->getDateDebut()?->format('Y-m-d H:i:s'),
            'date_fin' => $quiz->getDateFin()?->format('Y-m-d H:i:s'),
            'date_creation' => $quiz->getDateCreation()?->format('Y-m-d H:i:s'),
        ]);
    }

    // Créer un quiz
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $quiz = new Quiz();
        $quiz->setNom($data['nom'] ?? null);
        $quiz->setNbQuestion(0);
        $quiz->setPointsTotal(0);
        $quiz->setType($data['type'] ?? null);
        $quiz->setDateCreation(new \DateTime());
        
        // Gestion des dates début/fin
        if (isset($data['date_debut'])) {
            $quiz->setDateDebut(new \DateTime($data['date_debut']));
        }
        if (isset($data['date_fin'])) {
            $quiz->setDateFin(new \DateTime($data['date_fin']));
        }

        $this->em->persist($quiz);
        $this->em->flush();

        return $this->json(['message' => 'Quiz created successfully'], 201);
    }

    // Mettre à jour un quiz
    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $quiz = $this->quizRepository->find($id);
        
        if (!$quiz) {
            return $this->json(['message' => 'Quiz not found'], 404);
        }
        
        $data = json_decode($request->getContent(), true);
        $quiz->setNom($data['nom'] ?? $quiz->getNom());
        $quiz->setNbQuestion($data['nb_question'] ?? $quiz->getNbQuestion());
        $quiz->setPointsTotal($data['points_total'] ?? $quiz->getPointsTotal());
        $quiz->setType($data['type'] ?? $quiz->getType());
        
        // Mise à jour des dates
        if (isset($data['date_debut'])) {
            $quiz->setDateDebut(new \DateTime($data['date_debut']));
        }
        if (isset($data['date_fin'])) {
            $quiz->setDateFin(new \DateTime($data['date_fin']));
        }
        if (isset($data['date_creation'])) {
            $quiz->setDateCreation(new \DateTime($data['date_creation']));
        }

        $this->em->flush();

        return $this->json(['message' => 'Quiz updated successfully']);
    }

    // Supprimer un quiz
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $quiz = $this->quizRepository->find($id);
    
        if (!$quiz) {
            return $this->json(['message' => 'Quiz not found'], 404);
        }
    
        // Soft delete
        $quiz->setDeleted(true); // Marquer comme supprimé sans supprimer la donnée
        $this->em->flush();
    
        return $this->json(['message' => 'Quiz soft-deleted successfully']);
    }
    
}