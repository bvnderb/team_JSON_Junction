document.addEventListener('DOMContentLoaded', () => {
    fetchdata();
    fetchKids();
    loadSavedKids();
    fetchtoy();
});
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
                    <span class="kids-content">${kids.kidsName} ${kids.amountGifts} ${kids.location}</span>

                <select id="toyList" class="kids-item"><option>Toy selection</option></select>
                
                <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="${kids.kidsName}">
                            <input type="number" class="edit-amount" value="${kids.amountGifts || 0}">
                            <input type="text" class="edit-location" value="${kids.location}">
                            <button class="smallbutton" onclick="saveEdit('${kids.id}')">Save</button>
                            <button class="smallbutton" onclick="cancelEdit('${kids.id}')">Close</button>
                        </div>
                        <div class="button-group">
                            <button onclick="editPost('${kids.id}')">Edit</button>
                            <button onclick="saveToLocal('${kids.id}', '${kids.kidsName}', ${kids.amountGifts || 0}, '${kids.location}')">Save</button>
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
        kidsName: document.getElementById('kidsName').value,
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
            document.getElementById('kidsName').value = "";
            document.getElementById('amountGifts').value = "";
            document.getElementById('location').value = "";

        })
        .catch(e => console.error("error adding kid.", e))
})

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
            console.log(post)
            const postDiv = document.createElement('div');
            postDiv.className = 'post-item';
            postDiv.innerHTML = `
                <span>${post.name || 'Unknown Name'} (${post.amount || 0}) (${post.location || 'Unknown Location'})</span>
                <button onclick="removeFromSaved('${post.id}')">Remove</button>
            `;
            savedOutput.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error loading saved posts:', error);
        localStorage.setItem('savedPosts', '[]');
    }
}

// Save post to localStorage
function saveToLocal(kidId, kidname, amountGifts, location) {
    try {
        const kid = {
            id: kidId,
            name: kidname,  
            amount: amountGifts,
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
                    <span>${toys.toyname}</span>
                
                <div class="edit-form" style="display: none;">
                            <input type="text" class="edit-name" value="">
                        </div>

                        <button onclick="deletePost('${toys.id}')">X</button>
                </div>
                `;
            });
        })
        .catch(e => console.error('error fetching toy:', e));
}

// Add new toy
document.getElementById('toyBtn').addEventListener('click', () => {
    const newToy = {
        toyname: document.getElementById('toyInput').value
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
            document.getElementById('toyInput').value = "";
            fetchtoy();
            populateList();

        })
        .catch(e => console.error("error adding kid.", e))

})

function deletePost(toyId) {
    fetch(`${urlToys}/${toyId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error ('Failed to delete the toy');
        }
        return response.json();
    })
    .then(data => {
        console.log('Toy deleted:', data);

        const toyElement = document.getElementById(`toys-${toyId}`);
        if (toyElement) {
            toyElement.remove();
        }
    })
    .catch(error => {
        console.error('Error deleting toy:', error);
    });
}


function populateList(){
    const toyslist = [];
    fetch(urlToys)
    .then(res => res.json())
    .then(function(result){
        for(let i = 0; i<result.length; i++) {
            toyslist.push(result[i])
        }
        console.log(toyslist)
    })
    .catch();
}
// edit part
function editPost(id) {
    // Show edit form and hide content for the selected post
    const postDiv = document.getElementById(`kids-${id}`);
    postDiv.querySelector('.kids-content').style.display = 'none';
    postDiv.querySelector('.edit-form').style.display = 'block';
    postDiv.querySelector('.button-group').style.display = 'none';

}

function cancelEdit(id) {
    // Hide edit form and show content
    const postDiv = document.getElementById(`kids-${id}`);
    postDiv.querySelector('.kids-content').style.display = 'block';
    postDiv.querySelector('.edit-form').style.display = 'none';
    postDiv.querySelector('.button-group').style.display = 'block';
}

function saveEdit(id) {
    // Get the edited values
    const postDiv = document.getElementById(`kids-${id}`);
    console.log("Post Div:", postDiv); // Debugging
    const newName = postDiv.querySelector('.edit-name').value;
    const newAmount = parseInt(postDiv.querySelector('.edit-amount').value);
    const newLocation = postDiv.querySelector('.edit-location').value;
    console.log("New Name:", newName); // Debugging
    console.log("New Amount:", newAmount); // Debugging
    console.log("New Location:", newLocation); // Debugging

    // Create updated post object
    const updatedPost = {
        kidsName: newName,
        amountGifts: newAmount,
        location: newLocation,
        timestamp: Date.now() // Update timestamp
    };

    // Send PUT request to update the post
    fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
    })
    .then(res => res.json())
    .then(() => {
        // Refresh the posts display
        fetchdata();
    })
    .catch(e => console.error('Error updating post:', e));
}



