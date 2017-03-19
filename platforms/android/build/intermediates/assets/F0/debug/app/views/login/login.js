
var dialogsModule = require("ui/dialogs");
var UserViewModel = require("../../shared/view-models/user-view-model");//user model class
var user = new UserViewModel({
  email: "teest@gmail.com",
  password: "qwerty"
}); //user object

var frameModule = require("ui/frame");
var page;
var email;

exports.page_loaded = function(args)
{
  page = args.object;
  page.bindingContext = user; //Bound observable
};

exports.signup = function()
{
  var visibleFrame = frameModule.topmost();
  visibleFrame.navigate("views/register/register");
};

exports.login = function()
{
  user.login()
        .catch(function(error) {
            console.log(error);
            dialogsModule.alert({
                message: "Unfortunately we could not find your account.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function() {
            frameModule.topmost().navigate("views/view_products/view_products");
        });
};
