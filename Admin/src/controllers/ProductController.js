app.controller("ProductController", function ($rootScope, $timeout, $scope, $location, DataServices, APIService, $routeParams) {
    $rootScope.title = "Quản Lý Sản Phẩm";

    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': 'Bearer ' + token,
    };

    $scope.products = [];
    $scope.categories = [];
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.pages = [];

    DataServices.getAllCategory().then(function (response) {
        $scope.categories = response;
    });

    DataServices.getAllProduct().then(function (response) {
        $scope.products = response;

        $scope.products.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        $scope.products.forEach(function (product) {
            product.isFlashSale = product.isFlashSale ? true : false;
        });

        updateDisplayedProduct();
    });

    function updateDisplayedProduct() {
        var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var endIndex = startIndex + $scope.itemsPerPage;
        $scope.displayedProducts = $scope.products.slice(startIndex, endIndex);

        // Tính toán số trang
        $scope.pages = [];
        var totalPages = Math.ceil($scope.products.length / $scope.itemsPerPage);
        for (var i = 1; i <= totalPages; i++) {
            $scope.pages.push(i);
        }
    }

    $scope.setCurrentPage = function (page) {
        $scope.currentPage = page;
        updateDisplayedProduct();
    }

    //thay đổi flash sale
    $scope.changeFlashSale = function (product) {
        var data = {
            isFlashSale: product.isFlashSale,
            pid: product._id
        };
        APIService.callAPI('product/' + product._id, 'PUT', data, headers)
            .then(function (response) {

                swal('Thành Công', 'Cập Nhật Thành Công', 'success');
            })
            .catch(function (error) {
                console.log(error);
                swal('Error', error.data.mes, 'error');
            });
    }

    $scope.variants = [
        {
            color: '',
            size: '',
            quantity: ''
        }
    ]

    // Thêm biến thể
    $scope.addVariant = function () {
        var newVariant = {
            color: '',
            size: '',
            quantity: ''
        };
        $scope.variants.push(newVariant);
    };

    // Thêm mới sản phẩm
    $scope.addProduct = function () {
        swal({
            title: 'Đang thêm sản phẩm',
            text: 'Vui lòng đợi trong giây lát',
            icon: 'info',
            buttons: false
        });

        var images = [];
        var files = document.getElementById('images').files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.type.match('image.*')) {
                continue;
            }
            images.push(file);
        }

        var product = {
            title: $scope.name,
            price: $scope.price,
            sale: $scope.sale || 0,
            description: $scope.description || 'Không có mô tả cho sản phẩm này',
            category: $scope.category,
            variants: $scope.variants,
            isFlashSale: $scope.isFlashSale
        };

        APIService.callAPI('product', 'POST', product, headers)
            .then(function (response) {
                var pid = response.data.createdProduct._id;

                var formData = new FormData();
                for (var i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }

                fetch('http://127.0.0.1:8080/api/product/upload/' + pid, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                })
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        swal('Thành Công', 'Thêm Sản Phẩm Thành Công', 'success');
                        $scope.products.push(data.product);
                        updateDisplayedProduct();

                        $timeout(function () {
                            $location.path('/product');
                        }, 1000);
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                        swal('Error', error.message || 'Có lỗi xảy ra khi tải ảnh', 'error');
                    });
            })
            .catch(function (error) {
                console.error('Error:', error);
                swal('Error', error.response.data.mes || 'Có lỗi xảy ra khi thêm sản phẩm', 'error');
            });

    };

    //xoá sản phẩm
    $scope.deleteProduct = function (product) {
        swal({
            title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            text: 'Sau khi xóa, bạn sẽ không thể khôi phục lại sản phẩm này!',
            icon: 'warning',
            buttons: true,
            dangerMode: true
        })
            .then((willDelete) => {
                if (willDelete) {
                    APIService.callAPI('product/' + product._id, 'DELETE', null, headers)
                        .then(function (response) {
                            var index = $scope.products.indexOf(product);
                            $scope.products.splice(index, 1);
                            updateDisplayedProduct();
                            swal('Thành Công', 'Xóa Sản Phẩm Thành Công', 'success');
                        })
                        .catch(function (error) {
                            console.log(error);
                            swal('Error', error.data.mes, 'error');
                        });
                }
            });
    }

    // Load product data for editing
    if ($routeParams.id) {
        APIService.callAPI('product/' + $routeParams.id, 'GET', null, headers)
            .then(function (response) {
                if (response.data) {
                    $scope.product = response.data;
                    // Ensure we're using the correct property names
                    $scope.product.categoryId = response.data.category?._id;
                    if ($scope.product.flashSaleEndTime) {
                        $scope.product.flashSaleEndTime = new Date($scope.product.flashSaleEndTime);
                    }
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                swal('Error', 'Không thể tải thông tin sản phẩm', 'error');
                $timeout(function() {
                    $location.path('/product');
                }, 1000);
            });
    }

    // Handle image upload
    $scope.handleImageUpload = function(files) {
        $scope.newImages = Array.from(files);
        $scope.$apply();
    };

    // Remove image
    $scope.removeImage = function(index) {
        $scope.product.images.splice(index, 1);
    };

    // Add variant
    $scope.addVariant = function() {
        if (!$scope.product.variants) {
            $scope.product.variants = [];
        }
        $scope.product.variants.push({
            color: '',
            size: '',
            quantity: 0
        });
    };

    // Remove variant
    $scope.removeVariant = function(index) {
        $scope.product.variants.splice(index, 1);
    };

    // Update product
    $scope.updateProduct = function() {
        swal({
            title: 'Đang cập nhật sản phẩm',
            text: 'Vui lòng đợi trong giây lát',
            icon: 'info',
            buttons: false
        });

        var productData = {
            title: $scope.product.title,
            description: $scope.product.description,
            price: $scope.product.price,
            quantity: $scope.product.quantity,
            category: $scope.product.categoryId,
            variants: $scope.product.variants || [],
            isFlashSale: $scope.product.isFlashSale || false,
            flashSalePrice: $scope.product.flashSalePrice,
            flashSaleEndTime: $scope.product.flashSaleEndTime,
            sale: $scope.product.sale || 0,
            images: $scope.product.images || []
        };

        APIService.callAPI('product/' + $routeParams.id, 'PUT', productData, headers)
            .then(function(response) {
                // If there are new images to upload
                if ($scope.newImages && $scope.newImages.length > 0) {
                    var formData = new FormData();
                    $scope.newImages.forEach(function(file) {
                        formData.append('images', file);
                    });

                    return fetch('http://127.0.0.1:8080/api/product/upload/' + $routeParams.id, {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        body: formData
                    }).then(function(response) {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    });
                }
                return response;
            })
            .then(function(response) {
                swal('Thành Công', 'Cập nhật sản phẩm thành công', 'success');
                $timeout(function() {
                    $location.path('/product');
                }, 1000);
            })
            .catch(function(error) {
                console.error('Error:', error);
                swal('Error', error.response?.data?.mes || 'Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
            });
    };
})