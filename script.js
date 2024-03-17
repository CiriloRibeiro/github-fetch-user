const searchInput = document.getElementById('searchInput');
const usernamesList = document.getElementById('usernamesList');
const getInfo = document.getElementById('btn-fetch');
let timeoutId;

searchInput.addEventListener('input', function(event) {
    const searchText = this.value.trim();
    
    // Check if the key pressed is the delete key (keyCode 8) or backspace key (keyCode 46)
    const isDeleteKey = event.keyCode === 8 || event.keyCode === 46;

    if (isDeleteKey) {
        clearTimeout(timeoutId); // Clear the timeout
        return; // Don't fetch if delete key is active
    }

    // Clear previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
        fetch(`https://api.github.com/search/users?q=${searchText}+in:login&per_page=5`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.items) {
                    throw new Error('Invalid data format or no items found');
                }
                displayUsernames(data.items);
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error);
            });
    }, 300); // Wait for 300ms after the user stops typing
});

function displayUsernames(usernames) {
    usernamesList.innerHTML = ''; // Clear previous results

    if (usernames.length === 0) {
        return;
    }

    usernames.forEach(user => {
        const option = document.createElement('option');
        option.value = user.login;
        usernamesList.appendChild(option);
    });
}

getInfo.addEventListener('click', () => {
    const user = searchInput.value.trim();
    const results = document.querySelector('.results');

    if (user.length > 0) {
        fetch(`https://api.github.com/users/${user}`)
            .then(res => res.json())
            .then(data => {

                if (data.message) {
                    alert('Please type a valid username');
                } else {
                    console.log(data);
                    results.innerHTML = `
                        <img class="mt-1 img-thumbnail" style="max-width: 40%; height: auto;" src="${data.avatar_url} my-2"></img>
                        
                        <div class="wrapper mt-3">
                            <h2 class="text-primary">${data.login}</h2>
                            <span><strong>Bio: </strong>${data.bio ? data.bio : 'Empty'}</span>
                            <span><strong>Site: </strong>${data.blog ? `<a href="${data.blog}">${data.blog}</a>` : 'Empty'}</span>
                            <span><strong>Github: </strong>${data.html_url ? `<a href="${data.html_url}">${data.html_url}</a>` : 'Empty'}</span>
                            <span><strong>Location: </strong>${data.location ? data.location : 'Empty'}</span>
                            <span><strong>Followers: </strong>${data.followers}</span>
                            <span><strong>Following: </strong>${data.following}</span>
                            <span><strong>Public Repos: </strong>${data.public_repos}</span>
                        </div>
                    `;
                }
            })
            .catch(error => {
                alert('Error fetching user data:', error);
            });
    } else {
        alert('Please type a valid username');
    }
});
