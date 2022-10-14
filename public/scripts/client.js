/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// steps after tweet button clicked.
$(function () {
  const $button = $(`.tweet-and-word-count button`);
  $button.on('click', function (event) {
    event.preventDefault();
    let $text = $(".tweet-text").serialize();

    // decode to make readable text
    const plainText = decodeURIComponent($text).slice(5);
    // validate text
    if (textInputValidation(plainText)) {
      $.ajax("/tweets", {
        method: `POST`,
        data: $text
      })
        .then(() => {
          loadTweets();
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      return;
    }
  })
});

// helper function to validate user input
const textInputValidation = function (text) {

  const errorIcon = `<i class="fa-solid fa-triangle-exclamation error-icon"></i>`;

  if (!text) {
    $(".error-message").html(`${errorIcon} Cannot Tweet nothing! ${errorIcon}`);
    $(".error").slideDown("slow");
    return false;
  }

  if (text.length > 140) {
    $(".error-message").html(`${errorIcon} You have exceeded the character limit! ${errorIcon}`);
    $(".error").slideDown("slow");
    return false;
  }

  $(".error").slideUp("slow");
  
  return true;
}

// loads tweets' database.
const loadTweets = function () {
  $.ajax("/tweets", {
    method: `GET`,
  })
    .then((data) => {
      renderTweets(data);
    })
    .catch((error) => {
      console.log(error);
    })
};

// clean slate and post updated data with added new tweets.
const renderTweets = function (tweets) {
  $('.tweets-container').empty();

  for (const tweet of tweets) {
    // calls createTweetElement to generate tweet.
    const element = createTweetElement(tweet)
    // takes return value and appends it to the tweets container.
    $('.tweets-container').prepend(element);
  }
}

// helper function for Cross-Site Scripting attacks
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// tweets template.
const createTweetElement = function (obj) {
  const $tweet = `
  <article class="tweets-from-db mouse-over">
    <header>
    
    <span><i class="fa-solid fa-user header-icon"></i>${obj.user.name}</span>
    <span>${obj.user.handle}</span>
    
    </header>
    <p>${escape(obj.content.text)}</p>
    <hr class="hr">
    <footer class="footer">
      <span>${timeago.format(obj.created_at)}</span>
      <span>
        <i class="fa-solid fa-flag footer-icons"></i>
        <i class="fa-solid fa-share footer-icons"></i>
        <i class="fa-solid fa-thumbs-up footer-icons"></i>
      </span>

    </footer>
  </article>
  `;
  return $tweet;
}

// shows tweets that are already in data.
loadTweets();