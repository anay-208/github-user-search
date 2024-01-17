// Total public repos, items to display per page
let total_repos,
  per_page = 10, current_user = 'anay-208', page = 1;
// const token = ''; // Add a token for increased rate limit, and uncomment

function createRepoElement(name, description, tags, user) {
  return `
        <div class="col col-12 col-md-6 col-lg-4">
            <div class="repo">
                <h2>${name}</h2>
                <h3>${description || "No description"}</h3>
                <div class="tags">
                    ${tags.slice(0, 4).map((tag) => `<div>${tag}</div>`).join("")}
                </div>
                <a href="https://github.com/${user}/${name}" class="github-button">View on Github</a>
            </div>
        </div>
    `;
}

function clearRepos(){
    const repos = document.querySelector(".repos .row");
    repos.innerHTML = "";
}

async function displayRepos(user, page){
    return new Promise((resolve, reject) => {
  fetch(`https://api.github.com/users/${user}/repos?per_page=${per_page}&page=${page}`, {
    // headers: {
    //   Authorization: `token ${token}`, // Add a token for increased rate limit
    // },
  })
    .then((response) => {
      if (response.status !== 200) {
        alert(
          response.status === 404 ? "User not found" :
          "Error fetching repos from github api, its most likely due to rate limit"
        );
        setLoaded(true);
        return;
      }
      return response.json();
    })
    .then((repoData) => {
        const fetchTagsPromises = repoData.map((repo) => {
            const { name, description, tags_url } = repo;
            //Fetch tags for each repo
            return fetch(tags_url, {
    // headers: {
    //   Authorization: `token ghp_tokenhere`, // Add a token for increased rate limit
    // },
            })
            .then((response) => {
                if (response.status !== 200) {
                    alert(
                        "Error fetching tags from github api, its most likely due to rate limit"
                    );
                    return;
                }
                return response.json();
            })
            .then((data) => ({ name, description, tags: data.map((tag) => tag.name) }));
        });
        // Use Promise.all to wait for all fetch requests to complete. Once they do, we have an array of repositories with their respective tags.
        const repos = document.querySelector(".repos .row");
        repos.innerHTML = ""
        Promise.all(fetchTagsPromises).then((reposWithTags) => {
            reposWithTags.forEach(({ name, description, tags }) => {
                repos.insertAdjacentHTML('beforeend', createRepoElement(name, description, tags, user));
            });
        }).then(() => resolve()).catch((error) => reject(error))
    }).catch((error) => reject(error));
    });
}


function setLoaded(value = true) {
  const loader = document.querySelector(".loading");
  loader.classList[value ? "add" : "remove"]("hidden");
}

function displayUserInfo(data) {
  const username = document.querySelector(".username");
  const bio = document.querySelector(".bio");
  const img = document.querySelector("img.user-avatar");
  const location = document.querySelector(".location");
  const locationSpan = document.querySelector(".location span");
  const ghButton = document.querySelector(".github-button");
  username.innerHTML = data.login;
  bio.innerHTML = data.bio;
  img.src = data.avatar_url;
  locationSpan.innerHTML = data.location;
  ghButton.href = data.html_url;
  if(!data.location) location.classList.add("hidden")
}

async function searchGithubUser(value) {
  return new Promise((resolve, reject) => {
  fetch(`https://api.github.com/users/${value}`, {
    // headers: {
    //   Authorization: `token ${token}`, // Add a token for increased rate limit, and uncomment
    // },
  })
    .then((response) => {
      if (response.status !== 200) {
        if(response.status === 404){
          alert("User not found");
          setLoaded(true)
          return;
        }
        alert(
          "Error fetching user data from github api, its most likely due to rate limit"
        );
        return;
      }
      return response.json();
    })
    .then( async (data) => {
      total_repos = data.public_repos;
      displayUserInfo(data);
      await displayRepos(value, 1);
      resolve()
      setLoaded(true)
    })
    .catch((error) => reject(error));
  });
}

// for repos per page

function changeReposPerPage(target){
    per_page = target.value;
    document.querySelector(".page-selector-container .active").classList.remove("active");
    target.classList.add("active");
    const repos = document.querySelector(".repos .row");
    repos.innerHTML = `<div
    class="spinner-border text-primary"
    role="status"
    style="width: 2rem; height: 2rem; margin: 25px auto; display: block;"
  >
    <span class="visually-hidden">Loading...</span>
  </div>`
  page=1;
    displayRepos(current_user, 1);
    refreshPages()
}










window.onload = async () => {await searchGithubUser(current_user); refreshPages()};
// for html onClick function
function search(){
  page = 1;
    const element = document.querySelector("input");
    setLoaded(false);
    current_user = element.value;
    searchGithubUser(element.value);
}
// This function is used to disable the button of prev page or next page, if there is no prev page or next page
function refreshPages() {
  const prevPage = document.querySelector(".prev");
  const nextPage = document.querySelector(".next");
  const lastPage = Math.ceil(total_repos / per_page);

  if (page === 1) {
    prevPage.setAttribute("disabled", "disabled");
  } else {
    prevPage.removeAttribute("disabled");
  }

  if (page === lastPage) {
    nextPage.setAttribute("disabled", "disabled");
  } else {
    nextPage.removeAttribute("disabled");
  }
}

function nextPage(){
    page++;
    const repos = document.querySelector(".repos .row");
    repos.innerHTML = `<div
    class="spinner-border text-primary"
    role="status"
    style="width: 2rem; height: 2rem; margin: 25px auto; display: block;"
  >
    <span class="visually-hidden">Loading...</span>
  </div>`
    displayRepos(current_user, page);
  refreshPages()

}
function prevPage(){
  page--;
  const repos = document.querySelector(".repos .row");
  repos.innerHTML = `<div
  class="spinner-border text-primary"
  role="status"
  style="width: 2rem; height: 2rem; margin: 25px auto; display: block;"
>
  <span class="visually-hidden">Loading...</span>
</div>`
  displayRepos(current_user, page);
  refreshPages()
}