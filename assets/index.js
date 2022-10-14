import $ from 'jquery';
import { checkArtistName, checkTrackName } from './check';
import { displayScores } from './scores';

$(async function () {
    let answerDiv = document.getElementById('answer');
    let canAnswerArtist = false;
    let canAnswerTitle = false;
    let currentSongIndex;
    let guessInput = document.getElementById('guess');
    let guessResult = document.getElementById('guess-result');
    let playBtn = document.getElementById('play-btn');
    let scores = {};
    let tracks = await
        $.ajax({
            url: '/songs/get',
            type: 'POST',
            success: function (data) {
                return data;
            },
            error: function (error) {
                console.log('Ajax request failed: ' + error);
                return false;
            }
        });
    let tracksCopy = tracks;
    let username = 'You';

    console.log(tracks);

    playBtn.addEventListener('click', startGame);

    function startGame() {
        if (!tracks || tracks.length == 0) {
            return console.log('failed to get songs');
        }
        currentSongIndex = Math.floor(Math.random() * tracks.length);
        playBtn.style.display = 'none';
        playSong(currentSongIndex);
    }

    function playSong(index) {
        let audio = new Audio(tracks[index].url);
        canAnswerArtist = true;
        canAnswerTitle = true;
        audio.play();

        audio.addEventListener('ended', function () {
            displayAnswer(index);
        })
    }

    function playNextSong(index) {
        tracks.splice(index, 1);

        if (tracks.length == 0) {
            return endGame();
        }

        currentSongIndex = Math.floor(Math.random() * tracks.length);
        return playSong(currentSongIndex);
    }

    function endGame() {
        return displayScores(scores);
    }

    function displayAnswer(index) {
        answerDiv.innerText = 'The answer was: ' + tracks[index].artist.concat(' - ', tracks[index].title);
        guessInput.disabled = true;
        guessInput.classList = '';
        guessInput.classList.add('input', 'is-large');
        guessInput.placeholder = 'Wait for next song';
        guessInput.value = '';
        guessResult.innerText = '';

        return setTimeout(() => {
            answerDiv.innerText = '';
            guessInput.disabled = false;
            guessInput.placeholder = 'Guess the title and/or the artist';
            playNextSong(index);
        }, 10000);
    }

    $('#guess-form').on('submit', function (event) {
        event.preventDefault();
        check();
    });

    function check() {
        let isRight = false;
        let msg;

        if (canAnswerArtist === true) {
            if (checkArtistName({ artistName: tracks[currentSongIndex].artist, msg: guessInput.value }) === true) {
                addScore(username, 1);
                canAnswerArtist = false;
                guessInput.value = '';
                msg = 'You found the artist!';
                isRight = true;
            }
        }
        if (canAnswerTitle === true) {
            if (checkTrackName({ trackName: tracks[currentSongIndex].title, msg: guessInput.value }) === true) {
                addScore(username, 3);
                canAnswerTitle = false;
                guessInput.value = '';
                msg = 'You found the title!';
                isRight = true;
            }
        }

        notifyUser(isRight, msg);
    }

    function addScore(username, points) {
        if (scores.hasOwnProperty(username) === false) {
            scores[username] = 0;
        }
        scores[username] += points;
    }

    function notifyUser(isRight, msg) {
        if (msg) guessResult.innerText = msg;
        guessInput.classList = '';
        guessInput.classList.add('input', 'is-large');
        guessInput.classList.add(isRight ? 'is-success' : 'is-danger');
    }
});