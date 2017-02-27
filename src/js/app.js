/**
 * Created by Administrator on 2017/2/26.
 */

var app = angular.module('myApp',['ui.router']);
app.controller('loginCtrl', function($scope,$rootScope) {
    $scope.userName = "";
    $scope.userPass = "";
    $scope.verify = false;
    // 登录操作
    $scope.login=function(){

        if($scope.userName=="1" && $scope.userPass=="1"){
            $rootScope.$state.isLogin = true;
            $rootScope.$state.go('map');
        }
        else{
            $scope.verify = true;
        }
    };
    // 重置操作
    $scope.reset=function(){
        $scope.userName = "";
        $scope.userPass = "";
        $scope.verify = false;
    };
});
app.run(function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$state.isLogin = false;
});

app.config(function($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    var loginState = {
        name: 'login',
        url: '/login',
        templateUrl : 'tpls/login.html',
        controller:'loginCtrl'
    };
    var aboutState = {
        name: 'about',
        url: '/about',
        templateUrl : 'tpls/about.html',
        controller:'aboutCtrl'
    };

    var mapState = {
        name: 'map',
        url: '/map',
        templateUrl : 'tpls/3dMap.html',
        controller:'mapCtrl',
        controllerProvider : function($rootScope){
            if($rootScope.$state.isLogin == false){
                $rootScope.$state.go('login');
            }
            return function(){};
        }
    };

    $stateProvider.state(loginState);
    $stateProvider.state(aboutState);
    $stateProvider.state(mapState);
});


app.controller('mapCtrl', function($scope) {

});
app.controller('aboutCtrl', function($scope) {

});