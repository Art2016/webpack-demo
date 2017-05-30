const hmr = (function() {
  if (module.hot) {
    module.hot.accept();
    console.log('Hot Reloading');
  }
})();
