import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startButton.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate.getTime() <= Date.now()) {
      userSelectedDate = null;
      startButton.disabled = true;

      if (selectedDate) {
        iziToast.error({
          message: 'Please choose a date in the future',
          position: 'topRight',
        });
      }

      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
});

startButton.addEventListener('click', () => {
  if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
    startButton.disabled = true;

    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });

    return;
  }

  startButton.disabled = true;
  input.disabled = true;

  updateTimer();

  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const remainingTime = userSelectedDate.getTime() - Date.now();

  if (remainingTime <= 0) {
    clearInterval(timerId);
    timerId = null;

    renderTimer(0);

    input.disabled = false;
    startButton.disabled = true;
    userSelectedDate = null;

    return;
  }

  renderTimer(remainingTime);
}

function renderTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
