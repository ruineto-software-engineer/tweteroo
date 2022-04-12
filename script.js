let _username = "";
const BASE_URL = "http://localhost:5000";

function signUp() {
  const username = document.querySelector("#username").value;
  const picture = document.querySelector("#picture").value;

  axios.post(`${BASE_URL}/sign-up`, {
    username,
    avatar: picture
  }).then(() => {
    _username = username;
    loadTweets();
  }).catch(err => {
    console.error(err);
    if (err.response) {
      alert(err.response.data);
    }
  });
}

function loadTweets() {
  page = 1;
  axios.get(`${BASE_URL}/tweets?page=${page}`).then(res => {
    const tweets = res.data;
    let tweetsHtml = '';

    for (const tweet of tweets) {
      tweetsHtml += Tweet(tweet);
    }

    document.querySelector(".tweets-page .tweets").innerHTML = tweetsHtml;
    document.querySelector(".pagina-inicial").classList.add("hidden");
    document.querySelector(".tweets-page").classList.remove("hidden");
  });
}

function postTweet() {
  const tweet = document.querySelector("#tweet").value;

  axios.post(`${BASE_URL}/tweets`, {
    tweet
  }, {
    headers: {
      'User': _username
    }
  }).then((response) => {
    if (response.status === 201) {
      document.querySelector("#tweet").value = "";
      loadTweets();
      return
    }

    console.error(response);
    alert("Erro ao fazer tweet! Consulte os logs.");
  }).catch(err => {
    console.error(err);
    if (err.response) {
      alert(err.response.data);
    }
  })
}

let page = 1;
function loadNextPage() {
  page++;

  axios.get(`${BASE_URL}/tweets?page=${page}`).then(res => {
    const tweets = res.data;
    let tweetsHtml = '';

    for (const tweet of tweets) {
      tweetsHtml += Tweet(tweet);
    }

    document.querySelector(".tweets-page .tweets").innerHTML += tweetsHtml;
    document.querySelector(".pagina-inicial").classList.add("hidden");
    document.querySelector(".tweets-page").classList.remove("hidden");
  });
}

function loadUserTweets(username) {
  axios.get(`${BASE_URL}/tweets/${username}`).then(res => {
    const tweets = res.data;
    let tweetsHtml = '';

    for (const tweet of tweets) {
      tweetsHtml += Tweet(tweet);
    }

    document.querySelector(".user-tweets-page .tweets").innerHTML = tweetsHtml;
    document.querySelector(".tweets-page").classList.add("hidden");
    document.querySelector(".user-tweets-page").classList.remove("hidden");
  })
}

function goToHome() {
  document.querySelector(".user-tweets-page").classList.add("hidden");

  loadTweets();
}

function Tweet({ avatar, username, tweet }) {
  return `
    <div class="tweet" onclick="loadUserTweets('${username}')">
      <div class="avatar">
        <img src="${avatar}" />
      </div>
      <div class="content">
        <div class="user">
          @${username}
        </div>
        <div class="body">
          ${escapeHtml(tweet)}
        </div>
      </div>
    </div>
  `
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
