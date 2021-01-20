import 'toastify-js/src/toastify.css';
import Toastify from 'toastify-js';

export default function showToast(text, { duration = 2000 } = {}) {
  Toastify({
    text: `<div style="height: 1.7rem; min-width: 25rem; font-size: 1.2rem; text-align: center;">${text}</div>`,
    duration,
    gravity: 'bottom',
    position: 'center',
    backgroundColor: '#2D2922',
    stopOnFocus: true
  }).showToast();
}
