import axios from "axios"
import { languages } from "./Languages"

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})

export const ExecuteCode = async (language: string, sourceCode: string) => {
    const response = await API.post("/execute", {
        "language": language,
        "version": languages[language],
        "files": [
            {
                "content": sourceCode,
            }
        ],
    })
    return response.data;
}


