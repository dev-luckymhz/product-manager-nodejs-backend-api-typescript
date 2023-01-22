import {Router} from 'express';
import { authenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from './controller/authController';
import { fetchPermission } from './controller/permissionController';
import { createRole, DeleteRole, fetchRole, getOneRole, UpdateRole } from './controller/roleController';
import { createUser, DeleteUser, fetchAllUser, getOneUser, UpdateUser } from './controller/userController';
import { authMiddleware } from './middleware/auth.middleware';

export const routes = (router: Router )=>{
    router.post('/api/register', Register)
    router.post('/api/login', Login)
    router.get('/api/user', authMiddleware, authenticatedUser)
    router.post('/api/logout', authMiddleware, Logout)
    router.put('/api/user/update', authMiddleware, UpdateInfo)
    router.put('/api/user/update/password', authMiddleware, UpdatePassword)


    router.get('/api/users', authMiddleware, fetchAllUser)
    router.get('/api/users/:id', authMiddleware, getOneUser)
    router.post('/api/users', authMiddleware, createUser)
    router.put('/api/users/:id', authMiddleware, UpdateUser)
    router.delete('/api/users/:id', authMiddleware, DeleteUser)


    router.get('/api/permission', authMiddleware, fetchPermission)

    router.get('/api/role', authMiddleware, fetchRole)
    router.get('/api/role/:id', authMiddleware, getOneRole)
    router.post('/api/role', authMiddleware, createRole)
    router.put('/api/role/:id', authMiddleware, UpdateRole)
    router.delete('/api/role/:id', authMiddleware, DeleteRole)
}