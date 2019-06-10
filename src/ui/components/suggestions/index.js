const { Events } = require('../../../core');
const { interpolate } = require('./../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .suggestions {
      background: #fff;
      box-shadow: 0 0.3rem 3rem -1rem rgba(0, 0, 0, 0.3);
    }

    .suggestions__inner:not(:empty) {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    a {
      display: block;
      color: #444;
      padding: 1rem 2rem;
    }
  </style>
  <div class="view"></div>
`;
const tmpl = `
  <div class="suggestions">
    <div ref="suggestions" class="suggestions__inner"></div>
  </div>
`;

class Suggestions extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');

    // Bind.
    this.render = this.render.bind(this);
    this.updateProducts = this.updateProducts.bind(this);
    this.dismissSayt = this.dismissSayt.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener(Events.SAYT_PRODUCTS_SUPPLY, this.updateProducts);
    window.addEventListener(Events.SAYT_DISMISS, this.dismissSayt);
  }

  disconnectedCallback() {
    window.removeEventListener(Events.SAYT_PRODUCTS_SUPPLY, this.updateProducts);
    window.removeEventListener(Events.SAYT_DISMISS, this.dismissSayt);
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl, {});
  }

  updateProducts(e) {
    this.render();

    // TEMP: Implement `getRefs()` or similar.
    const elem = this.view.querySelector('[ref="suggestions"]');

    e.detail.data.records.forEach((product) => {
      elem.appendChild(this.renderProduct(product));
    });
  }

  renderProduct(product) {
    const elem = document.createElement('a');
    const fn = (e) => {
      switch (+e.keyCode) {
        case 13:
          window.dispatchEvent(new CustomEvent(Events.PRODUCTS_FETCH, { detail: { query: e.target.innerHTML } }));
          break;
        default: return;
      }
    };

    elem.href = '#';
    elem.innerHTML = product.allMeta.title;
    // TODO: Remove node-specific event handler when component is unmounted or re-rendered.
    elem.addEventListener('keyup', fn);
    return elem;
  }

  dismissSayt() {
    // Re-render component to clear product data.
    this.render();
  }
}

module.exports = Suggestions;
