const BASE_API_URL = 'http://localhost:3000/api';

function extension() {

    const get = async (extensionId) => {
        throw "Not implemented"
    }

    const remove = async (extensionId) => {
        console.log(`${BASE_API_URL}/extension/${extensionId}`)
        const result = await fetch(`${BASE_API_URL}/extension/${extensionId}`, {
            method: 'DELETE'
        });
        return result.ok;
    }

    const update = async (extension) => {
        throw "Not implemented"
    }

    const create = async (extension) => {
        const result = await fetch(`${BASE_API_URL}/extension`, {
            method: 'POST',
            body: JSON.stringify(extension),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const extensionId = await result.text();
        return extensionId;
    }

    const findByName = async (searchString = '') => {
        const result = await fetch(`${BASE_API_URL}/extension?sExt=${searchString}`);
        const data = await result.json();
        data.sort((a, b) => a.extension.toString().localeCompare(b.extension.toString()))
        return data;
    }

    return {
        get,
        remove,
        create,
        findByName,
        update,
    }
}

const Api = {
    extension
}

export default Api
