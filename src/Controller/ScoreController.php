<?php

namespace App\Controller;

use App\Entity\Score;
use App\Repository\ScoreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ScoreController extends AbstractController
{
    private ScoreRepository $repository;

    function __construct(ScoreRepository $repository)
    {
        $this->repository = $repository;
    }

    #[Route('/score', name: 'app_score')]
    public function index(): Response
    {
        return $this->render('score/index.html.twig', [
            'controller_name' => 'ScoreController',
        ]);
    }

    #[Route('/score/add', name: 'app_score_add')]
    public function add(Request $request): JsonResponse
    {
        $numberOfTracks = $request->get('nb');
        $scores = $request->get('scores');

        foreach ($scores as $player => $points) {
            // Find if current player already has a score with this number of tracks
            $score = $this->repository->findOneExistingScore($player, $numberOfTracks);
            // Create new score
            if (is_null($score)) {
                $score = new Score();
                $score->setPlayer($player);
                $score->setNumberOfTracks($numberOfTracks);
                $score->setPoints($points);
            }
            // Update player's score if current score is higher
            else {
                if ($points > $score->getPoints()) $score->setPoints($points);
            }

            $this->repository->save($score, true);
        }

        return new JsonResponse(['success' => true]);
    }
}
