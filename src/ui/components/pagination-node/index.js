const { interpolate } = require('../utils');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    button {
      padding: 1rem;
      margin: 0 1rem;
    }
  </style>
  <div class="view"></div>
`;

const tmpl = `
<li>
  <button>{{ n }}</button>
</li>
`;

class PaginationNode extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(template.content.cloneNode(true));
    this.view = this.root.querySelector('.view');
    this.state = {};
  }

  connectedCallback() {
    this.state = JSON.parse(this.dataset.initialState || "{}");
    this.render();
  }

  disconnectedCallback() {
    // TODO
  }

  render() {
    this.view.innerHTML = '';
    this.view.innerHTML = interpolate(tmpl, this.state);
  }
}

module.exports = PaginationNode;

