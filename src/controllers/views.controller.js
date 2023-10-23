class ViewsController {
    loginView = (req, res) =>{
        res.render("loginView", {
            style: "index.css"
        })
    }

    registerView = (req, res) =>{
        res.render("registerView", {
            style: "index.css"
        })
    }

    productView = (req, res) =>{
        res.render("productView", {
            style: "index.css"
        })
    }

    errorView = (req, res) =>{
        res.render("errorView", {
            style: "index.css"
        })
    }
}

module.exports = new ViewsController()