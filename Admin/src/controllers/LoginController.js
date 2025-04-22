app.controller("LoginController", function ($scope, APIService, $location, $timeout, jwtHelper, $window) {
    function checkToken() {
        const token = $window.localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtHelper.decodeToken(token);
                if (decoded.role === 'admin') {
                    $window.location.href = 'index.html';
                } else {
                    // Clear invalid token
                    $window.localStorage.removeItem('token');
                    $window.localStorage.removeItem('name');
                    $window.localStorage.removeItem('_id');
                    $window.localStorage.removeItem('user');
                }
            } catch (error) {
                // Clear invalid token
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('name');
                $window.localStorage.removeItem('_id');
                $window.localStorage.removeItem('user');
            }
        }
    }

    checkToken();

    $scope.login = function () {
        swal({
            title: "Đang xử lý",
            text: "Vui lòng chờ trong giây lát...",
            icon: "info",
            button: false
        });

        var data = {
            email: $scope.email,
            password: $scope.password
        };

        APIService.callAPI("user/login", "POST", data, null)
            .then(function (response) {
                var decoded = jwtHelper.decodeToken(response.data.accessToken);

                if (decoded.role === "admin") {
                    $window.localStorage.setItem('token', response.data.accessToken);
                    $window.localStorage.setItem('name', response.data.userData.name);
                    $window.localStorage.setItem('_id', response.data.userData._id);

                    var user = JSON.stringify(response.data.userData);
                    $window.localStorage.setItem('user', user);

                    $window.localStorage.setItem('role', decoded.role);

                    swal('Đăng nhập thành công', '', 'success');

                    $timeout(function () {
                        $window.location.href = 'index.html';
                    }, 1000);
                } else {
                    swal('Đăng nhập thất bại', 'Bạn không có quyền truy cập nội dung này', 'error');
                }
            })
            .catch(function (error) {
                swal('Đăng nhập thất bại', error.data.mes, 'error');
            });
    }
});