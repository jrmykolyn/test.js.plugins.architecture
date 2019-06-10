const { Events } = require('../../../core');
const { interpolate } = require('./../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .sayt {
      position: relative;
    }

    .sayt__inner {
      /* TODO */
    }

    .search-box {

    }

    .search-box__inner {

    }

    .suggestions {
      width: 100%;
      height: auto;
      position: absolute;
      top: 100%;
      left: 0;
    }

    .suggestions__inner {

    }
  </style>
  <div class="view"></div>
`;
const tmpl = `
  <div class="sayt">
    <div class="sayt__inner">
      <div class="search-box">
        <div class="search-box__inner">
          <slot name="search-box"></slot>
        </div>
      </div>
      <div class="suggestions">
        <div class="suggestions__inner">
          <slot name="suggestions"></slot>
        </div>
      </div>
    </div>
  </div>
`;

class SearchAsYouType extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');

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
    this.view.innerHTML = interpolate(tmpl, { foo: 'bar' });
  }

  renderProduct(product) {
    const elem = document.createElement('p');
    elem.innerHTML = product.allMeta.title;
    return elem;
  }
}

module.exports = SearchAsYouType;
