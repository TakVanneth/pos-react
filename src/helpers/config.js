export const BASE_URL = 'http://backend.test/api'

export const getConfig = (token) => {
    const config = {
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return config
}