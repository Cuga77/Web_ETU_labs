$(function () {
    const $formAdd = $('#formAdd');
    const $formEdit = $('#formEdit');

    if ($formAdd.length) {
        $formAdd.on('submit', function (e) {
            e.preventDefault();
            const form = this;
            const formData = new FormData(form);
            $.ajax({
                url: '/api/user',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (json) {
                    if (json && json._id) {
                        window.location.href = `/users/${json._id}/`;
                    } else if (json && json.error) {
                        alert(json.statusCode + ' ' + json.error);
                    }
                },
                error: function (xhr) {
                    alert(xhr.responseText || 'Ошибка');
                }
            });
        });
    }

    if ($formEdit.length) {
        $formEdit.on('submit', function (e) {
            e.preventDefault();
            const form = this;
            const formData = new FormData(form);
            const id = $formEdit.find('input[name="id"]').val();
            $.ajax({
                url: `/api/user/${id}`,
                method: 'PATCH',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    window.location.href = `/users/${id}/`;
                },
                error: function (xhr) {
                    console.error(xhr.responseText || 'Ошибка');
                }
            });
        });
    }
});
