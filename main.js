const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const favBtn = document.getElementById('favorite');
const lsOutput = document.getElementById('lsoutput');
const loader = document.getElementById('loader');
const dev = '@chowkidarnot';

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
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author} - ${dev} `;
  window.open(twitterUrl, '_blank');
}

function addfav() {
  const key = quoteText.innerText;
  const value = authorText.innerText;

  if (key && value) {
    localStorage.setItem(key, value);
    location.reload();
  }
}

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);

  lsOutput.innerHTML += `${key} : ${value}<br /> <br />`;
}

//Event Listners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', addfav);

// on load
getQuote();
