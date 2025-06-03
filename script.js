const btn = document.querySelector("#btn");
const userId = document.querySelector("#userId");
const content = document.querySelector('.content');
const loadingSpinner = document.querySelector('.loading-spinner');
const errorMessage = document.querySelector('.error-message');

// Add enter key support
userId.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        datacome();
    }
});

btn.addEventListener('click', (event) => {
    event.preventDefault();
    datacome();
});

function showLoading() {
    loadingSpinner.style.display = 'flex';
    content.innerHTML = '';
    errorMessage.style.display = 'none';
}

function showError() {
    loadingSpinner.style.display = 'none';
    errorMessage.style.display = 'flex';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function datacome() {
    if (!userId.value.trim()) {
        showError();
        return;
    }

    showLoading();

    async function getuserInfo(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error('User not found');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async function getUserRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=created&direction=desc&per_page=5`);
            if (!response.ok) throw new Error('Repos not found');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    Promise.all([getuserInfo(userId.value), getUserRepos(userId.value)])
        .then(([userData, repos]) => {
            loadingSpinner.style.display = 'none';
            
            content.innerHTML = `
                <div class="profile">
                    <div class="img">
                        <img src=${userData.avatar_url} alt="${userData.name}'s profile picture">
                    </div>
                    <div class="profile-info">
                        <h1>${userData.name || userData.login}</h1>
                        <p class="username">@${userData.login}</p>
                        ${userData.bio ? `<p class="bio">${userData.bio}</p>` : ''}
                        <div class="profile-stats">
                            <div class="stat">
                                <i class="fas fa-code-branch"></i>
                                <span>${userData.public_repos} Repos</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-users"></i>
                                <span>${userData.followers} Followers</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-user-friends"></i>
                                <span>${userData.following} Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="details">
                    <div class="repos">
                        <h2><i class="fas fa-book"></i> Latest Repositories</h2>
                        <ul id="repo-list">
                            ${repos.map(repo => `
                                <li class="repo-item">
                                    <div class="repo-header">
                                        <a href="${repo.html_url}" target="_blank" class="repo-name">
                                            <i class="fas fa-bookmark"></i> ${repo.name}
                                        </a>
                                        ${repo.language ? `
                                            <span class="repo-language">
                                                <span class="language-dot"></span>
                                                ${repo.language}
                                            </span>
                                        ` : ''}
                                    </div>
                                    <p class="repo-description">${repo.description || 'No description available'}</p>
                                    <div class="repo-meta">
                                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                        <span><i class="fas fa-calendar"></i> ${formatDate(repo.created_at)}</span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            showError();
            console.error('Error:', error);
        });
}




// Add this at the beginning of your script.js file
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

// Theme toggle function
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// ... rest of your existing JavaScript code ...