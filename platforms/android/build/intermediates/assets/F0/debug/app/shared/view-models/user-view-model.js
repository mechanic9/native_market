var config = require("../../shared/config");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable; //import Observable class
var validator = require("email-validator");

function User(info) {

    info = info || {};

    // New Observable for user model
    var viewModel = new Observable({
        email: info.email || "",
        password: info.password || ""
    });

    //login through api
    viewModel.login = function() {
        return fetchModule.fetch(config.apiUrl + "oauth/token", {
            method: "POST",
            body: JSON.stringify({
                username: viewModel.get("email"),
                password: viewModel.get("password"),
                grant_type: "password"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)//Validate response
        .then(function(response) {
            return response.json();
        })//Convert response to json
        .then(function(data) {
            config.token = data.Result.access_token; //saves user access token to config
        });
    };

    viewModel.register = function() //Sign up through api
    {
        return fetchModule.fetch(config.apiUrl + "Users", {
            method: "POST",
            body: JSON.stringify({
                Username: viewModel.get("email"),
                Email: viewModel.get("email"),
                Password: viewModel.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleErrors); //Validate response
    };

    viewModel.isValidEmail = function() //Validate email from observable
    {
        var email = this.get("email");
        return validator.validate(email);
    };

    return viewModel;
}

function handleErrors(response) //Validate response
{
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = User; //Export for use outside
