import RestApp, {RestErrorHandler} from "./rest/root"
import HttpRootApp, {HttpRootErrorHandler} from "./http/root"
import configDB from "./databaseConfig"

async function main() {
    await configDB()
    const port = 8080

    let rootApp = new HttpRootApp();
    let restApp = new RestApp();

    restApp.attachOnto(rootApp, "/api")

    restApp.attachErrorHandler(new RestErrorHandler())
    rootApp.attachErrorHandler(new HttpRootErrorHandler())

    rootApp.express.listen(port, () => console.log(`Listening on ${port}`))
}

main()