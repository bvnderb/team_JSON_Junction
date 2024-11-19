const url = 'http://localhost:3000/kids';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedOutput');

// Load saved posts from localStorage
function loadSavedPosts() {
    try {
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        savedOutput.innerHTML = '';

        if (savedPosts.length === 0) {
            const noPostsMessage = document.createElement('div');
            noPostsMessage.className = 'no-posts-message';
            noPostsMessage.textContent = 'No saved posts yet!';
            savedOutput.appendChild(noPostsMessage);
            return;
        }

        // sort saved posts by timestamp in descending order
        savedPosts.sort((a, b) => b.timestamp - a.timestamp);
        savedPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = ` 
            <span>${post.title} (${})
            
        });
    }
}