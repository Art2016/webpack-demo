import './lib/hot-module-replacement';
import '../style/user.scss';
import $ from 'jquery';
import Rx from 'rxjs';

const requestStream = Rx.Observable.of('https://api.github.com/users');

// requestStream.subscribe(requestUrl => {
//   // execute the request
//   $.getJSON(requestUrl, responseData => {
//     console.log(responseData);
//   });
// });

requestStream.subscribe(requestUrl => {
  // execute the request
  const responseStream = Rx.Observable.create(observer => {
    $.getJSON(requestUrl)
    .done(response => { observer.next(response); })
    .fail((jqXHR, status, error) => { observer.error(error); })
    .always(() => { observer.complete(); });
  });

  responseStream.subscribe(response => {
    console.log(response);
  });
});

const responseMetastream = requestStream.map(requestUrl => {
  return Rx.Observable.fromPromise($.getJSON(requestUrl));
});

console.log(responseMetastream);
