var btn = document.querySelector("#btn")
var userId = document.querySelector("#userId")
var content = document.querySelector('.content')

btn.addEventListener('click',(event)=>{
    event.preventDefault()
    datacome()
})

function datacome() {
    function getuserInfo(username) {
        return fetch(`https://api.github.com/users/${username}`).then((raw) => raw.json());
    }

    function getUserRepos(username) {
        return fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=5`)
            .then((raw) => raw.json());
    }

    getuserInfo(userId.value).then((data) => {
        content.innerHTML = `
            <div class="profile">
                <div class="img"><img src=${data.avatar_url} alt=""> </div>
                <h1>${data.name}</h1>
            </div>
            <div class="details">
                <h1>Total repo : ${data.public_repos}</h1>
                <h1>Total followers : ${data.followers}</h1>
                <h1>Total following : ${data.following}</h1>
                <div class="repos">
                    <h2>Latest 5 Repositories:</h2>
                    <ul id="repo-list"></ul>
                </div>
            </div>
        `;

        // Fetch and display latest 5 repos
        getUserRepos(userId.value).then((repos) => {
            const repoList = document.getElementById('repo-list');
            if (Array.isArray(repos) && repos.length > 0) {
                repos.forEach(repo => {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
                    repoList.appendChild(li);
                });
            } else {
                repoList.innerHTML = "<li>No repositories found.</li>";
            }
        });
    });
}