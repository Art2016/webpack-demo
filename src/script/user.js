import './lib/hot-module-replacement';
import '../style/user.scss';
import $ from 'jquery';
import Rx from 'rxjs/Rx';

const refreshButton = document.querySelector('.refresh');
const closeButton1 = document.querySelector('.close1');
const closeButton2 = document.querySelector('.close2');
const closeButton3 = document.querySelector('.close3');

const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
const close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
const close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
const close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

const requestStream = refreshClickStream.startWith('startup-click')
.map(() => {
  const randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset;
});

const responseStream = requestStream
.flatMap((requestUrl) => Rx.Observable.fromPromise(jQuery.getJSON(requestUrl)));

function createSuggestionStream(closeClickStream) {
  return closeClickStream.startWith('startup-click')
  .combineLatest(responseStream, (click, listUsers) => listUsers[Math.floor(Math.random() * listUsers.length)])
  .merge(refreshClickStream.map(() => null))
  .startWith(null);
}
const suggestion1Stream = createSuggestionStream(close1ClickStream);
const suggestion2Stream = createSuggestionStream(close2ClickStream);
const suggestion3Stream = createSuggestionStream(close3ClickStream);

function renderSuggestion(suggestedUser, selector) {
  const $suggestion = document.querySelector(selector);
  if (suggestedUser === null) {
    $suggestion.style.visibility = 'hidden';
  }
  else {
    $suggestion.style.visibility = 'visible';
    const $username = $suggestion.querySelector('.username');
    $username.href = suggestedUser.html_url;
    $username.textContent = suggestedUser.login;
    const $img = $suggestion.querySelector('img');
    $img.src = '';
    $img.src = suggestedUser.avatar_url;
  }
}
suggestion1Stream.subscribe((suggestedUser) => {
  renderSuggestion(suggestedUser, '.suggestion1');
});
suggestion2Stream.subscribe((suggestedUser) => {
  renderSuggestion(suggestedUser, '.suggestion2');
});
suggestion3Stream.subscribe((suggestedUser) => {
  renderSuggestion(suggestedUser, '.suggestion3');
});
