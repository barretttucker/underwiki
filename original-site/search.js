(function() {
  var index = null;
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');

  if (!input || !results) return;

  var scriptTag = document.querySelector('script[src$="search.js"]');
  var basePath = '';
  if (scriptTag) {
    var src = scriptTag.getAttribute('src');
    basePath = src.replace('search.js', '');
  }

  fetch(basePath + 'search-index.json')
    .then(function(r) { return r.json(); })
    .then(function(data) { index = data; })
    .catch(function() {
      results.innerHTML = '<p>Could not load search index.</p>';
    });

  input.addEventListener('input', function() {
    if (!index) return;
    var query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }

    var terms = query.split(/\s+/);
    var matches = index.filter(function(entry) {
      var haystack = (entry.title + ' ' + entry.text).toLowerCase();
      return terms.every(function(t) { return haystack.indexOf(t) !== -1; });
    });

    if (matches.length === 0) {
      results.innerHTML = '<p>No pages found.</p>';
      return;
    }

    var html = matches.slice(0, 50).map(function(m) {
      var snippet = m.text.substring(0, 200);
      if (m.text.length > 200) snippet += '...';
      return '<div class="search-result">' +
        '<h3><a href="' + basePath + m.file + '">' + escapeHtml(m.title) + '</a></h3>' +
        '<p>' + escapeHtml(snippet) + '</p>' +
        '</div>';
    }).join('');

    if (matches.length > 50) {
      html += '<p>Showing 50 of ' + matches.length + ' results.</p>';
    }

    results.innerHTML = html;
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();
