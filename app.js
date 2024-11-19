
// declare global variables and placeholders

const url = 'http://localhost:3000/kids';
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
                            <button onclick="saveToLocal('${kids.id}', '${kids.name}', ${kids.amountGifts || 0}, ${kids.location}, ${kids.timestamp})">Save</button>
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
        amountGifts: document.getElementById("amountGifts").value,
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
            document.getElementById("kidname").value = "";
        })
        .catch(e => console.error("error adding kid."))
})

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

fetchdata();
loadSavedPosts();

