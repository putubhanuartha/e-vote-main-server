import { PrismaClient } from "@prisma/client";


abstract class UserController {
    prismaClient: PrismaClient = new PrismaClient()
    abstract login(): void;
    abstract logout(): void
}

export default UserController