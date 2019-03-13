'use strict';

(function SEARCH_JS() {

    let token = null;

    const resultList = document.querySelector('.result-list'),
        resultListItemTemplate = document.querySelector('#resultListItem'),
        searchBox = document.querySelector('.search-ext'),
        extEditor = document.querySelector('.ext-editor'),
        extEditorForm = extEditor.querySelector('.ext-editor-form');

    function newResultListItem({ extension, description, id }) {
        const item = document.importNode(resultListItemTemplate.content, true);
        const titleElem = item.querySelector('.rl-title');
        titleElem.appendChild(document.createTextNode(extension));
        const descriptionElem = item.querySelector('.rl-description');
        descriptionElem.appendChild(document.createTextNode(description));

        const btnEdit = item.querySelector('.rl-btn-edit');
        btnEdit.addEventListener('click', () => {
            console.log('edit', extension, id)
            console.log(typeof id, id)
            extEditorForm.elements.extension.value = extension;
            extEditorForm.elements.description.value = description;
            extEditorForm.elements.extensionId.value = id;
        })

        const btnDelete = item.querySelector('.rl-btn-delete');
        btnDelete.addEventListener('click', async () => {
            console.log('delete', extension, id)
            await requestDelete(id);
            eventJob();
        })

        return item;
    }

    async function requestExtensionsMatching(knownPart) {
        try {
            const result = await fetch(`/api/extension?sExt=${knownPart}`);
            const data = await result.json();
            data.sort((a, b) => a.extension.toString().localeCompare(b.extension.toString()))
            return data;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    async function requestDelete(extensionId) {
        const result = await fetch(`/api/extension/${extensionId}`, {
            method: 'DELETE'
        });
        if (result.status !== 200) {
            return false;
        }
        return true;
    }

    async function requestPut(extensionId, extensionObject) {
        const result = await fetch(`/api/extension/${extensionId}`, {
            method: 'PUT',
            body: JSON.stringify(extensionObject),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(result);
        if (result.status !== 200)
            return false;
        return true;
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

    extEditorForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const extensionId = extEditorForm.elements.extensionId.value;
        const extensionObject = {
            extension: extEditorForm.elements.extension.value,
            description: extEditorForm.elements.description.value
        }
        const result = await requestPut(extensionId, extensionObject);
        if (result === true) {
            $(extEditor).modal('hide');
            eventJob();
        } else {
            // error
        }
    })

    { // LOGIN

        function updateLoggedStyles(state) {
            const
                loggedOns = document.querySelectorAll('.logged-on'),
                loggedOffs = document.querySelectorAll('.logged-off');
            if (!state) {
                return () => {
                    loggedOns.forEach(elem => elem.classList.add('d-none'));
                    loggedOffs.forEach(elem => elem.classList.remove('d-none'));
                }
            }
            return () => {
                loggedOns.forEach(elem => elem.classList.remove('d-none'));
                loggedOffs.forEach(elem => elem.classList.add('d-none'));
            }
        }

        const
            loginModal = document.querySelector('.login-modal'),
            loginForm = document.querySelector('form.login-form'),
            dispUserNameAll = document.querySelectorAll('.disp-userName');

        async function fetchToken({ userName, password }) {
            const result = await fetch(`/api/token`, {
                method: 'POST',
                body: JSON.stringify({ userName, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (result.status !== 200) {
                return {
                    error: true,
                    status: result.status
                };
            }

            const tokenJson = await result.json();
            const { token } = tokenJson;
            return {
                token
            }
        }

        function doDispUserName(userName) {
            dispUserNameAll.forEach(span => {
                span.textContent = userName;
            })
        }

        loginForm.addEventListener('submit', async function (evt) {
            evt.preventDefault();
            const data = {
                userName: loginForm.elements.userName.value,
                password: loginForm.elements.password.value
            };
            const tokenObj = await fetchToken(data);
            if (tokenObj.error) {
                console.log('failed to login')
                updateLoggedStyles(false)();
                return;
            }
            doDispUserName(data.userName);
            updateLoggedStyles(true)();
            $(loginModal).modal('hide');
            console.log(tokenObj)
        })

        updateLoggedStyles(false)();

    }

})();

var viewUpdateTrigger = () => { };
