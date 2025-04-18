import StorageService from './storage.js';

const BookService = {
    currentPage: 1,
    booksPerPage: 12,
    allBooks: [],
    filteredBooks: [],
    allGenres: new Set(),
    
    // Fetch books from API
    fetchBooks: async function() {
        try {
            const response = await fetch('https://gutendex.com/books/');
            const data = await response.json();
            this.allBooks = data.results;
            this.filteredBooks = [...this.allBooks];
            
            // Extract all unique genres
            this.allBooks.forEach(book => {
                if (book.subjects) {
                    book.subjects.forEach(subject => this.allGenres.add(subject));
                }
            });
            
            return this.allBooks;
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    },
    

    filterBooks: function(searchTerm = '', genre = '') {
        this.filteredBooks = this.allBooks.filter(book => {
            const matchesSearch = searchTerm ? 
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                
            const matchesGenre = genre ? 
                (book.subjects && book.subjects.some(s => s.includes(genre))) : true;
                
            return matchesSearch && matchesGenre;
        });
        
        // Reset to first page when filtering
        this.currentPage = 1;
        
        return this.getPaginatedBooks();
    },


    init: async function() {
        await this.fetchBooks();
        
        // Load saved preferences
        const prefs = StorageService.getSearchPreferences();
        this.currentPage = prefs.page;
        
        // Apply saved filters
        if (prefs.searchTerm || prefs.genre) {
            this.filterBooks(prefs.searchTerm, prefs.genre);
        }
        
        return this.allBooks;
    },
    
    // Get paginated books
    getPaginatedBooks: function() {
        const startIndex = (this.currentPage - 1) * this.booksPerPage;
        const endIndex = startIndex + this.booksPerPage;
        return this.filteredBooks.slice(startIndex, endIndex);
    },
    
    // Get total pages
    getTotalPages: function() {
        return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
    
    // Get book by ID
    getBookById: function(id) {
        return this.allBooks.find(book => book.id == id);
    },
    
    // Toggle wishlist status
    toggleWishlist: function(bookId) {
        if (this.isInWishlist(bookId)) {
            StorageService.removeFromWishlist(bookId);
            return false;
        } else {
            StorageService.addToWishlist(bookId);
            return true;
        }
    },
    
    // Check if book is in wishlist
    isInWishlist: function(bookId) {
        return StorageService.isInWishlist(bookId);
    },
    
    // Get wishlisted books
    getWishlistedBooks: function() {
        const wishlistIds = StorageService.getWishlist();
        return this.allBooks.filter(book => wishlistIds.includes(book.id.toString()));
    }
};

export default BookService;