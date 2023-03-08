import { defineStore } from "pinia";

export const userStore = defineStore('main', {
    state: () => {
        return {
            id: 0,
            username: "",
            nickname: "",
            token: ""
        }
    },
    getters: {},
    actions: {},
    persist: true
})