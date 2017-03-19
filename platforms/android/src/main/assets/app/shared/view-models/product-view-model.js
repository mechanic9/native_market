var config = require("../../shared/config");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function ProductViewModel(items) {
    var viewModel = new ObservableArray(items);

    viewModel.load = function() {
        return fetch(config.apiUrl + "Groceries", {
            headers: {
                "Authorization": "Bearer " + config.token
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            data.Result.forEach(function(product) {
                viewModel.push({
                    name: product.Name,
                    id: product.Id
                });
            });
        });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    viewModel.add = function(product) {
        return fetch(config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: product
            }),
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            viewModel.push({ name: product, id: data.Result.Id });
        });
    };

    viewModel.delete = function(index) {
        return fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
            method: "DELETE",
            headers: {
    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = ProductViewModel;
