import { defineStore } from "pinia";

export const userStore = defineStore('main', {
    state: () => {
        return {
            id: 0,
            username: "",
            nickname: "",
            token: "",
            email: "",
        }
    },
    getters: {},
    actions: {},
    persist: true
})