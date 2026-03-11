document.getElementById('searchInput').addEventListener('keydown', (e)=> {
    if (e.key === 'Enter') {
        const value = e.target.value;
        window.location.href = 'listing.html?search=' + encodeURIComponent(value);
    }
});
