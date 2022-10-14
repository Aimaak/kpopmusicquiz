let container = document.querySelector('div.container');

const displayScores = (scores) => {
    container.innerHTML = '';
    scores = Object.entries(scores).map((u) => ({
        username: u[0],
        value: u[1],
    }));
    console.log('Scores');
    console.log(scores);

    let table = document.createElement('table');
    table.className = 'table is-fullwidth m-auto';

    let thead = table.createTHead();
    let rowHeader = thead.insertRow();
    let usernameHeader = rowHeader.insertCell();
    let scoreHeader = rowHeader.insertCell();
    let headerUsernameText = document.createTextNode('Player');
    let headerScoreText = document.createTextNode('Points');

    rowHeader.className = 'is-selected';

    usernameHeader.appendChild(headerUsernameText);
    scoreHeader.appendChild(headerScoreText);

    scores.forEach((score) => {
        let row = table.insertRow();
        let usernameCell = row.insertCell();
        let scoreCell = row.insertCell();
        let usernameText = document.createTextNode(score.username);
        let scoreText = document.createTextNode(score.value);

        usernameCell.appendChild(usernameText);
        scoreCell.appendChild(scoreText);
    });
    container.appendChild(table);
}

export { displayScores };