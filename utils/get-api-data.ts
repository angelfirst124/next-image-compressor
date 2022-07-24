import axios from "axios"

export const getApiData = async <T>(path: string) => {
  return await axios.get<T>(path).catch(err => err.response).then(response => {
    return response.data
  })
}

export default getApiData
