import request from "../utils/request";
import qs from 'qs'

export const test = (params) => request.get("/api/test/test", params)

// user
export const login = (params) => request.post("/api/user/login", params)
export const register = (params) => request.post("/api/user/register", params)

// camera
export const searchCamera = (params) => request.get(`/api/camera/search?${qs.stringify(params)}`)
export const cameraDetail = (params) => request.get(`/api/camera/detail?id=${params}`)

// lens
export const searchLens = (params) => request.get(`/api/lens/search?${qs.stringify(params)}`)
export const lensDetail = (params) => request.get(`/api/lens/detail?id=${params}`)

// comment
export const searchComment = (params) => request.get(`/api/comment/search?${qs.stringify(params)}`)
export const addComment = (params) => request.post("/comment/add", params)

// combine
export const addCombine = (params) => request.post("/combine/add", params)