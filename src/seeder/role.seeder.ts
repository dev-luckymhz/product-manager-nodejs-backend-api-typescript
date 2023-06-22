import { createConnection, getManager } from "typeorm";
import { Permission } from "../entity/permission.entity";
import { Role } from "../entity/role.entity";

// Establish a database connection
createConnection().then(async (result) => {
    const permissionRepository = getManager().getRepository(Permission); // Get the repository for the Permission entity

    const params = ['viewUser', 'viewRole', 'viewProduct', 'viewOrder', 'editUser', 'editRole', 'editProduct', 'editOrder'];
    let permissions = [];

    // Create permissions for each parameter
    for (let i = 0; i < params.length; i++) {
        // Save the permission to the database and push it to the permissions array
        permissions.push(await permissionRepository.save({ name: params[i] }).catch((err) => {
            console.log(err);
        }));
    }

    const roleRepository = getManager().getRepository(Role); // Get the repository for the Role entity

    try {
        // Save roles with corresponding permissions
        await roleRepository.save({
            name: "Admin",
            permissions
        });

        // Remove specific permissions for the Editor role
        delete permissions[5];
        await roleRepository.save({
            name: "Editor",
            permissions
        });

        // Remove specific permissions for the Viewer role
        delete permissions[4];
        delete permissions[5];
        delete permissions[6];
        await roleRepository.save({
            name: "Viewer",
            permissions
        });
    } catch (error) {
        console.log(error);
    }

    process.exit(0); // Exit the script once the data initialization is complete
}).catch((err) => {
    console.log(err);
});
