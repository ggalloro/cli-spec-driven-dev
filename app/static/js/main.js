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

// Vote (Event Delegation)
document.addEventListener('click', async (e) => {
    if (e.target.closest('.vote-btn')) {
        const btn = e.target.closest('.vote-btn');
        const container = btn.closest('.vote-actions');
        const id = container.dataset.id;
        const score = parseInt(btn.dataset.score);
        
        try {
            const res = await fetch(`/api/gifts/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: score })
            });
            
            if (res.ok) {
                const data = await res.json();
                
                // Update score display
                const scoreDisplay = document.getElementById(`score-${id}`);
                if (scoreDisplay) {
                    scoreDisplay.textContent = data.new_average.toFixed(1);
                    // Update count as well (need to find the sibling span)
                    const countSpan = scoreDisplay.nextElementSibling;
                    if (countSpan) {
                         countSpan.textContent = `(${data.total_votes})`;
                    }
                }
                
                // Visual Feedback
                // Remove existing feedback if any
                container.querySelectorAll('.vote-feedback').forEach(el => el.remove());
                
                const feedback = document.createElement('span');
                feedback.className = 'vote-feedback text-xs text-santa-red font-bold ml-1 animate-pulse';
                feedback.innerText = 'Thanks!';
                container.appendChild(feedback);
                
                setTimeout(() => feedback.remove(), 2000);
            } else {
                alert('Error voting. Please try again.');
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    }
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