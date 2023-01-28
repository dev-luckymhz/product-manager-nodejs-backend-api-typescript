import express, {Router} from 'express';
import { authenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from './controller/authController';
import { UploadImage } from './controller/imageController';
import { fetchPermission } from './controller/permissionController';
import { createProduct, DeleteProduct, fetchAllProduct, getOneProduct, UpdateProduct } from './controller/productController';
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

    router.post('/api/upload', authMiddleware, UploadImage)
    router.use('/api/uploads', express.static('./upload'))

    router.get('/api/product', authMiddleware, fetchAllProduct)
    router.get('/api/prooduct/:id', authMiddleware, getOneProduct)
    router.post('/api/prooduct', authMiddleware, createProduct)
    router.put('/api/prooduct/:id', authMiddleware, UpdateProduct)
    router.delete('/api/prooduct/:id', authMiddleware, DeleteProduct)
}