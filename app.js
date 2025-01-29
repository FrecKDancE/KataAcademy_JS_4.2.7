const searchInput = document.getElementById('search')
const autocompleteList = document.getElementById('autocomplete-list')
const repoList = document.getElementById('repo-list')
let selectedRepos = []

function debounce(func, delay) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), delay)
    }
}

async function fetchRepos(query) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
    const data = await response.json()
    return data.items || []
}

function displayAutocomplete(repos) {
    autocompleteList.innerHTML = ''
    repos.forEach(repo => {
        const item = document.createElement('div')
        item.className = 'autocomplete-item'
        item.textContent = repo.name
        item.onclick = () => addRepo(repo)
        autocompleteList.appendChild(item)
    })
}

function addRepo(repo) {
    if (!selectedRepos.some(r => r.full_name === repo.full_name)) {
        selectedRepos.push(repo)
        updateRepoList()
    }
    searchInput.value = ''
    autocompleteList.innerHTML = ''
}

function updateRepoList() {
    repoList.innerHTML = ''
    selectedRepos.forEach(repo => {
        const item = document.createElement('div')
        item.className = 'repo-item'
        item.innerHTML = `
            <span>${repo.name} (Owner: ${repo.owner.login}, Stars: ${repo.stargazers_count})</span>
            <span class="remove-button" onclick="removeRepo('${repo.full_name}')">Удалить</span>
        `
        repoList.appendChild(item)
    })
}

function removeRepo(repoFullName) {
    selectedRepos = selectedRepos.filter(repo => repo.full_name !== repoFullName)
    updateRepoList()
}

searchInput.addEventListener('input', debounce(async () => {
    const query = searchInput.value.trim()
    if (query) {
        const repos = await fetchRepos(query)
        displayAutocomplete(repos)
    } else {
        autocompleteList.innerHTML = '' 
    }
}, 300))