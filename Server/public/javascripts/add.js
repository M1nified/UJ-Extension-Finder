'use strict';

(function ADD_JS() {

    const form = document.querySelector('.add-ext-form');

    function postExtension(extension) {
        return new Promise((resolve, reject) => {
            fetch('/api/extension', {
                method: 'POST',
                body: JSON.stringify(extension),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(async (res) => {
                    console.log(res.status)
                    if (res.status === 201)
                        resolve(res.body);
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
        const result = postExtension({ extension, description });
        viewUpdateTrigger();
    })

})();
