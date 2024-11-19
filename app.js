
// declare global variables and placeholders

const url = 'http://localhost:3000/kids';
const output = document.getElementById('output');
const savedOutput = document.getElementById('savedoutput')

function fetchdata() {
    output.innerHTML="";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const sortedData = data.sort((a,b) => b.timestamp - a.timestamp);
            sortedData.forEach(kids => {
                output.innerHTML += `
                <div class ="kids-item" id="kids-${kids.id}">
                    <span class="kids-content">${kids.kidname} ${kids.amountGifts} ${kids.location}</span>
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


fetchdata();
loadSavedPosts();

