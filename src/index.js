var debounce = require('lodash.debounce');
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core/dist/PNotify.js';
import fetchCountries from './fetchCountries.js';
import countryMarkupTpl from './country-markup.hbs';
import countryListTpl from './country-list.hbs';

const resultsContainer = document.querySelector('.js-country-card');
const inputEl = document.querySelector('input');

const DEBOUNCE_DELAY = 500;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    let searchQuery = inputEl.value;
    
    resultsContainer.innerHTML = '';
    inputEl.value = inputEl.value.trim();
    if (inputEl.value !== '' && inputEl.value !== ' ' && inputEl.value !== '.') {
        fetchCountries(searchQuery).then(data => {
            if (data.status === 404) {
                notificationMessage('Sorry, nothing found.')
            }
            else if (data.length > 10) {
                notificationMessage('Too many matches found. Please enter a more specific query!');
            }
            else if (data.length === 1) {
                const resultsMarkup = createMenuItemsMarkup(data);
                resultsContainer.insertAdjacentHTML('beforeend', resultsMarkup);
            }
            else if (2 <= data.length <= 10) {
                const resList = createItemsList(data);
                resultsContainer.insertAdjacentHTML('beforeend', resList);
            }
        })
    }
};

function createMenuItemsMarkup(data) {
    return countryMarkupTpl(data);
}

function createItemsList(data) {
    return countryListTpl(data);
}

function notificationMessage(message) {
    error ({
            title: `${message}`,
            delay: 4000,
        });
}
