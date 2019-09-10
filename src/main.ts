import RestApp from "./rest/root"
import HttpRootApp from "./http/root"


function main() {
    const port = 8080

    let app = new HttpRootApp().app
    app.use("/api", new RestApp().app)

    app.listen(port, () => console.log(`Listening on ${port}`))
}

main()