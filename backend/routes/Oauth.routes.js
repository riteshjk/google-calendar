import express from 'express';
import { getUser, userLogin } from '../controller/Oauth.controller.js';

const router = express.Router()

router.post("/login",userLogin)
router.get("/oauth2callback",getUser)



export default router