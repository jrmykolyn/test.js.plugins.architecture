class Api {
  fetch(data) {
    return window.fetch('https://cvshealth-cors.groupbycloud.com/api/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        collection: 'productsLeaf',
      }),
    })
      .then((response) => response.json());
  }
}

module.exports = Api;
