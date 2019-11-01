import './index.less';

const htmlToElements = (html: string): HTMLCollection => {
  html = html.trim();
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.children;
};

const getScrollbarWidth = (): number => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  const inner = document.createElement('div');
  outer.appendChild(inner);
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  if (outer.parentNode) {
    outer.parentNode.removeChild(outer);
  }
  if (document.body.scrollHeight > window.innerHeight) {
    return scrollbarWidth;
  }
  return 0;
};

const firstFocusable = (container: Element): void => {
  const target: HTMLButtonElement = container.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (target) {
    target.focus();
  }
};

export class Modal {
  public template: Element;
  private container: Element;
  private activeElement: HTMLElement;
  protected escapeEvent = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.close();
    }
  };

  constructor(template: string) {
    this.template = htmlToElements(`
        <div class="modal">
          <div class="dialog">
            <button class="dialog-close" aria-label="Close modal"></button>
            ${template}
          </div>
        </div>
        `)[0];

    this.template.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.template) {
        this.close();
      }
    });

    const closeButton = this.template.querySelector('.dialog-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.close();
      });
    }
  }

  private getContainer(): Element {
    if (this.container) {
      return this.container;
    }
    const div = document.createElement('div');
    div.classList.add('modals-container');
    this.container = div;
    document.body.appendChild(this.container);
    return this.container;
  }

  public open(): void {
    this.activeElement = document.activeElement as HTMLElement;
    this.getContainer().appendChild(this.template);
    document.addEventListener('keydown', this.escapeEvent);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
    firstFocusable(this.template);
  }

  public close(): void {
    this.getContainer().removeChild(this.template);
    document.removeEventListener('keydown', this.escapeEvent);
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
    if (this.activeElement) {
      this.activeElement.focus();
    }
  }
}
