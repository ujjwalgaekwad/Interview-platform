import { Router } from "express";
import {
    createSession,
    updateSession,
    deleteSession,
    getSession,
    getSessionData,
    getAllSessions,
} from "../controllers/session.controller";

const router = Router()

router.route('/').post(createSession).delete(deleteSession)
router.route('/data/:socketId').get(getSessionData)
router.route('/:userId').get(getSession).patch(updateSession)
router.route('/all/:userId').get(getAllSessions)

export default router;