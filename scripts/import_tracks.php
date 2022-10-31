<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Entity\Track;
use SpotifyWebAPI\Session;
use SpotifyWebAPI\SpotifyWebAPI;

$env = getenv('APP_ENV') === 'dev' ? '.env.local' : '.env';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..', $env);
$dotenv->safeLoad();

$session = new Session(
    $_ENV['CLIENT_ID'],
    $_ENV['CLIENT_SECRET']
);

$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();

if (!is_string($accessToken)) {
    dump('failed to authenticate to Spotify API');
    return false;
}

$api = new SpotifyWebAPI();
$api->setAccessToken($accessToken);

$options = [
    'additional_types' => 'track',
    'fields' => 'tracks.total'
];

for ($i = 0; $i < 1000; $i += 100) {
    $limit = 100;
    $offset = $i;
    $options = [
        'fields' => 'items.track(album(images),artists,name,preview_url)',
        'limit' => $limit,
        'offset' => $offset
    ];
    $response = $api->getPlaylistTracks($_ENV['PLAYLIST_ID'], $options);

    $tracks = array_values(
        array_map(function ($t) {
            $track = new Track();
            $track->setOriginalArtist($t->track->artists[0]->name);
            $track->setArtist(cleanArtist($t->track->artists[0]->name));
            $track->setOriginalTitle($t->track->name);
            $track->setTitle(cleanTrack($t->track->name));
            $track->setUrl($t->track->preview_url);
            $track->setImageUrl($t->track->album->images[0]->url);

            return $track;
        }, array_filter($response->items, function ($t) {
            return !is_null($t->track->preview_url);
        }))
    );

    foreach ($tracks as $track) {
        insertTrack($track);
    }
}

/**
 * Clean an artist string
 *
 * @param string $str
 * @return string $cleaned
 */
function cleanArtist(string $str)
{
    $unwantedArray = ["(", ")", ".", "*", "'", "/", "!"];
    // $str = "(G)I-DLE";
    // $str = "B.A.P";

    $cleaned = str_replace($unwantedArray, "", $str);

    $cleaned = trim($cleaned);

    return $cleaned;
}

/**
 * Clean a track string
 *
 * @param string $str
 * @return string $cleaned
 */
function cleanTrack(string $str)
{
    $unwantedArray = array(
        'Š' => 'S', 'š' => 's', 'Ž' => 'Z', 'ž' => 'z', 'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'A', 'Ç' => 'C', 'È' => 'E', 'É' => 'E',
        'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O', 'Ù' => 'U',
        'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ý' => 'Y', 'Þ' => 'B', 'ß' => 'Ss', 'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c',
        'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
        'ö' => 'o', 'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b', 'ÿ' => 'y'
    );
    // $str = "Oui아 왜 I Wait";
    // $str = "Trivia 轉 : Seesaw";
    // $str = "If ～また逢えたら～";
    // $str = "Peek-A-Boo";
    // $str = "Don't Wanna Cry";
    // $str = "Oh NaNa (Hidden. HUR YOUNG JI)";
    // $str = "아 왜 (I Wait)";
    // $str = "Up & Down";
    // $str = "I Am You, You Are Me";
    // $str = "無限的我 무한적아; LIMITLESS";
    // $str = "아 왜... I Wait (Sung by)";
    // $str = "WARNING!";
    // $str = "I.L.Y.";
    // $str = "POP/STARS";
    // $str = "DDU-DU DDU-DU - Remix";
    // $str = "Décalcomanie";
    // $str = "00:00 (Zero O'Clock)";
    // $str = "We Like 2 Party";
    // $str = "HOME;RUN";
    // $str = "LO$ER=LO♡ER";

    // Remove accented characters
    $cleaned = strtr($str, $unwantedArray);

    // Catch "(" or "[" and remove all the following characters
    $found = preg_match("/(\(|\[)/i", $cleaned, $matches, PREG_OFFSET_CAPTURE);
    if ($found === 1) {
        $index = $matches[0][1];
        $cleaned = substr($cleaned, 0, $index);
    }

    // Replace "&" by "and"
    $cleaned = str_replace('&', 'and', $cleaned);

    /**
     * Match a single character not present in the list below
     *
     * A-Z matches a single character in the range between A (index 65) and Z (index 90) (case insensitive)
     * a-z matches a single character in the range between a (index 97) and z (index 122) (case insensitive)
     * 0-9 matches a single character in the range between 0 (index 48) and 9 (index 57) (case insensitive)
     * \s matches any whitespace character (equivalent to [\r\n\t\f\v ])
     * \' matches the character ' with index 3910 (2716 or 478) literally (case insensitive)
     *
     * Replace a matched character by nothing (or "")
     */
    $cleaned = preg_replace('/[^A-Za-z0-9\s\']/i', ' ', $cleaned);

    // Replace multiple whitespaces by a single whitespace
    $cleaned = preg_replace('/\s+/', ' ', $cleaned);

    $cleaned = trim($cleaned);

    return $cleaned;
}

/**
 * Insert a track in database
 *
 * @param Track $track
 * @return int $pdo->lastInsertId()
 */
function insertTrack(Track $track)
{
    $pdo = getDbConnection();

    if ($pdo === false) return false;

    $sql = 'INSERT INTO track(artist,original_artist,title,original_title,url,image_url)'
        . ' VALUES(:artist,:original_artist,:title,:original_title,:url,:image_url)';
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':artist' => $track->getArtist(),
        ':original_artist' => $track->getOriginalArtist(),
        ':title' => $track->getTitle(),
        ':original_title' => $track->getOriginalTitle(),
        ':url' => $track->getUrl(),
        ':image_url' => $track->getImageUrl(),
    ]);

    return $pdo->lastInsertId();
}

/**
 * Connect to SQLite database
 *
 * @return mixed $pdo
 */
function getDbConnection(): mixed
{
    try {
        $pdo = new \PDO('sqlite:var/data.db');
    } catch (\PDOException $e) {
        dump($e->getMessage());
        return false;
    }

    return $pdo;
}
