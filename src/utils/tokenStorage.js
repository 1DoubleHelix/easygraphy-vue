export const setToken = (tokenKey, token) => {
    return localStorage.setItem(tokenKey, token)
}
export const getToken = (tokenKey) => {
    return localStorage.getItem(tokenKey)
}
export const removeToken = (tokenKey) => {
    return localStorage.removeItem(tokenKey)
}