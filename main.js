const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const favBtn = document.getElementById('favorite');
const lsOutput = document.getElementById('lsoutput');
const loader = document.getElementById('loader');

// show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true; // show our loader and hide our quote container
}

// hide loader
function complete() {
  if (!loader.hidden) {
    // false
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

async function getQuote() {
  loading();

  // details article about CORS
  // https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
  // using a proxy API to fix CORS issue
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  // Get Quote From API
  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

  try {
    const response = await fetch(proxyURL + apiUrl); // combine these two
    const data = await response.json();

    // if author is blank
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }

    // request fontsize for long text
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }

    quoteText.innerText = data.quoteText; // data coming from api

    // stop loader , show quote
    complete();
  } catch (e) {
    getQuote();
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
}

function addFav() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;

  let favQuote = {
    author: author,
    quote: quote,
  };

  if (localStorage.getItem('quotes-generator') === null) {
    let quotes = [];
    quotes.push(favQuote);
    localStorage.setItem('quotes-generator', JSON.stringify(quotes));
  } else {
    let quotes = JSON.parse(localStorage.getItem('quotes-generator'));
    quotes.push(favQuote);
    localStorage.setItem('quotes-generator', JSON.stringify(quotes));
  }
  location.reload();
}

function deleteFavQuote(favQuote) {
  let quotes = JSON.parse(localStorage.getItem('quotes-generator'));

  quotes.forEach((quote, idx) => {
    if (quote.quote === favQuote) {
      quotes.splice(idx, 1);
    }
  });

  localStorage.setItem('quotes-generator', JSON.stringify(quotes));
  fetchFavQuote();
}

function fetchFavQuote() {
  let quotes = JSON.parse(localStorage.getItem('quotes-generator'));

  lsOutput.innerHTML = '';
  quotes.forEach((quote) => {
    lsOutput.innerHTML += `${quote.author} : ${quote.quote} <button class="delete-button" onclick="deleteFavQuote('${quote.quote}')">X</button><br /> <br />`;
  });
}

//Event Listners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', addFav);

// on load
getQuote();
fetchFavQuote();
