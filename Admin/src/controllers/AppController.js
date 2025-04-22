app.controller("AppController", function ($rootScope, APIService, $scope, $timeout, $window, jwtHelper, DataServices) {
    //lấy token
    const token = $window.localStorage.getItem('token');
    const headers = {
        Authorization: 'Bearer ' + token
    }

    $rootScope.isLogin = false;

    function checkAuth() {
        if (!token) {
            $window.location.href = 'login.html';
            return;
        }

        try {
            var decode = jwtHelper.decodeToken(token);
            if (decode.role !== 'admin') {
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('name');
                $window.localStorage.removeItem('_id');
                $window.localStorage.removeItem('user');
                $window.location.href = 'login.html';
            } else {
                $rootScope.isLogin = true;
            }
        } catch (error) {
            // Token invalid or expired
            $window.localStorage.removeItem('token');
            $window.localStorage.removeItem('name');
            $window.localStorage.removeItem('_id');
            $window.localStorage.removeItem('user');
            $window.location.href = 'login.html';
        }
    }

    checkAuth();

    $rootScope.logout = function () {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('name');
        $window.localStorage.removeItem('_id');
        $window.localStorage.removeItem('user');

        swal('Đăng xuất thành công', '', 'success');

        $timeout(function () {
            $window.location.href = 'login.html';
        }, 1000);
    }
});

