import $ from 'jquery';
import { checkArtistName, checkTrackName } from './check';

$(async function () {
    let answerDiv = document.getElementById('answer');
    let canAnswerArtist = false;
    let canAnswerTitle = false;
    let currentSongIndex;
    let guessInput = document.getElementById('guess');
    let playBtn = document.getElementById('play-btn');
    let preAnswerDiv = document.getElementById('pre-answer');
    let scores = 0;
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

    if (!tracks || tracks.length == 0) {
        return console.log('failed to get songs');
    }

    console.log(tracks);

    playBtn.addEventListener('click', startGame);

    function startGame() {
        currentSongIndex = Math.floor(Math.random() * tracks.length);
        playSong(currentSongIndex);
        playBtn.style.display = 'none';
    }

    function playSong(index) {
        let audio = new Audio(tracks[index].url);
        audio.play();
        canAnswerArtist = true;
        canAnswerTitle = true;

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
        return console.log('Game has ended');
    }

    function displayAnswer(index) {
        preAnswerDiv.style.display = 'block';
        answerDiv.innerText = tracks[index].artist.concat(' - ', tracks[index].title);
        guessInput.disabled = true;
        guessInput.value = '';

        return setTimeout(() => {
            preAnswerDiv.style.display = 'none';
            answerDiv.innerText = '';
            guessInput.disabled = false;
            playNextSong(index);
        }, 10000);
    }

    $('#guess-form').on('submit', function (event) {
        event.preventDefault();
        check();
        guessInput.value = '';
    });

    function check() {
        if (canAnswerArtist === true) {
            if (checkArtistName({ artistName: tracks[currentSongIndex].artist, msg: guessInput.value }) === true) {
                addScore(1);
                canAnswerArtist = false;
            }
        }
        if (canAnswerTitle === true) {
            if (checkTrackName({ trackName: tracks[currentSongIndex].title, msg: guessInput.value }) === true) {
                addScore(3);
                canAnswerTitle = false;
            }
        }
        console.log(scores);
    }

    function addScore(points) {
        scores += points;
    }
});