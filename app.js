const API_KEY = "c252ef2f118e418a8159e15118251bca";
const url = "https://newsapi.org/v2/everything?q=";

// Fetch default news on page load
window.addEventListener('load', () => fetchNews("India"));

// Scroll to top functionality
const goToTopButton = document.getElementById('go-to-top');

// Show button when scrolled down
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goToTopButton.style.display = "block"; // Show button
    } else {
        goToTopButton.style.display = "none"; // Hide button
    }
});

// Scroll to top when button is clicked
goToTopButton.addEventListener('click', () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// Fetch news when search button is clicked
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    if (query) fetchNews(query);
});

// Fetch news when navigation items are clicked
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const topic = event.currentTarget.getAttribute('data-topic');
        if (topic) fetchNews(topic);
    });
});

// Fetch news from API
async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apikey=${API_KEY}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Bind API data to the HTML template
function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardsContainer.innerHTML = '';  // Clear previous cards

    // Loop through articles and create cards
    articles.forEach(article => {
        if (!article.urlToImage) return; // Skip if no image is available

        const cardClone = newsCardTemplate.content.cloneNode(true);
        
        // Populate the card with article data
        const newsImage = cardClone.querySelector('img');
        newsImage.src = article.urlToImage || "https://via.placeholder.com/400x200";

        const newsTitle = cardClone.querySelector('#news-title');
        newsTitle.textContent = article.title || "No Title Available";

        const newsSource = cardClone.querySelector('#news-source');
        newsSource.textContent = article.source ? `${article.source.name} - ${new Date(article.publishedAt).toLocaleDateString()}` : "Unknown Source";

        const newsDesc = cardClone.querySelector('#news-desc');
        newsDesc.textContent = article.description || "No Description Available";

        // Link to the article on card click
        cardClone.querySelector('.card').addEventListener('click', () => {
            window.open(article.url, '_blank');
        });

        // Append the card to the container
        cardsContainer.appendChild(cardClone);
    });
}
