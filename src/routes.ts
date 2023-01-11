import {Router} from 'express';
import { Register } from './controller/authController';

export const routes = (router: Router )=>{
    router.post('/api/register', Register)
}