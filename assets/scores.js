import $ from 'jquery';

let container = document.querySelector('div.container');

const displayScores = (scores) => {
  container.innerHTML = '';
  scores = Object.entries(scores).map((u) => ({
    player: u[0],
    points: u[1],
  }));

  let h2 = document.createElement('h2');
  h2.className = 'subtitle is-2 has-text-light';
  h2.innerHTML = 'Thanks for playing!';
  container.appendChild(h2);

  createTable(scores);
  addPlayAgainButton();
}

const createTable = (scores) => {
  let table = document.createElement('table');
  table.className = 'table is-fullwidth is-size-5 mx-auto mb-5';

  let tbody = table.createTBody();
  let rowHeader = tbody.insertRow();
  let playerHeader = rowHeader.insertCell();
  let scoreHeader = rowHeader.insertCell();
  let strongPlayerHeader = document.createElement("strong");
  let strongScoreHeader = document.createElement("strong");
  let headerPlayerText = document.createTextNode('Player');
  let headerScoreText = document.createTextNode('Points');

  strongPlayerHeader.appendChild(headerPlayerText);
  strongScoreHeader.appendChild(headerScoreText);
  playerHeader.appendChild(strongPlayerHeader);
  scoreHeader.appendChild(strongScoreHeader);

  scores.forEach((score) => {
    let row = table.insertRow();
    let playerCell = row.insertCell();
    let scoreCell = row.insertCell();
    let playerText = document.createTextNode(score.player);
    let scoreText = document.createTextNode(score.points);

    playerCell.appendChild(playerText);
    scoreCell.appendChild(scoreText);
  });
  container.appendChild(table);
}

const addPlayAgainButton = () => {
  let btn = document.createElement('button');
  btn.className = 'button is-primary is-large';
  btn.innerHTML = 'Play again!';
  btn.onclick = function () {
    window.location.reload();
  };
  container.appendChild(btn);
}

const saveScores = (scores, numberOfTracks) => {
  $.ajax({
    data: { scores: scores },
    dataType: 'json',
    type: 'POST',
    url: '/score/add?nb=' + numberOfTracks,
    success: function (data) {
      if (!data.success) {
        console.log('Failed add score');
        return false;
      }
      return true;
    },
    error: function (error) {
      console.log('Ajax request failed: ' + error);
      return false;
    }
  });
}

export { displayScores, saveScores };
