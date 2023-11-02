import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import UserController from "./User.controller";

class WargaController extends UserController {
    modelWarga: Prisma.WargaDelegate<DefaultArgs>
    constructor() {
        super()
        this.modelWarga = this.prismaClient.warga
    }
    login(): void {
        
    }
    logout(): void {

    }
    register() : void {

    }

}

export default WargaController