const { Events } = require('../../../core');
const { interpolate } = require('./../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .products__inner {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 2rem 0;
    }

    .products__inner > * {
      width: 32%;
      margin-bottom: 4%;
    }

  </style>
  <div class="view"></div>
`;
const tmpl = `
  <section class="products">
    <div ref="products" class="products__inner"></div>
  </section>
`;

class Products extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');

    // Bind.
    this.render = this.render.bind(this);
    this.updateProducts = this.updateProducts.bind(this);
  }

  connectedCallback() {
    this.render();

    window.addEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);
  }

  disconnectedCallback() {
    window.removeEventListener(Events.PRODUCTS_SUPPLY, this.updateProducts);
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl, {});
  }

  updateProducts(e) {
    const target = this.view.querySelector('[ref="products"]');
    target.innerHTML = '';
    e.detail.data.records.forEach((product) => {
      target.appendChild(this.renderProduct(product));
    });
  }

  renderProduct(product) {
    const elem = document.createElement('sfx-product');
    elem.set({ data: product });
    return elem;
  }
}

module.exports = Products;
