var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var page;

var groceryList = new GroceryListViewModel([]);
var pageData = observableModule.fromObject({
    groceryList: groceryList,
    grocery: ""
});

exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("groceryList");

    if (page.ios) {
        swipeDelete.enable(listView, function(index) {
            groceryList.delete(index);
        });
    }

    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 0.2,
            duration: 1000
        });
    });
};

exports.add = function()
{
    // Check for empty submissions
    if (pageData.get("product").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("product").dismissSoftInput();
        groceryList.add(pageData.get("product"))
            .catch(function(error)
            {
                console.log(error);
                dialogsModule.alert({
                    message: "An error occurred while adding an item to your list.",
                    okButtonText: "OK"
                });
            });
        dialogsModule.alert({
          message: "Product added successfully",
          okButtonText: "OK"
        });

        // Empty the input field
        pageData.set("product", "");
    }
    else {
        dialogsModule.alert({
            message: "Enter a name",
            okButtonText: "OK"
        });
    }
};

exports.view = function()
{
    var topFrame = frameModule.topmost();
    topFrame.navigate("views/view_products/view_products")
};
