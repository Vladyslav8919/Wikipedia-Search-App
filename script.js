"use strict";

const form = document.querySelector(".js-search-form");
const input = document.querySelector(".js-search-input");
const searchResults = document.querySelector(".js-search-results");
const spinner = document.querySelector(".js-spinner");

const handleSubmit = async function (e) {
  e.preventDefault();

  const inputValue = input.value;
  const searchQuery = inputValue.trim();

  searchResults.innerHTML = "";

  spinner.classList.remove("hidden");

  try {
    const results = await searchWikipedia(searchQuery);

    if (results.query.searchinfo.totalhits === 0) {
      alert("No results found. Please try another keywords");
      return;
    }

    displayResults(results.query.search);
  } catch (err) {
    console.log(err.message);
    alert("Failed to search Wikipedia");
  }
  spinner.classList.add("hidden");
  // window.addEventListener("load", () => {

  // });
};

const searchWikipedia = async function (query) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`
    );

    if (!response.ok) throw Error(response.statusText);

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const displayResults = function (results) {
  results.forEach((result) => {
    const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

    searchResults.insertAdjacentHTML(
      "beforeend",
      `
  <div class="result-item">
    <h3 class="result-title">
      <a href="${url} target="_blank" rel="nooneper">${result.title}</a>
    </h3>
    <a href="${url}" class="result-link" target="_blank" rel="noopener">${url}</a>
    <span class="result-snippet">${result.snippet}</span><br>
  </div>
  `
    );
  });
};

form.addEventListener("submit", handleSubmit);
