import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const myInput = document.querySelector('#datetime-picker');
const buttonStartTimer = document.querySelector('[data-start]');
buttonStartTimer.setAttribute('disabled', '');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (selectedDates[0].getTime() - Date.now() > 0) {
      buttonStartTimer.removeAttribute('disabled');
      userSelectedDate = selectedDates[0].getTime();
    } else {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
        transitionIn: 'fadeInDown',
      });
    }
  },
};
let userSelectedDate = 0;

flatpickr(myInput, options);

const timer = {
  refs: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  intervalId: null,

  convertMs(ms) {
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
  },

  start() {
    this.intervalId = setInterval(() => {
      const ms = userSelectedDate - Date.now();
      const time = this.convertMs(ms);
      console.log(time);
      if (ms <= 0) {
        this.stop();

        return;
      }

      const { days, hours, minutes, seconds } = time;
      this.refs.days.textContent = this.pad(days);
      this.refs.hours.textContent = this.pad(hours);
      this.refs.minutes.textContent = this.pad(minutes);
      this.refs.seconds.textContent = this.pad(seconds);
      buttonStartTimer.setAttribute('disabled', '');
      myInput.setAttribute('disabled', '');
    }, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    myInput.removeAttribute('disabled');
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },
};
buttonStartTimer.addEventListener('click', event => {
  timer.start();
});
