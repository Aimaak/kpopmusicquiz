<?php

namespace App\Controller;

use Doctrine\Persistence\ManagerRegistry;
use SpotifyWebAPI\Session;
use SpotifyWebAPI\SpotifyWebAPI;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        $session = new Session(
            $this->getParameter('app.client_id'),
            $this->getParameter('app.client_secret')
        );

        $session->requestCredentialsToken();
        $accessToken = $session->getAccessToken();

        if (is_string($accessToken)) {
            $api = new SpotifyWebAPI();
            $api->setAccessToken($accessToken);

            $options = [
                'additional_types' => 'track',
                'fields' => 'tracks.total'
            ];
            $totalTracks = $api->getPlaylist($this->getParameter('app.playlist_id'), $options)->tracks->total;

            $options = [
                'fields' => 'items.track(album(images),artists,duration_ms,name,preview_url)',
                'limit' => 20,
                'offset' => $totalTracks-100
            ];
            $response = $api->getPlaylistTracks($this->getParameter('app.playlist_id'), $options);

            $tracks = array_filter($response->items, function($t) {
                return !is_null($t->track->preview_url);
            });
        }

        return $this->render('home/index.html.twig', [
            'tracks' => $tracks
        ]);
    }
}
