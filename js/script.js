$(document).ready(function () {
    let api_url = 'https://6445af8f0431e885f00279d9.mockapi.io/api/b2c/products';
    let $modal = $('#modal');
    let $tbody = $('#table-body');
    const MODALCONTENT = $modal.find('.modal-body').html();
    const SUCCESS = 'success';
    const ERROR = 'error';

    // READ - Obtener todos los productos
    function getProducts() {
        $.get(api_url, function (products, status) {
            if (status === ERROR) {
                console.log('Se ha producido un error');
            }else if (status === SUCCESS) {
                $tbody.empty();
                $.each(products, function (i, product) {
                    let $tr = $('<tr></tr>');
                    let $name_td = $('<td>' + product.name + '</td>');
                    let $description_td = $('<td>' + product.description + '</td>');
                    let $status_td = $('<td>' + product.status + '</td>');
                    let $button_td = $('<td></td>');
                    let $edit_button = $('<button class="btn btn-sm btn-outline-secondary mr-2">Editar</button>');
                    let $delete_button = $('<button class="btn btn-sm btn-outline-danger">Eliminar</button>');
                    
                    $edit_button.data('product', product);
                    $edit_button.click(editProduct);
                    $delete_button.data('product', product);
                    $delete_button.click(confirmDeleteProduct);
                    
                    $tr.append($name_td);
                    $tr.append($description_td);
                    $tr.append($status_td);
                    $button_td.append($edit_button);
                    $button_td.append($delete_button);
                    $tr.append($button_td);
                    $tbody.append($tr);
                });
            }
        });
    }

    // CREATE - Mostrar modal para agregar nuevo producto
    function addProduct() {
        $modal.find('.modal-title').text('Agregar nuevo producto');
        $modal.find('.modal-body').html(MODALCONTENT);
        $modal.find('#save').text('Guardar');
        $modal.find('#form')[0].reset();
        $modal.find('#name-msg').removeClass('d-block').addClass('d-none');
        $modal.find('#description-msg').removeClass('d-block').addClass('d-none');
        $modal.modal('show');
        $modal.find('#save').off('click').on('click', function () {
            if (checkFields()) {
                saveNewProduct();
            }
        });
    }

    // CREATE - Guardar nuevo producto
    function saveNewProduct() {
        let date = new Date();
        let isoDate = date.toISOString();

        let product = {
            createdAt: isoDate,
            name: $modal.find('#name').val(),
            avatar: 'https://loremflickr.com/640/480/technics',
            description: $modal.find('#description').val(),
            status: $modal.find('#status').val() === 'true',
            manufacturer: 'nombre de la compañia',
            address: 'dirección'
        };

        $.ajax({
            url: api_url,
            type: 'POST',
            data: product,
            success: function () {
                $modal.modal('hide');
                getProducts();
            },
            error: function(jqXHR, exception){
                console.log(jqXHR.status + ': ' + exception);
            }
        });
    }

    // UPDATE - Mostrar modal para editar producto
    function editProduct() {
        let product = $(this).data('product');

        $modal.find('.modal-title').text('Editar producto');
        $modal.find('.modal-body').html(MODALCONTENT);
        $modal.find('#save').text('Guardar');
        $modal.find('#name').val(product.name);
        $modal.find('#description').val(product.description);
        $modal.find('#status').val(product.status.toString());
        $modal.find('#name-msg').removeClass('d-block').addClass('d-none');
        $modal.find('#description-msg').removeClass('d-block').addClass('d-none');
        $modal.modal('show');
        $modal.find('#save').off('click').on('click', function () {
            if (checkFields()) {
                saveEditedProduct(product);
            }
        });
    }

    // UPDATE - Guardar producto editado
    function saveEditedProduct(product) {
        let update_data = {
            name: $modal.find('#name').val(),
            description: $modal.find('#description').val(),
            status: $modal.find('#status').val() === 'true'
        };

        $.ajax({
            url: api_url + '/' + product.id,
            type: 'PUT',
            data: update_data,
            success: function () {
                $modal.modal('hide');
                getProducts();
            },
            error: function(jqXHR, exception){
                console.log(jqXHR.status + ': ' + exception);
            }
        });
    }

    // DELETE - Mostrar modal de confirmación
    function confirmDeleteProduct() {
        let product = $(this).data('product');

        $modal.find('.modal-title').text('Eliminar producto');
        $modal.find('.modal-body').html('<p>¿Está seguro de que desea eliminar el producto "' + product.name + '"?</p>');
        $modal.find('#save').text('Eliminar');
        $modal.modal('show');
        $modal.find('#save').off('click').on('click', function () {
            deleteProduct(product);
        });
    }

    // DELETE - Eliminar producto
    function deleteProduct(product) {
        $.ajax({
            url: api_url + '/' + product.id,
            type: 'DELETE',
            success: function () {
                $modal.modal('hide');
                getProducts();
            },
            error: function(jqXHR, exception){
                console.log(jqXHR.status + ': ' + exception);
            }
        });
    }

    function checkFields() {
        // Verificar si los campos requeridos están completos
        let name = $('#name').val().trim();
        let description = $('#description').val().trim();

        $modal.find('#name-msg').removeClass('d-block').addClass('d-none');
        $modal.find('#description-msg').removeClass('d-block').addClass('d-none');

        if (!name) {
            $modal.find('#name-msg').removeClass('d-none').addClass('d-block');
            return 0;
        }

        if (!description) {
            $modal.find('#description-msg').removeClass('d-none').addClass('d-block');
            return 0;
        }

        return 1;
    }

    // vincular botón para agregar un nuevo producto
    $('#add').on('click', function () {
        addProduct();
    });

    // carga de la página inicial
    getProducts();
});