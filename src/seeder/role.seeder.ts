import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";

createConnection().then((result) => {
    const permissionRepository = getManager().getRepository(Permission);
    const parms = ['viewUser', 'viewRole', 'viewProduct', 'viewOrder', 'editUser', 'editRole', 'editProduct', 'editOrder'];
}).catch((err) => {
    
});