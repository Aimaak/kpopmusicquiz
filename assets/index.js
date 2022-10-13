import $ from 'jquery';
import { checkArtistName, checkTrackName } from './check';

$(async function () {
    let answerDiv = document.getElementById('answer');
    let canAnswerArtist = false;
    let canAnswerTitle = false;
    let container = document.querySelector('div.container');
    let currentSongIndex;
    let guessInput = document.getElementById('guess');
    let guessResult = document.getElementById('guess-result');
    let playBtn = document.getElementById('play-btn');
    let scores = 0;
    let tracks = await
        $.ajax({
            url: '/songs/get',
            type: 'POST',
            success: function (data) {
                if (!data || data.length == 0) {
                    return console.log('failed to get songs');
                }
                return data;
            },
            error: function (error) {
                console.log('Ajax request failed: ' + error);
                return false;
            }
        });
    let tracksCopy = tracks;

    console.log(tracks);

    playBtn.addEventListener('click', startGame);

    function startGame() {
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
            console.log('no more tracks');
            return endGame();
        }

        currentSongIndex = Math.floor(Math.random() * tracks.length);
        return playSong(currentSongIndex);
    }

    function endGame() {
        container.innerHTML = '';
        return console.log('Game has ended');
    }

    function displayAnswer(index) {
        answerDiv.innerText = 'The answer was: ' + tracks[index].artist.concat(' - ', tracks[index].title);
        guessInput.disabled = true;
        guessInput.classList = '';
        guessInput.classList.add('input', 'is-large');
        guessInput.value = '';
        guessResult.innerText = '';

        return setTimeout(() => {
            answerDiv.innerText = '';
            guessInput.disabled = false;
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
                addScore(1);
                canAnswerArtist = false;
                guessInput.value = '';
                msg = 'You found the artist!';
                isRight = true;
            }
        }
        if (canAnswerTitle === true) {
            if (checkTrackName({ trackName: tracks[currentSongIndex].title, msg: guessInput.value }) === true) {
                addScore(3);
                canAnswerTitle = false;
                guessInput.value = '';
                msg = 'You found the title!';
                isRight = true;
            }
        }

        notifyUser(isRight, msg);
        console.log(scores);
    }

    function addScore(points) {
        scores += points;
    }

    function notifyUser(isRight, msg) {
        console.log(isRight, msg);
        if (msg) {
            guessResult.innerText = msg;
        }
        if (isRight) {
            guessInput.classList.add('is-success');
        } else {
            guessInput.classList.add('is-danger');
        }
    }
});