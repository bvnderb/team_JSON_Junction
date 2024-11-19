// declare global variables and placeholders

const url = 'http://localhost:3000/kids';
const urlToys = 'http://localhost:3000/toys';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedoutput')

function fetchdata() {
    output.innerHTML = "";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(kids => {
                output.innerHTML += `
                <div class ="kids-item" id="kids-${kids.id}">
                    <span class="kids-content">${kids.kidname} ${kids.amountGifts} ${kids.location}</span>
                
                <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="${kids.name}">
                            <input type="number" class="edit-amount" value="${kids.amountGifts || 0}">
                            <input type="text" class="edit-location" value="${kids.location}">
                            <button class="smallbutton" onclick="saveEdit('${kids.id}')">Save</button>
                            <button class="smallbutton" onclick="cancelEdit('${kids.id}')">Close</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.kidname}', ${kids.amountGifts || 0}, '${kids.location}')">Save</button>
                            <button onclick="deletePost('${kids.id}')">Delete</button>
                        </div>
                </div>
                `;
            });
        })
        .catch(e => console.error('error fetching child:', e));
}

// Add new child
document.getElementById('addkid').addEventListener('click', () => {
    const newKid = {
        kidname: document.getElementById('kidname').value,
        amountGifts: document.getElementById('amountGifts').value,
        location: document.getElementById('location').value
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newKid)
    })
        .then(res => res.json())
        .then(() => {
            fetchdata();
            document.getElementById('kidname').value = "";
            document.getElementById('amountGifts').value = "";
            document.getElementById('location').value = "";

        })
        .catch(e => console.error("error adding kid.", e))
})


// Save post to localStorage
function saveToLocal(kidId, kidname, amountGifts, location) {
    try {
        const kid = {
            id: kidId,
            kidname: kidname,  
            amountGifts: amountGifts,
            location: location,
            timestamp: Date.now()  
        };

        
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        
        if (!savedPosts.some(k => k.id === kid.id)) {
            savedPosts.push(kid);
            localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
            loadSavedPosts();
        } else {
            alert('This kid is already saved!');
        }
    } catch (error) {
        console.error('Error saving child:', error);
    }
}

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

        // Sort saved posts by timestamp in descending order
        savedPosts.sort((a, b) => b.timestamp - a.timestamp);
        savedPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <span>${post.kidname} (${post.location}) (${post.amountGifts || 0})</span>
                <button onclick="removeFromSaved('${post.id}')">Remove</button>
            `;
            savedOutput.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading saved posts:', error);
        localStorage.setItem('savedPosts', '[]');
    }
}

// Delete post
function deletePost(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
        .then(() => fetchdata())
        .catch(e => console.error('Error deleting post:', e));
}

// Clear localStorage
document.getElementById('clearStorage').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved posts?')) {
        localStorage.removeItem('savedPosts');
        loadSavedPosts();
    }
});

function fetchtoy() {
    availableToys.innerHTML = "";
    fetch(urlToys)
        .then(res => res.json())
        .then(data => {
            const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
            sortedData.forEach(toys => {
                availableToys.innerHTML += `
                <div class ="available-toys" id="toys-${toys.id}">
                    <span class="available-toys">${toys.toyInput}</span>
                
                <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="${toys.toyInput}">
                        </div>
                </div>
                `;
            });
        })
        .catch(e => console.error('error fetching toy:', e));
}

// Add new child
document.getElementById('toyBtn').addEventListener('click', () => {
    const newToy = {
        kidname: document.getElementById('toyInput').value
    };

    fetch(urlToys, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(newToy)
    })
        .then(res => res.json())
        .then(() => {
            fetchdata();
            document.getElementById('toyInput').value = "";

        })
        .catch(e => console.error("error adding kid.", e))
})




fetchdata();
loadSavedPosts();
