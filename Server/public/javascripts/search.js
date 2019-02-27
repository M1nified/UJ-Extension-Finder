'use strict';

(function SEARCH_JS() {

    const resultList = document.querySelector('.result-list');
    const resultListItemTemplate = document.querySelector('#resultListItem');
    const searchBox = document.querySelector('.search-ext');

    function newResultListItem({ extension, description }) {
        const item = document.importNode(resultListItemTemplate.content, true);
        const titleElem = item.querySelector('.rl-title');
        titleElem.appendChild(document.createTextNode(extension));
        const descriptionElem = item.querySelector('.rl-description');
        descriptionElem.appendChild(document.createTextNode(description));
        return item;
    }

    async function requestExtensionsMatching(knownPart) {
        try {
            const result = await fetch(`/api/extension?sExt=${knownPart}`);
            const data = await result.json();
            return data;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    function updateView(extensions) {
        resultList.innerHTML = ''; // im lazy
        extensions.forEach((extension) => {
            const item = newResultListItem(extension);
            resultList.appendChild(item);
        })
    }

    async function updateUsing(extension) {
        const extensions = await requestExtensionsMatching(extension);
        updateView(extensions || []);
    };
    updateUsing('');

    const eventJob = () => {
        updateUsing(searchBox.value);
    }
    searchBox.addEventListener('keyup', eventJob);
    document.querySelector('.search-ext-btn').addEventListener('click', eventJob);

    viewUpdateTrigger = () => {
        eventJob();
    }

})();

var viewUpdateTrigger = () => { };
