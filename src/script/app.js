import hmr from './lib/hot-module-replacement';
import '../style/app.scss';
import { groupBy } from 'lodash/collection';
import people from './lib/people';

const managerGroups = groupBy(people, 'manager');

const root = document.querySelector('#root');
root.innerHTML = `<pre>${JSON.stringify(managerGroups, null, 2)}</pre>`;

const routes = {
  dashboard: () => {
    System.import('./lib/dashboard').then((dashboard) => {
      dashboard.draw();
    }).catch((err) => {
      console.log("Chunk loading failed");
    });
  }
};

// demo async loading with a timeout
setTimeout(routes.dashboard, 1000);
