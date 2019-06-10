const { Events } = require('../../../core');
const { interpolate } = require('./../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .view,
    article {
      height: 100%;
    }

    article {
      min-height: 40rem;
      background: #fff;
      box-shadow: 0 0.5rem 3rem -1rem rgba(0, 0, 0, 0.3);
    }

    article div {
      padding: 2rem;
    }

    article h1 {
      margin: 0;
      font-size: 2rem;
      line-height: 1.4;
    }

    img {
      max-width: 100%;
      display: block;
    }
  </style>
  <div class="view"></div>
`;
const tmpl = `
  <article>
    <header>
      <img src="{{ src }}" />
    </header>
    <div>
      <h1>{{ title }}</h1>
    </div>
  </article>
`;

class Product extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');

    // TEMP
    this.state = {};

    // Bind.
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    // TODO
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl, {
      title: this.state.data.allMeta.title,
      src: 'https://via.placeholder.com/300x200',
    });
  }

  // TODO: Move to base class.
  set(data = {}) {
    this.state = { ...this.state, ...data };
  }
}

module.exports = Product;
