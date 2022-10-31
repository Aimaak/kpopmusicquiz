import $ from 'jquery';
import { checkArtistName, checkTrackName } from './check';
import { displayScores, saveScores } from './scores';
import { Buffer } from 'buffer';

$(async function () {
  let answerDiv = document.getElementById('answer');
  let canAnswerArtist = false;
  let canAnswerTitle = false;
  let currentSongIndex;
  let guessInput = document.getElementById('guess');
  let guessResult = document.getElementById('guess-result');
  let image = document.getElementById('track-image');
  let playBtn = document.getElementById('play-btn');
  let scores = {};
  let trackCounter = 1;
  let trackCounterSpan = document.getElementById('track-counter');
  let tracksLengthSpan = document.getElementById('tracks-length');
  let tracks = await
    $.ajax({
      url: '/songs/get',
      type: 'GET',
      success: function (data) {
        return data;
      },
      error: function (error) {
        console.log('Ajax request failed: ' + error);
        return false;
      }
    });
  let username;
  let usernameInput = document.getElementById('username');
  usernameInput.onkeypress = clsAlphaNoOnly;
  let buf = new Buffer.from(tracks, 'base64');
  tracks = JSON.parse(buf.toString('utf-8'));
  const tracksLength = tracks.length;

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
    audio.volume = 0.3;
    audio.play();

    audio.addEventListener('ended', function () {
      displayAnswer(index);
    });

    updateTrackCounter();
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
    saveScores(scores, tracksLength);
    return displayScores(scores);
  }

  function displayAnswer(index) {
    answerDiv.innerText = 'The answer was: ' + tracks[index].originalArtist.concat(' - ', tracks[index].originalTitle);
    guessInput.disabled = true;
    guessInput.classList = '';
    guessInput.classList.add('input', 'is-large');
    guessInput.placeholder = 'Wait for next song';
    guessInput.value = '';
    guessResult.innerText = '';
    image.src = tracks[index].imageUrl;
    image.style.display = 'initial';

    return setTimeout(() => {
      answerDiv.innerText = '';
      guessInput.disabled = false;
      guessInput.placeholder = 'Guess the title and/or the artist';
      guessInput.focus();
      image.style.display = 'none';
      playNextSong(index);
    }, 10000);
  }

  $('#username-form').on('submit', function (event) {
    event.preventDefault();
    if (usernameInput.value == '') {
      usernameInput.classList.add('is-danger');
      return false;
    }
    username = usernameInput.value;
    document.getElementById('username-form').style.display = 'none';
    document.getElementById('guess-form').style.display = 'block';
    startGame();
  });

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

  function updateTrackCounter() {
    trackCounterSpan.innerText = trackCounter;
    tracksLengthSpan.innerText = '/' + tracksLength;
    trackCounter++;
  }

  function clsAlphaNoOnly(e) {  // Accept only alpha numerics, no special characters
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    const $notification = $delete.parentNode;

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification);
    });
  });
});
