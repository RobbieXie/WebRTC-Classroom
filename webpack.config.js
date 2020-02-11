const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        teacher: path.join(__dirname, "FrontProjects", "Teacher", "src", "main.js"),
        student: path.join(__dirname, "FrontProjects", "Student", "src", "main.js")
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js"
    },

    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: 'html-loader'
            }
        ]
    }

};