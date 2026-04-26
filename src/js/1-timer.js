import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('input'),
  timer: document.querySelector('.timer'),
  btn: document.querySelector('button'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.btn.disabled = true; // ← було startBtn
      userSelectedDate = null;
      return;
    }

    userSelectedDate = selectedDates[0];
    refs.btn.disabled = false; // ← було startBtn
  },
};
flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
refs.btn.addEventListener('click', onInputType);

function onInputType() {
  refs.btn.disabled = true;
  refs.input.disabled = true;
  const id = setInterval(() => {
    const diffWithOutConvert = userSelectedDate - new Date();

    if (diffWithOutConvert <= 0) {
      clearInterval(id);
      refs.input.disabled = false;
    } else {
      const diff = convertMs(diffWithOutConvert);
      const { days, hours, minutes, seconds } = diff;

      refs.days.textContent = convertTwoNumbersFormat(days);
      refs.hours.textContent = convertTwoNumbersFormat(hours);
      refs.minutes.textContent = convertTwoNumbersFormat(minutes);
      refs.seconds.textContent = convertTwoNumbersFormat(seconds);
    }
  }, 1000);
}

function convertTwoNumbersFormat(value) {
  return value.toString().padStart(2, '0');
}
