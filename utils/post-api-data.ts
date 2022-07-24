import axios from "axios"
import Image from "../types/image"

export const postApiData = async <T>(path: string, payload:Image) => {
    return await axios.post<T>(path, payload).catch(err => err.response).then(response => {
        return response.data
    })
}

export default postApiData
