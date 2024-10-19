// Select elements from the DOM
const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts-container');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');

// Load saved posts from localStorage
let posts = JSON.parse(localStorage.getItem('posts')) || [];

// Display existing posts
window.onload = displayPosts(posts);

// Event listener for the form submission
postForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    // Get form data
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const category = document.getElementById('post-category').value;

    // Create new post object
    const newPost = {
        title,
        content,
        category,
        likes: 0,
        comments: []
    };

    // Add the new post to the posts array and save to localStorage
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Display the post
    displayPosts(posts);

    // Clear form
    postForm.reset();
});

// Display posts
function displayPosts(posts) {
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        const postElement = document.createElement('div');

        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><strong>Category:</strong> ${post.category}</p>
            <p><strong>Likes:</strong> <span id="like-count-${index}">${post.likes}</span></p>
            <button class="like-button" onclick="likePost(${index})">Like</button>
            <button class="commButton" onclick="toggleComments(${index})">Show Comment</button>
            <div  id="comments-section-${index}" class="comments-section hidden" >
                <h4>Comments:</h4>
                <ul class="comments-list" id="comments-list-${index}">
                    ${post.comments.map(comment => `<li>${comment}</li>`).join('')}
                </ul>
                <input type="text" class="comment-input" placeholder="Write a comment" id="comment-input-${index}">
                <button onclick="submitComment(${index})">Submit</button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

//hidden - displace comment section
function toggleComments(index) {
    const commentsSection = document.getElementById(`comments-section-${index}`);
    const commButton = document.querySelector(`button.comment-toggle[data-index="${index}"]`);

    if (commentsSection) {
        // Toggle the visibility of the comment section
        commentsSection.classList.toggle('hidden');

    } else {
        console.error(`Comment section with index ${index} not found.`);
    }
}


// Like post
function likePost(index) {
    posts[index].likes += 1;
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById(`like-count-${index}`).textContent = posts[index].likes;
}

// Submit comment
function submitComment(index) {
    const commentInput = document.getElementById(`comment-input-${index}`);
    const commentText = commentInput.value;
    if (commentText) {
        posts[index].comments.push(commentText);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts(posts);
    }
}

// Search posts
function searchPosts() {
    const query = searchBar.value.toLowerCase();
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));
    displayPosts(filteredPosts);
}

// Filter posts by category
function filterByCategory() {
    const selectedCategory = categoryFilter.value;
    const filteredPosts = selectedCategory === 'all'
        ? posts
        : posts.filter(post => post.category === selectedCategory);
    displayPosts(filteredPosts);
}
