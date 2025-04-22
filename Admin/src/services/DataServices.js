app.service('DataServices', function ($http, APIService) {
    var service = this;

    const token = localStorage.getItem('token');

    const headers = {
        'Authorization': 'Bearer ' + token
    };

    service.getAllCategory = function () {
        return APIService.callAPI('category', 'GET', null, null)
            .then(function (response) {
                return response.data.listCategory;
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }

    service.getAllUser = function () {
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.reject('Không tìm thấy token');
        }

        const headers = {
            'Authorization': 'Bearer ' + token
        };

        return APIService.callAPI('user', 'GET', null, headers)
            .then(function (response) {
                if (response && response.data && response.data.users) {
                    return response.data.users;
                } else {
                    throw new Error('Dữ liệu không hợp lệ');
                }
            })
            .catch(function (error) {
                if (error.status === 401) {
                    // Token hết hạn hoặc không hợp lệ
                    localStorage.removeItem('token');
                    localStorage.removeItem('name');
                    localStorage.removeItem('_id');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                }
                throw error;
            });
    }

    service.getAllProduct = function () {
        return APIService.callAPI('product', 'GET', null, headers)
            .then(function (response) {
                return response.data.products;
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }

    service.getProductById = function (id) {
        return APIService.callAPI('product/' + id, 'GET', null, headers)
            .then(function (response) {
                return response.data.productData;
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }

    service.getAllCoupon = function () {
        return APIService.callAPI('coupon', 'GET', null, headers)
            .then(function (response) {
                return response.data.listCoupon;
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }

    service.getAllOrder = function () {
        return APIService.callAPI('bill', 'GET', null, headers)
            .then(function (response) {
                return response.data.data;
            })
            .catch(function (error) {
                console.error('Lỗi khi gửi yêu cầu API:', error);
            });
    }
})