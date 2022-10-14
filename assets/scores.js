let container = document.querySelector('div.container');

const displayScores = (scores) => {
    container.innerHTML = '';
    scores = Object.entries(scores).map((u) => ({
        player: u[0],
        points: u[1],
    }));

    createTable(scores);
    addPlayAgainButton();
}

const createTable = (scores) => {
    console.log('Scores');
    console.log(scores);
    let table = document.createElement('table');
    table.className = 'table is-fullwidth m-auto';

    let thead = table.createTHead();
    let rowHeader = thead.insertRow();
    let playerHeader = rowHeader.insertCell();
    let scoreHeader = rowHeader.insertCell();
    let headerPlayerText = document.createTextNode('Player');
    let headerScoreText = document.createTextNode('Points');

    rowHeader.className = 'is-selected';

    playerHeader.appendChild(headerPlayerText);
    scoreHeader.appendChild(headerScoreText);

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

export { displayScores };