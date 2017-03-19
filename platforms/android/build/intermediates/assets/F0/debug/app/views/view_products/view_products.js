var dialogsModule = require("ui/dialogs");
var frameModule = require("ui/frame");
var observableModule = require("data/observable");
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var socialShare = require("nativescript-social-share");
var swipeDelete = require("../../shared/utils/ios-swipe-delete");
var page;

var productList = new GroceryListViewModel([]);
var pageData = observableModule.fromObject({
    productList: productList,
    grocery: ""
});

exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("productList");

    if (page.ios) {
        swipeDelete.enable(listView, function(index) {
            productList.delete(index);
        });
    }

    page.bindingContext = pageData;

    productList.empty();
    pageData.set("isLoading", true);
    productList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 0.9,
            duration: 1000
        });
    });
};

exports.new_product = function()
{
  var visibleFrame = frameModule.topmost();
  visibleFrame.navigate("views/new_product/new_product");
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = productList.length; i < size ; i++) {
        list.push(productList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};

exports.delete = function(args) {
    var item = args.view.bindingContext;
    var index = productList.indexOf(item);
    productList.delete(index);
};
