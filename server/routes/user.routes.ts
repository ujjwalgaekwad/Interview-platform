import { Router } from "express";
import {
    saveFormData,
    getFormData
} from "../controllers/user.controller";

const router = Router()

router.route('/').post(saveFormData).get(getFormData)

export default router;