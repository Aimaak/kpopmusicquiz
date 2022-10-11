import $ from 'jquery';
import diacritics from 'diacritics';
import FuzzySet from 'fuzzyset';

$(async function () {
    var answerDiv = document.getElementById('answer');
    var currentSongIndex;
    var guessInput = document.getElementById('guess');
    var playBtn = document.getElementById('play-btn');
    var preAnswerDiv = document.getElementById('pre-answer');
    var tracks = await
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
    var tracksCopy = tracks;

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

        currentSongIndex = Math.floor(Math.random() * tracks.length);
        return playSong(currentSongIndex);
    }

    function endGame() {
        return console.log('Game has ended');
    }

    function displayAnswer(index) {
        preAnswerDiv.style.display = 'block';
        answerDiv.innerText = tracks[index].artist.concat(' - ', tracks[index].title);

        return setTimeout(() => {
            preAnswerDiv.style.display = 'none';
            answerDiv.innerText = '';
            playNextSong(index);
        }, 10000);
    }

    $('#guess-form').on('submit', function (event) {
        event.preventDefault();
        check();
    });

    function check() {
        console.log(checkArtistName({ artistName: tracks[currentSongIndex].artist, msg: guessInput.value }));
        console.log(checkTrackName({ trackName: tracks[currentSongIndex].title, msg: guessInput.value }));
    }

    const checkArtistName = ({ artistName, msg }) => {
        let checkA = cleanInput(artistName);
        let checkU = cleanInput(msg);

        const ref = FuzzySet([checkA]);
        const refResult = ref.get(checkU);

        if (!refResult || !refResult[0] || !refResult[0][0]) {
            return false;
        }

        const probability = refResult[0][0];

        return probability >= 0.9;
    };

    const checkTrackName = ({ trackName, msg }) => {
        let checkT = cleanInput(trackName);
        let checkU = cleanInput(msg);

        const ref = FuzzySet([checkT]);
        const refResult = ref.get(checkU);

        if (!refResult || !refResult[0] || !refResult[0][0]) {
            return false;
        }

        const probability = refResult[0][0];

        return probability >= 0.9;
    };

    const cleanInput = (str) => {
        str = str.toLowerCase().trim();
        str = str.replace(/\s{2,}/g, " ");
        str = str.replace(/(\'|\.)/g, " ");
        str = diacritics.remove(str);
        str = str.trim();

        return str;
    };
});