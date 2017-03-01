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
            $rootScope.$state.go('tableView');
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

    var tableViewState = {
        name: 'tableView',
        url: '/tableView',
        templateUrl : 'tpls/tableView.html',
        controller:'tableViewCtrl',
        controllerProvider : function($rootScope){
            if($rootScope.$state.isLogin == false){
                $rootScope.$state.go('login');
            }
            return function(){};
        }
    };

    $stateProvider.state(loginState);
    $stateProvider.state(aboutState);
    $stateProvider.state(tableViewState);
});

app.controller('aboutCtrl', function($scope, $http) {

});

app.controller('tableViewCtrl', function($scope, $http) {
    $scope.choose="个人信息";
    $scope.toChild = function () {
        //注册一个向下传播的事件，eventName:'FromSelf', data:oneObject
        $scope.$broadcast("FromSelf", { chooseIndex:$scope.choose });
    };
    $http.get("data/myData.php")
        .success(function (response) {
            $scope.tableTitle = response.title;
            $scope.users = response.records;
        });
    $scope.showPerson=function(){
        //向右侧面板传递信息，改变右侧的表格
        $scope.toChild();
    };
    
}).directive('hello', function () {
    return{
        restrict:'AE',
        replace:true,
        template:function(tElement,tAttrs){
            var _html = '';
            _html += '<li class="list-group-item" ng-click="showPerson()">'+tAttrs.title+'</div>';

            return _html;
        },
        scope: true,
        link: function (scope,elements) {
            elements.bind('click', function () {
                if( elements.css('background-color')=="rgb(173, 216, 230)"){
                    elements.css('background-color','rgb(230, 200, 200)');
                }
                else{
                    elements.css('background-color','rgb(173, 216, 230)');
                }


            });
        }
    }
});
// 用于将出生日期转化为年月日的过滤器
app.filter('birthdayForm', function () {
    return function (number) {
        var year=number.substring(0,4);
        var month=number.substring(5,6);
        var date=number.substring(7,8);
        return year+"年"+month+"月"+date+"日";
    }
});

app.controller('tableContentCtrl', function($scope,$http){

    //$on用于截获来自父级作用域的事件
    $scope.$on("FromSelf", function (event, data) {
        $http.get("data/myData.php")
            .success(function (response) {
                $scope.tableTitle = data.chooseIndex;
                // $scope.tableTitle = response.title;
                $scope.users = response.records;
            });
    });

});



