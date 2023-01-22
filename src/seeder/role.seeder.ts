import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";
import { Role } from "../entity/role.entity";

createConnection().then(async (result) => {
    const permissionRepository = getManager().getRepository(Permission);
    const params = ['viewUser', 'viewRole', 'viewProduct', 'viewOrder', 'editUser', 'editRole', 'editProduct', 'editOrder'];
    let permissions = [];
    for (let i = 0; i < params.length; i++) {
        permissions.push(await permissionRepository.save({name:params[i]}).catch((err) => {
            console.log(err);  
        }));
    }

    const roleRepository = getManager().getRepository(Role);
        try {    
            await roleRepository.save({
                name: "Admin",
                permissions
            })
            delete permissions[5];
            await roleRepository.save({
                name: "Editor",
                permissions
            })
            delete permissions[4];
            delete permissions[5];
            delete permissions[6];
            await roleRepository.save({
                name: "Editor",
                permissions
            })
        } catch (error) {
            console.log(error);
        }
    process.exit(0);
}).catch((err) => {
    console.log(err);
    
});