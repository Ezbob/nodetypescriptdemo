import RestApp from "./rest/root"
import HttpRootApp from "./http/root"
import configDB from "./databaseConfig"

async function main() {
    await configDB()
    const port = 8080

    let rootApp = new HttpRootApp();
    let restApp = new RestApp();

    restApp.attachOnto("/api", rootApp)

    rootApp.errorHandling()

    rootApp.express.listen(port, () => console.log(`Listening on ${port}`))
}

main()