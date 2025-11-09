$(function () {
    // Навигация по клику на строку (кроме кнопок действий)
    $('table#usersTable tbody').on('click', 'tr', function (e) {
        if ($(e.target).closest('.no-row-nav').length) return; // игнор
        const id = $(this).data('id');
        if (id) window.location.href = `/users/${id}/`;
    });

    // Диалог подтверждения удаления
    let $dialog;
    function openDeleteDialog(userId, onConfirm) {
        const $hidden = $('#deleteUserId');
        $hidden.val(userId);
        if (!$dialog) {
            $dialog = $('#confirmDialog').dialog({
                autoOpen: false,
                modal: true,
                buttons: {
                    'Удалить': function () {
                        const id = $hidden.val();
                        onConfirm && onConfirm(id);
                        $(this).dialog('close');
                    },
                    'Отмена': function () { $(this).dialog('close'); }
                }
            });
        }
        $dialog.dialog('open');
    }

    // Кнопка удаления пользователя
    $('table#usersTable').on('click', '.btn-delete', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        openDeleteDialog(id, function (uid) {
            $.ajax({
                url: `/api/user/${uid}`,
                method: 'DELETE',
                success: function () {
                    // удалить строку без перезагрузки
                    $(`tr[data-id="${uid}"]`).remove();
                },
                error: function (xhr) {
                    alert(xhr.responseText || 'Ошибка удаления');
                }
            });
        });
    });
});
