const { Events } = require('../../../core');
const { interpolate } = require('./../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    input {
      /* TEMP */
      width: 1000rem;
      max-width: 30rem;
      background: transparent;
      padding: 1rem;
      border: solid 0.1rem #ddd;
    }

  </style>
  <div class="view"></div>
`;
const tmpl = `
  <div class="search-box">
    <div class="search-box__inner">
      <input type="text" />
    </div>
  </div>
`;

class SearchBox extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');

    // Bind.
    this.render = this.render.bind(this);
    this.search = this.search.bind(this);
  }

  connectedCallback() {
    this.render();
    this.view.querySelector('input').addEventListener('keyup', this.search);
  }

  disconnectedCallback() {
    this.view.querySelector('input').removeEventListener('keyup', this.search);
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl);
  }

  search(e) {
    const query = this.view.querySelector('input').value;

    switch (+e.keyCode) {
      case 13:
        window.dispatchEvent(new CustomEvent(Events.PRODUCTS_FETCH, { detail: { query } }));
        break;
      default:
        if (!query || query.length < 3) return;
        window.dispatchEvent(new CustomEvent(Events.SAYT_PRODUCTS_FETCH, { detail: { query } }));
    }
  }
}

module.exports = SearchBox;
