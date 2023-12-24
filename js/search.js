async function fetchData() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
  }
}

function performSearchByCategory(searchTerm, data) {
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  const lowerCaseTerm = searchTerm.toLowerCase().trim();

  const results = data.filter(product => {
    const category = product.category.toLowerCase();
    return category === lowerCaseTerm;
  });

  if (results.length === 0) {
    searchResults.innerHTML = '<p>No results found.</p>';
    return;
  }

  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.classList.add('result-item');
    resultItem.innerHTML = `
      <p>Title: ${result.title}</p>
      <p>Category: 
        <a href="/${result.category.toLowerCase()}.html">${result.category}</a>
      </p>
      <p>Description: ${result.description}</p>
      <hr>
    `;
    searchResults.appendChild(resultItem);
  });
}

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async function () {
  const searchTerm = this.value.trim(); 
  const data = await fetchData();

  if (searchTerm === '') {
    searchResults.innerHTML = ''; 
    return;
  }

  performSearchByCategory(searchTerm, data);
});
