const searchInput = document.querySelector(".search-input");
const autocompleteList = document.querySelector(".autocomplete");
const repoList = document.querySelector(".repo-list");
let timeout;

searchInput.addEventListener("input", (e) => {
  const searchResult = searchInput.value;

  if (!searchResult) {
    autocompleteList.innerHTML = "";
    return;
  }

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    fetch(
      `https://api.github.com/search/repositories?q=${searchResult}&per_page=5`
    )
      .then((response) => response.json())
      .then((data) => {
        autocompleteList.innerHTML = "";
        data.items.forEach((repo) => {
          const li = document.createElement("li");
          li.classList.add("autocomplete__item");
          li.textContent = repo.name;
          li.addEventListener("click", () => {
            addRepos(repo);
            searchInput.value = "";
            autocompleteList.innerHTML = "";
          });
          autocompleteList.appendChild(li);
        });
      })
      .catch((error) => console.error("Репозиторий не найден!"));
  }, 500);
});

function addRepos(repo) {
  const li = document.createElement("li");
  li.classList.add("repo-list__item");

  li.insertAdjacentHTML(
    "afterbegin",
    `<p class='repo-list__parag'> Name: ${repo.name}</p>
     <p class='repo-list__parag'> Owner: ${repo.owner.login}</p>
     <p class='repo-list__parag'> Stars: ${repo.stargazers_count}</p>
     <button class='repo-list__deleteBtn'></button>`
  );

  repoList.appendChild(li);
}

repoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("repo-list__deleteBtn")) {
    repoList.removeChild(e.target.closest("li"));
  }
});
