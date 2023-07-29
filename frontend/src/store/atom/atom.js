import { atom } from "recoil";

export const authState = atom({
    key: 'authState',
    default: false
})

export const tokenState = atom({
    key: 'tokenState',
    default: localStorage.getItem('token')
})


export default authState