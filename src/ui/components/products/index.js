const template = document.createElement('template');
template.innerHTML = `
  <section></section>
`;

class Products extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));

    // Bind.
    this.updateProducts = this.updateProducts.bind(this);
  }

  connectedCallback() {
    window.addEventListener('products:supply', this.updateProducts);
  }

  disconnectedCallback() {
    window.removeEventListener('products:supply', this.updateProducts);
  }

  updateProducts(e) {
    const target = this.root.querySelector('section');
    target.innerHTML = '';
    e.detail.data.records.forEach((product) => {
      target.appendChild(this.renderProduct(product));
    });
  }

  renderProduct(product) {
    const elem = document.createElement('p');
    elem.innerHTML = product.allMeta.title;
    return elem;
  }
}

module.exports = Products;
