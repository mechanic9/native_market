var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var ProductViewModel = require("../../shared/view-models/product-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var page;

var productList = new ProductViewModel([]);
var pageData = observableModule.fromObject({
    product: ""
});

exports.loaded = function(args) {
    page = args.object;

    page.bindingContext = pageData;
    pageData.set("isLoading", true);
};

exports.add = function()
{
    // Check for empty submissions
    if (pageData.get("product").trim() !== "") {
        // Dismiss the keyboard
        page.getViewById("product").dismissSoftInput();
        productList.add(pageData.get("product"))
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
