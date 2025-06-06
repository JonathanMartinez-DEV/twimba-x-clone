import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@11.1.0/+esm";

document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  }

  if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  }

  if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  }

  if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }

  targetTweetObj.isLiked = !targetTweetObj.isLiked;

  renderFeed();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(
    (tweet) => tweet.uuid === tweetId
  )[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }

  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;

  renderFeed();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: "@Scrimba",
      profilePic: "images/scrimbalogo.png",
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });

    tweetInput.value = "";
  }

  renderFeed();
}

function getFeedHtml() {
  let feedHTML = "";

  tweetsData.forEach((tweet) => {
    let repliesHtml = "";

    const likeIconClass = tweet.isLiked ? "liked" : "";
    const retweetIconClass = tweet.isRetweeted ? "retweeted" : "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHtml += `
            <div class="tweet-reply">
              <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic" />
                <div>
                  <p class="handle">${reply.handle}</p>
                  <p class="tweet-text">${reply.tweetText}</p>
                </div>
              </div>
            </div>
            `;
      });
    }

    feedHTML += `
        <div class="tweet">
          <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic" />
            <div>
              <p class="handle">${tweet.handle}</p>
              <p class="tweet-text">${tweet.tweetText}</p>
              <div class="tweet-details">
                <span class="tweet-detail">
                  <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                  ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                  <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                  ${tweet.likes}
                </span>
                <span class="tweet-detail">
                  <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                  ${tweet.retweets}
                </span>
              </div>
            </div>
          </div>
          <div class="hidden" id="replies-${tweet.uuid}">
            ${repliesHtml}
          </div>
        </div>
      `;
  });

  return feedHTML;
}

function renderFeed() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

renderFeed();
