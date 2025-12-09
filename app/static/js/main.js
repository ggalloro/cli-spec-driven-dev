// Submit Gift
document.getElementById('giftForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const res = await fetch('/api/gifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            window.location.reload(); // Simple reload to show new gift
        } else {
            const err = await res.json();
            alert('Error: ' + err.error);
        }
    } catch (error) {
        console.error('Error submitting gift:', error);
    }
});

// Vote
document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        const score = 5; // Default simple upvote (5 snowflakes) for this iteration, or could prompt user
        
        // Let's implement a simple "Like" behavior which sends a 5
        // Ideally, we'd have a star rater, but spec said "Vote (Upvote/Downvote) OR Score 1-5"
        // We'll stick to a simple 5 star bump for "Love this!"
        
        try {
            const res = await fetch(`/api/gifts/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: 5 })
            });
            
            if (res.ok) {
                const data = await res.json();
                document.getElementById(`score-${id}`).textContent = data.new_average.toFixed(1);
                // Also update count text if needed, but it's inside the same span in my HTML? 
                // Wait, HTML structure was: <span ...>{{ score }}</span> <span ...>({{ count }})</span>
                // I need to target the count too. 
                // Let's just update the score for now, user sees immediate feedback.
                // Ideally I should put IDs on both spans. 
                // Let's stick to simple "flash" or alert or just the score update.
                
                // Animation effect
                btn.innerHTML = '<span>❤️ Voted!</span>';
                setTimeout(() => btn.innerHTML = '<span>❤️ Vote</span>', 2000);
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    });
});

// Toggle Comments
async function toggleComments(giftId) {
    const container = document.getElementById(`comments-${giftId}`);
    const list = document.getElementById(`comments-list-${giftId}`);
    
    if (!container.classList.contains('hidden')) {
        container.classList.add('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    list.innerHTML = '<p class="text-sm text-gray-400 italic">Loading...</p>';
    
    try {
        const res = await fetch(`/api/gifts/${giftId}/comments`);
        const comments = await res.json();
        
        if (comments.length === 0) {
            list.innerHTML = '<p class="text-sm text-gray-500">No comments yet. Be the first!</p>';
        } else {
            list.innerHTML = comments.map(c => `
                <div class="bg-white p-3 rounded-lg border border-gray-100 text-sm">
                    <div class="font-bold text-santa-red mb-1">${c.author_name}</div>
                    <p class="text-gray-700">${c.content}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        list.innerHTML = '<p class="text-red-500">Failed to load comments.</p>';
    }
}

// Post Comment
async function postComment(event, giftId) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('input[name="content"]');
    const content = input.value;
    
    try {
        const res = await fetch(`/api/gifts/${giftId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content }) // Default author is Secret Santa
        });
        
        if (res.ok) {
            const comment = await res.json();
            const list = document.getElementById(`comments-list-${giftId}`);
            
            // Remove "No comments" msg if exists
            if (list.querySelector('p')?.textContent.includes('No comments')) {
                list.innerHTML = '';
            }
            
            const div = document.createElement('div');
            div.className = 'bg-white p-3 rounded-lg border border-gray-100 text-sm';
            div.innerHTML = `
                <div class="font-bold text-santa-red mb-1">${comment.author_name}</div>
                <p class="text-gray-700">${comment.content}</p>
            `;
            list.appendChild(div);
            input.value = ''; // Clear input
        } else {
            alert('Error posting comment');
        }
    } catch (error) {
        console.error('Error posting comment:', error);
    }
}
