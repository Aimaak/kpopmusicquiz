import $ from 'jquery';
import { checkArtistName, checkTrackName } from './check';

$(async function () {
    let answerDiv = document.getElementById('answer');
    let canAnswerArtist = false;
    let canAnswerTitle = false;
    let currentSongIndex;
    let guessInput = document.getElementById('guess');
    let guessResult = document.getElementById('guess-result');
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
        return console.log('Game has ended');
    }

    function displayAnswer(index) {
        answerDiv.innerText = tracks[index].artist.concat(' - ', tracks[index].title);
        preAnswerDiv.style.display = 'block';
        guessInput.disabled = true;
        guessInput.value = '';
        guessResult.innerText = '';

        return setTimeout(() => {
            answerDiv.innerText = '';
            preAnswerDiv.style.display = 'none';
            guessInput.disabled = false;
            guessInput.style.borderColor = '#767676';
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
        let color = isRight ? '#00FF00' : '#FF0000';
        if (msg) {
            guessResult.innerText = msg;
        }
        if (isRight) {
            guessInput.style.borderColor = color;
        } else {
            guessInput.style.borderColor = color;
        }
    }
});