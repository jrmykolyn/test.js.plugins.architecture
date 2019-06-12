const { Events } = require('../../../core');
const { interpolate } = require('../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  <div class="view"></div>
`;

const tmpl = `
  <div class="pagination">
    <div class="pagination__inner">
      <ul class="pagination-list" ref="list"></ul>
    </div>
  </div>
`;

class Pagination extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');
    this.state = {};

    // Bind.
    this.updatePagination = this.updatePagination.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener(Events.PRODUCTS_SUPPLY, this.updatePagination);
  }

  disconnectedCallback() {
    window.removeEventListener(Events.PRODUCTS_SUPPLY, this.updatePagination);
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl, {});

    const elem = this.view.querySelector('[ref="list"]');
    (new Array(this.state.totalPageCount || 0))
      .fill(null)
      .forEach((_, i) => {
        const el = document.createElement('sfx-pagination-node');
        el.setAttribute('data-initial-state', JSON.stringify({ n: i + 1 }));
        el.addEventListener('click', () => window.dispatchEvent(new CustomEvent(Events.PAGE_SET, { detail: { query: this.state.originalQuery, page: i + 1 } })));
        elem.appendChild(el);
      });
  }

  updatePagination(e) {
    const { detail } = e;
    const { data } = detail;
    const { totalPageCount, originalQuery } = data;

    this.state = { ...this.state, totalPageCount, originalQuery };
    this.render();
  }
}

module.exports = Pagination;
