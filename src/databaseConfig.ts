import {createConnection} from "typeorm";
import { User } from "./entity/user";

export default async function configDB() {
    console.log("Setting up the database connection...")
    const connection = await createConnection({
        name: "default",
        type: "sqlite",
        database: `${__dirname}/data.sqlite`,
        entities: [
            `${__dirname}/entity/*{.js,.ts}`
        ],
        synchronize: true
    })

    console.log("Database connection set.")

    console.log("Creating database content...")
    let userRepo = connection.getRepository(User)

    await userRepo.clear()

    const user = new User()
    user.description = "A coder"
    user.username = "Ezbob"

    await userRepo.save(user)

    console.log("database content set.")

    return connection
}
