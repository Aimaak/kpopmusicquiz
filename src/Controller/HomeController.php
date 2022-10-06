<?php

namespace App\Controller;

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

            $limit = 50;
            $offset = rand(0, ($totalTracks - $limit));
            $options = [
                'fields' => 'items.track(album(images),artists,name,preview_url)',
                'limit' => $limit,
                'offset' => $offset
            ];
            $response = $api->getPlaylistTracks($this->getParameter('app.playlist_id'), $options);

            $tracks = array_values(
                array_map(function ($t) {
                    $t->artist = $t->track->artists[0]->name;
                    $t->image = new \stdClass();
                    $t->image->height = $t->track->album->images[0]->height;
                    $t->image->url = $t->track->album->images[0]->url;
                    $t->image->width = $t->track->album->images[0]->width;
                    $t->title = $t->track->name;
                    $t->url = $t->track->preview_url;

                    unset($t->track);

                    return $t;
                }, array_filter($response->items, function ($t) {
                    return !is_null($t->track->preview_url);
                }))
            );
        }

        return $this->render('home/index.html.twig', [
            'tracks' => $tracks
        ]);
    }
}
