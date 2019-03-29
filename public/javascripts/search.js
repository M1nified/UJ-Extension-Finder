'use strict';

(function () {

    let token = null;
    let userLoggerIn = false;

    const
        resultList = document.querySelector('.result-list'),
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
        btnEdit.addEventListener('click', (evt) => {
            if (!userLoggerIn) {
                evt.preventDefault();
                alerts.danger()('You need to be logged in to edit extensions');
                return;
            }
            console.log('edit', extension, id);
            extEditorForm.elements.extension.value = extension;
            extEditorForm.elements.description.value = description;
            extEditorForm.elements.extensionId.value = id;
            $('.ext-editor').modal('show');
        })

        const btnDelete = item.querySelector('.rl-btn-delete');
        btnDelete.addEventListener('click', async (evt) => {
            if (!userLoggerIn) {
                evt.preventDefault();
                alerts.danger()('You need to be logged in to delete extensions');
                return;
            }
            console.log('delete', extension, id);
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
        const result = await fetch(tokenize(`/api/extension/${extensionId}`), {
            method: 'DELETE'
        });
        if (result.status !== 200) {
            alerts.danger()('Failed to delete.')
            return false;
        }
        alerts.success()('Extension deleted.');
        return true;
    }

    async function requestPut(extensionId, extensionObject) {
        const result = await fetch(tokenize(`/api/extension/${extensionId}`), {
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
            alerts.success()('Extension updated.');
            $(extEditor).modal('hide');
            eventJob();
        } else {
            alerts.danger()('Failed to update.');
            // error
        }
    })

    { // LOGIN

        function updateLoggedStyles(state) {
            const
                loggedOns = document.querySelectorAll('.logged-on'),
                loggedOffs = document.querySelectorAll('.logged-off'),
                loggedEnabled = document.querySelectorAll('.logged-enabled');
            if (!state) {
                return () => {
                    loggedOns.forEach(elem => elem.classList.add('d-none'));
                    loggedOffs.forEach(elem => elem.classList.remove('d-none'));
                    loggedEnabled.forEach(elem => {
                        elem.disabled = true;
                        elem.classList.add('disabled')
                    })
                }
            }
            return () => {
                loggedOns.forEach(elem => elem.classList.remove('d-none'));
                loggedOffs.forEach(elem => elem.classList.add('d-none'));
                loggedEnabled.forEach(elem => {
                    elem.disabled = false;
                    elem.classList.remove('disabled');

                })
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
            token = tokenObj.token;
            doDispUserName(data.userName);
            updateLoggedStyles(true)();
            $(loginModal).modal('hide');
            alerts.success()('You have successfully logged in :)');
            userLoggerIn = true;
            console.log(tokenObj)
        })

        updateLoggedStyles(false)();

    }

    { // ADD

        const form = document.querySelector('form.add-ext-form');
        const createModal = document.querySelector('div.create-modal');

        function postExtension(extension) {
            return new Promise((resolve, reject) => {
                fetch(tokenize('/api/extension'), {
                    method: 'POST',
                    body: JSON.stringify(extension),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(async (res) => {
                        console.log(res.status)
                        if (res.status === 201)
                            resolve(true);
                        else {
                            const reason = await res.text();
                            reject({ status: res.status, reason });
                        }
                    })
            })
        }

        form.addEventListener('submit', async function (evt) {
            evt.preventDefault();
            const extension = this.elements["extension"].value;
            const description = this.elements["description"].value;
            try {
                const result = await postExtension({ extension, description });
                console.log(result);
                if (result === true) {
                    $(createModal).modal('hide');
                    this.elements["extension"].value = '';
                    this.elements["description"].value = '';
                    alerts.success()('Extension created.');
                }
            } catch (e) {
                alerts.danger()('Failed to create.')
            }
            eventJob();
        })

    }

    function tokenize(path) {
        const url = new URL(path, document.location.href);
        url.searchParams.append('token', token);
        return url.href;
    }

    const alerts = (function () {
        const alertsBox = document.querySelector('.alerts');
        const
            alerts = [],
            limit = 3,
            lifeTime = 2500;
        const Alert = class {
            constructor(element) {
                this.element = element;
                this.runTimer();
            }
            runTimer() {
                this.timer = setTimeout(() => {
                    this.remove();
                }, lifeTime);
            }
            remove() {
                try {
                    this.element.parentNode.removeChild(this.element);
                } catch (e) {

                }
            }
        }
        const templates = {
            alertPrimary: document.getElementById('alert-primary'),
            alertSecondary: document.getElementById('alert-secondary'),
            alertSuccess: document.getElementById('alert-success'),
            alertDanger: document.getElementById('alert-danger'),
            alertWarning: document.getElementById('alert-warning'),
            alertInfo: document.getElementById('alert-info'),
            alertLight: document.getElementById('alert-light'),
            alertDark: document.getElementById('alert-dark'),
        }
        function addAlert(alert) {
            if (alerts.length >= limit) {
                const fst = alerts.shift();
                console.log(fst)
                fst.remove();
            }
            alerts.push(alert);
            alertsBox.appendChild(alert.element);
        }
        function alertContent(template) {
            const element = document.importNode(template.content, true).querySelector('.alert');
            return (info) => {
                console.log(info, element)
                element.appendChild(document.createTextNode(info || ''));
                const alert = new Alert(element);
                addAlert(alert);
            }
        }
        return {
            success: () => {
                return alertContent(templates.alertSuccess);
            },
            danger: () => {
                return alertContent(templates.alertDanger);
            }
        }
    })()

})();

var viewUpdateTrigger = () => { };
