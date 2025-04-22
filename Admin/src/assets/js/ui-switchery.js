/**
 * Created by betim on 4/11/2017.
 */

(function (app) {

    app.provider("uiSwitcheryConfig", function () {
        this.setOptions = function (options) {
            this.options = options;
        }
        this.$get = function () {
            return this;
        }
    });

    app.directive("uiSwitchery", ["$parse", "uiSwitcheryConfig", uiSwitchery]);
    function uiSwitchery($parse, uiSwitcheryConfig) {
        return {
            restrict: "A",
            require: "^ngModel",
            scope: true,
            link: function (scope, element, attrs, ngModel) {
                var options = $parse(attrs.uiSwitchery)(scope) || uiSwitcheryConfig.options;
                var switchery = new Switchery(element[0], options);

                element[0].addEventListener('change', function() {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element[0].checked);
                    });
                });

                scope.$watch(attrs.ngModel, function (value) {
                    switchery.handleOnchange(value);
                });
                
                scope.$watch(attrs.ngDisabled, function (value) {
                    if (switchery) {
                        value ? switchery.disable() : switchery.enable();
                    }
                });
                
                scope.$on('$destroy', function () {
                    if (switchery) {
                        switchery.destroy();
                    }
                });
            }
        }
    }
})(angular.module("ui.switchery", []));