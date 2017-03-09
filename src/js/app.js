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
    //默认界面是登录界面
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
    //嵌套路由1
    var tableViewUser1State = {
        name: 'tableView.user1',
        url: '/user1',
        templateUrl : 'tpls/user1.html',
        controller:'user1Ctrl'
    };
    //嵌套路由2
    var tableViewUser2State = {
        name: 'tableView.user2',
        url: '/user2',
        templateUrl : 'tpls/user2.html',
        controller:'user2Ctrl'
    };

    $stateProvider.state(loginState);
    $stateProvider.state(aboutState);
    $stateProvider.state(tableViewState);
    $stateProvider.state(tableViewUser1State);
    $stateProvider.state(tableViewUser2State);
});

app.controller('aboutCtrl', function($scope, $http) {

});

app.controller('tableViewCtrl', function($scope, $http,$rootScope) {
    $scope.choose="个人信息";
    $scope.toChild = function () {
        //注册一个向下传播的事件
        $scope.$broadcast("FromSelf", { chooseIndex:$scope.choose });
    };
    $http.get("data/myData1.php")
        .success(function (response) {
            $scope.tableTitle = $scope.choose;
            $scope.users = response.records;
            $rootScope.$state.go('tableView.user1');

        });

    $scope.showPerson=function(event){
        $scope.choose=event.currentTarget.getAttribute('name');
        //向右侧面板传递信息，改变右侧的表格
        $scope.toChild();
    };
    // $scope.showPerson();
    
}).directive('hello', function () {
    return{
        restrict:'AE',
        replace:true,
        template:function(tElement,tAttrs){
            var _html = '';
            _html += '<li class="list-group-item" ng-click="showPerson($event)">'+tAttrs.name+'</div>';

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

//根据点击的表，查询结果显示在右侧
app.controller('tableContentCtrl', function($rootScope,$scope,$http){

    //$on用于截获来自父级作用域的事件
    $scope.$on("FromSelf", function (event, data) {
        switch($scope.choose){
            case "个人信息":{
                $http.get("data/myData1.php")
                    .success(function (response) {
                        $scope.tableTitle = response.title;
                        $scope.users = response.records;
                        $rootScope.$state.go('tableView.user1');
                    });
                // var promise=$http({
                //     method:'get',
                //     url:"data/myData1.php"
                // });
                // promise.then(function(resp){
                //     //resp是一个响应对象
                //     console.log(resp);
                // },function(resp){
                //     //带有错误信息的resp
                // });

                break;
            }
            case "团队风采":{
                $http.get("data/myData2.php")
                    .success(function (response) {
                        $scope.tableTitle = response.title;
                        $scope.users = response.records;
                        $rootScope.$state.go('tableView.user2');
                    });

                break;
            }
            default:{
                $http.get("data/myData1.php")
                    .success(function (response) {
                        $scope.tableTitle = response.title;
                        $scope.users = response.records;
                        $rootScope.$state.go('tableView.user1');

                    });

                break;
            }
        }


    });

});
//右侧表格1
app.controller('user1Ctrl', function($scope){

});
//右侧表格2
app.controller('user2Ctrl', function($scope){
    console.log($scope);
});

function changeMe(){
    $("#me").text("1221");
}


