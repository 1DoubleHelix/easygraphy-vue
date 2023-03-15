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
export const deleteCombine = (params) => request.delete(`/combine/delete?id=${params}`)
export const detailCombine = (params) => request.get(`/api/combine/detail?id=${params}`)
export const searchCombine = (params) => request.get(`/api/combine/search?${qs.stringify(params)}`)

// dashboard

// blog
export const searchBlog = (params) => request.get(`/api/blog/search?${qs.stringify(params)}`)
export const deleteBlog = (params) => request.delete(`/blog/delete?id=${params}`)
export const blogDetail = (params) => request.get(`/api/blog/detail?id=${params}`)
export const blogUpdate = (params) => request.put("/blog/update", params)
export const blogAdd = (params) => request.post("/blog/add", params)

// tag
export const tagList = () => request.get("/api/tag/list")

// favorite
export const favoriteAdd = (params) => request.post("/favorite/add", params)
export const favoriteDelete = (params) => request.delete(`/favorite/delete?id=${params}`)
export const favoriteList = (params) => request.get(`/favorite/list?${qs.stringify(params)}`)

// auto match