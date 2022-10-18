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
    table.className = 'table is-fullwidth is-size-5 m-auto';

    let thead = table.createTHead();
    let rowHeader = thead.insertRow();
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

}

export { displayScores };
