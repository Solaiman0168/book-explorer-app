import BookService from './books.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Load books
    await BookService.fetchBooks();
    
    // Initialize UI
    initSearchAndFilter();
    renderBooks();
    renderGenreFilter();
    renderPagination();
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('genreFilter').addEventListener('change', handleGenreFilter);
});

function initSearchAndFilter() {
    // You could load previous search/filter from localStorage here
}

function renderBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    
    const books = BookService.getPaginatedBooks();
    
    if (books.length === 0) {
        bookList.innerHTML = '<p class="col-span-full text-center text-gray-500">No books found matching your criteria.</p>';
        return;
    }
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        bookList.appendChild(bookCard);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    
    const isWishlisted = BookService.isInWishlist(book.id);
    
    card.innerHTML = `
        <a href="book.html?id=${book.id}">
            <img src="${book.formats['image/jpeg'] || 'https://via.placeholder.com/300x450?text=No+Cover'}" 
                 alt="${book.title}" 
                 class="w-full h-64 object-cover">
        </a>
        <div class="p-4">
            <div class="flex justify-between items-start">
                <a href="book.html?id=${book.id}" class="hover:underline">
                    <h3 class="font-bold text-lg mb-2 line-clamp-2">${book.title}</h3>
                </a>
                <button class="wishlist-btn p-2 rounded-full ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500" 
                        data-id="${book.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <p class="text-gray-600 mb-2">${book.authors.map(a => a.name).join(', ')}</p>
            ${book.subjects ? `<div class="flex flex-wrap gap-1 mb-3">
                ${book.subjects.slice(0, 3).map(subject => 
                    `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${subject}</span>`
                ).join('')}
            </div>` : ''}
            <a href="book.html?id=${book.id}" class="text-blue-600 hover:underline">View Details</a>
        </div>
    `;
    
    // Add wishlist event listener
    const wishlistBtn = card.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const bookId = wishlistBtn.getAttribute('data-id');
        const isWishlisted = BookService.toggleWishlist(bookId);
        
        wishlistBtn.innerHTML = `<i class="fas fa-heart ${isWishlisted ? 'text-red-500' : 'text-gray-400'}"></i>`;
    });
    
    return card;
}

function renderGenreFilter() {
    const genreFilter = document.getElementById('genreFilter');
    
    // Add all genres to the filter
    BookService.allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    const totalPages = BookService.getTotalPages();
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.className = 'px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50';
    prevBtn.disabled = BookService.currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (BookService.currentPage > 1) {
            BookService.currentPage--;
            renderBooks();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(prevBtn);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `px-4 py-2 mx-1 rounded ${BookService.currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        pageBtn.addEventListener('click', () => {
            BookService.currentPage = i;
            renderBooks();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.className = 'px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50';
    nextBtn.disabled = BookService.currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (BookService.currentPage < totalPages) {
            BookService.currentPage++;
            renderBooks();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(nextBtn);
}

function handleSearch(e) {
    const searchTerm = e.target.value;
    const genre = document.getElementById('genreFilter').value;
    BookService.filterBooks(searchTerm, genre);
    renderBooks();
    renderPagination();
}

function handleGenreFilter(e) {
    const genre = e.target.value;
    const searchTerm = document.getElementById('searchInput').value;
    BookService.filterBooks(searchTerm, genre);
    renderBooks();
    renderPagination();
}