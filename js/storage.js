// Storage service for wishlist
const StorageService = {
    getWishlist: () => {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    },
    
    addToWishlist: (bookId) => {
        const wishlist = StorageService.getWishlist();
        if (!wishlist.includes(bookId)) {
            wishlist.push(bookId);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    },
    
    removeFromWishlist: (bookId) => {
        let wishlist = StorageService.getWishlist();
        wishlist = wishlist.filter(id => id !== bookId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    },
    
    isInWishlist: (bookId) => {
        const wishlist = StorageService.getWishlist();
        return wishlist.includes(bookId);
    },

    // New methods for search/filter preferences
    getSearchPreferences: () => {
        const prefs = localStorage.getItem('searchPreferences');
        return prefs ? JSON.parse(prefs) : {
            searchTerm: '',
            genre: '',
            page: 1
        };
    },
    
    saveSearchPreferences: (searchTerm, genre, page) => {
        const prefs = {
            searchTerm,
            genre,
            page
        };
        localStorage.setItem('searchPreferences', JSON.stringify(prefs));
    }

};

export default StorageService;