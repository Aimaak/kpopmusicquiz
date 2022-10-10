import $ from 'jquery';
import './check';

$(async function () {
    var answerDiv = document.getElementById('answer');
    var guessInput = document.getElementById('guess');
    var playBtn = document.getElementById('play-btn');
    var preAnswerDiv = document.getElementById('pre-answer');
    var tracks = await
        $.ajax({
            url: '/songs/get',
            type: 'POST',
            success: function (data, status) {
                return data;
            },
            error: function (error) {
                console.log('Ajax request failed: ' + error);
                return false;
            }
        });
    var tracksCopy = tracks;

    if (!tracks || tracks.length == 0) {
        return console.log('failed to get songs');
    }

    console.log(tracks);

    playBtn.addEventListener('click', startGame);

    function startGame() {
        let firstSongIndex = Math.floor(Math.random() * tracks.length);
        playSong(firstSongIndex);
        playBtn.style.display = 'none';
    }

    function playSong(index) {
        var audio = new Audio(tracks[index].url);
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

        return playSong(Math.floor(Math.random() * tracks.length));
    }

    function endGame() {
        return console.log('Game has ended');
    }

    function displayAnswer(index) {
        preAnswerDiv.style.display = 'block';
        answer.innerText = tracks[index].artist.concat(' - ', tracks[index].title);

        return setTimeout(() => {
            preAnswerDiv.style.display = 'none';
            answer.innerText = '';
            playNextSong(index);
        }, 5000);
    }
})