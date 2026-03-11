function filterCats(el, type) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  if (type === 'all') {
    window.location.href = "listing.html";
  } else {
    window.location.href = "listing.html?cat=" + encodeURIComponent(type);
  }
}