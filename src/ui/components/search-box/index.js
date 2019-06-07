const { Events } = require('../../../core');

const template = document.createElement('template');
template.innerHTML = `
  <input type="text" />
`;

class SearchBox extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));

    // Bind.
    this.search = this.search.bind(this);
  }

  connectedCallback() {
    this.root.querySelector('input').addEventListener('keyup', this.search);
  }

  disconnectedCallback() {
    this.root.querySelector('input').removeEventListener('keyup', this.search);
  }

  search(e) {
    const query = this.root.querySelector('input').value;

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
