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

    // displayResults(results.query.search);
  } catch (err) {
    console.log(err.message);
    alert("Failed to search Wikipedia");
  }
  spinner.classList.add("hidden");

  // });
};

const searchWikipedia = async function (query) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${query}`
    );

    if (!response.ok) throw Error(response.statusText);

    const data = await response.json();

    numberOfPages(data.query.search);
    buildPage(data.query.search);
    handleClick(data.query.search);

    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const displayResults = function (results, markup) {
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
  console.log(markup);
  // pagination.insertAdjacentHTML("beforeend", markup);
};

form.addEventListener("submit", handleSubmit);

// *Pagination*
const pagination = document.querySelector(".pagination");

const numberPerPage = 5;
let curPage = 1;

const numberOfPages = function (results) {
  const numberOfItems = results.length;
  return Math.ceil(numberOfItems / numberPerPage);
};

const buildPage = function (results, curPage = 1) {
  const numPages = numberOfPages(results);

  const trimStart = (curPage - 1) * numberPerPage;
  const trimEnd = trimStart + numberPerPage;
  const currentResults = results.slice(trimStart, trimEnd);

  pagination.innerHTML = "";
  const markup = generateMarkup(numPages);
  pagination.insertAdjacentHTML("beforeend", markup);
  searchResults.innerHTML = "";
  displayResults(currentResults, markup);
};

const generateMarkup = function (numPages) {
  if (curPage === 1 && numPages > 1) {
    return `
      <button class="btn-inline btn--pagination btn-num--pages">Pages: ${numPages}</button>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next btn--pagination_start">
            <span>Page ${curPage + 1}</span>
          </button>

      `;
  }

  // Last page
  if (curPage === numPages && numPages > 1) {
    return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <span>Page ${curPage - 1}</span>
          </button>

      `;
  }
  // Other page
  if (curPage < numPages) {
    return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
            <span>Page ${curPage - 1}</span>
          </button>
          <button class="btn-inline btn--pagination btn-num--pages">Remains: ${
            numPages - curPage
          }</button>
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
          </button>
      `;
  }

  // Page 1, and there are NO other pages
  // return "";
};

const handleClick = function (results) {
  pagination.addEventListener("click", function (e) {
    const btn = e.target.closest(".btn--inline");

    if (!btn) return;

    const goToPage = +btn.dataset.goto;
    curPage = goToPage;

    buildPage(results, goToPage);
  });
};

// const controlPagination = function (goToPage) {
//   buildPage();
// };

// addHandlerClick(controlPagination);

// const buildPagination = function (numPages) {
//   pagination.insertAdjacentHTML();
// };
