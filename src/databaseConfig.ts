import {createConnection} from "typeorm";
import { User } from "./entity/user";

export default async function configDB() {
    const connection = await createConnection({
        name: "default",
        type: "sqlite",
        database: `${__dirname}/data.sqlite`,
        entities: [
            `${__dirname}/entity/*{.js,.ts}`
        ],
        synchronize: true
    })

    let userRepo = connection.getRepository(User)

    await userRepo.clear()

    const user = new User()
    user.description = "A coder"
    user.username = "Ezbob"

    await userRepo.save(user)

    return connection
}
