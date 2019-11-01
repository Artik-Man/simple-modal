import { Modal } from './simple-modal/index';

(() => {
  const templates = {
    'hello-world': (params: { world: string }) => `<h2>Hello</h2><p>${params.world}</p>`,
  };

  document.querySelectorAll('[data-modal]').forEach((button: HTMLElement) => {
    const modalTemplate = templates[button.dataset.modal]({ world: 'world!' });
    if (modalTemplate) {
      const modal = new Modal(modalTemplate);
      button.addEventListener('click', () => {
        modal.open();
      });
    }
  });
})();
