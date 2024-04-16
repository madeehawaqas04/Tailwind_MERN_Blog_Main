import express from 'express';
import { google, signin, signup,sendForgetPasswordOTP,changePassword } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/sendForgetPasswordOTP', sendForgetPasswordOTP);
router.post('/changePassword', changePassword);
router.post('/google', google)

export default router;