const BASE_API_URL = 'http://localhost:3000/api';

function extension() {

    const get = async (extensionId) => {
        throw "Not implemented"
    }

    const remove = async (extensionId) => {
        throw "Not implemented"
    }

    const create = async (extension) => {
        throw "Not implemented"
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
        findByName
    }
}

const Api = {
    extension
}

export default Api
