import express, {Router} from 'express';
import { authenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from './controller/authController';
import { UploadImage } from './controller/imageController';
import { Chart, ExportToCsv, fetchAllOrder } from './controller/orderController';
import { fetchPermission } from './controller/permissionController';
import { createProduct, DeleteProduct, fetchAllProduct, getOneProduct, UpdateProduct } from './controller/productController';
import { createRole, DeleteRole, fetchRole, getOneRole, UpdateRole } from './controller/roleController';
import { createUser, DeleteUser, fetchAllUser, getOneUser, UpdateUser } from './controller/userController';
import { authMiddleware } from './middleware/auth.middleware';
import { permissionMiddleware } from './middleware/permission.middleware';

export const routes = (router: Router )=>{
    router.post('/api/register', Register)
    router.post('/api/login', Login)
    router.get('/api/user', authMiddleware, authenticatedUser)
    router.post('/api/logout', authMiddleware, Logout)
    router.put('/api/user/update', authMiddleware, UpdateInfo)
    router.put('/api/user/update/password', authMiddleware, UpdatePassword)


    router.get('/api/users', authMiddleware, permissionMiddleware('User'), fetchAllUser)
    router.get('/api/users/:id', authMiddleware, permissionMiddleware('User'), getOneUser)
    router.post('/api/users', authMiddleware, permissionMiddleware('User'), createUser)
    router.put('/api/users/:id', authMiddleware,permissionMiddleware('User'),  UpdateUser)
    router.delete('/api/users/:id', authMiddleware, permissionMiddleware('User'), DeleteUser)


    router.get('/api/permission', authMiddleware, permissionMiddleware('Role'), fetchPermission)

    router.get('/api/role', authMiddleware, permissionMiddleware('Role'), fetchRole)
    router.get('/api/role/:id', authMiddleware, permissionMiddleware('Role'), getOneRole)
    router.post('/api/role', authMiddleware, permissionMiddleware('Role'), createRole)
    router.put('/api/role/:id', authMiddleware, permissionMiddleware('Role'), UpdateRole)
    router.delete('/api/role/:id', authMiddleware, permissionMiddleware('Role'), DeleteRole)

    router.post('/api/upload', authMiddleware, UploadImage)
    router.use('/api/uploads', express.static('./upload'))

    router.get('/api/product', authMiddleware, permissionMiddleware('Product'), fetchAllProduct)
    router.get('/api/product/:id', authMiddleware,  permissionMiddleware('Product'), getOneProduct)
    router.post('/api/product', authMiddleware, permissionMiddleware('Product'), createProduct)
    router.put('/api/product/:id', authMiddleware, permissionMiddleware('Product'), UpdateProduct)
    router.delete('/api/product/:id', authMiddleware, permissionMiddleware('Product'), DeleteProduct)

    router.get('/api/order', authMiddleware, fetchAllOrder)
    router.post('/api/export', authMiddleware, ExportToCsv)
    router.get('/api/chart', authMiddleware, Chart)
    // router.get('/api/order/:id', authMiddleware, getOneProduct)
    // router.post('/api/order', authMiddleware, createProduct)
    // router.put('/api/order/:id', authMiddleware, UpdateProduct)
    // router.delete('/api/order/:id', authMiddleware, DeleteProduct)
}