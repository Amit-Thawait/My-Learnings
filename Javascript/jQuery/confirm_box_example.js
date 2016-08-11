var ready = function() {
    var lastChecked = null;
    var chkboxes = $('input.chkbox');

    // Binding click function to provide capability to user to select multiple items using shift key.
    chkboxes.click(function(event) {
        enableActions();
        if(!lastChecked) {
            lastChecked = this;
            return;
        }

        if(event.shiftKey) {
            var start = chkboxes.index(this);
            var end = chkboxes.index(lastChecked);
            chkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).attr('checked', lastChecked.checked);
        }

        lastChecked = this;
    });

    jQuery('table#users .select_all').click(function() {
        var b_check = this.checked;
        jQuery("table#users input[type='checkbox']").each(function(){
            this.checked = b_check;
        });
        enableActions();
    });

    jQuery("a#hard_delete").click(function(e) {
        e.preventDefault();
        var data = {id: $(this).attr('user_id')};
        var deleteUrl = $(this).attr('href');
        confirmDeletion(data, deleteUrl, hardDeleteUser);
    });

    jQuery('a#hard_delete_users').click(function(e) {
        e.preventDefault();
        var selected_rows = $('table#users input.chkbox:checked');
        var user_ids = [];
        $.each(selected_rows, function(){
            user_ids.push($(this).val());
        });

        var data = {id: user_ids};
        var deleteUrl = $(this).attr('href');

        confirmDeletion(data, deleteUrl, hardDeleteUser);
    });

    function enableActions() {
        var checkboxes = $('table#users input.chkbox:checked');
        if (checkboxes.size() > 0) {
            $('a#hard_delete_users, a#activate_users').attr('disabled', false);
        } else {
            $('a#hard_delete_users, a#activate_users').attr('disabled', true);
        }
    }

    function confirmDeletion(data, deleteUrl, confirmFunction) {
        $.confirm({
            title: 'Confirm!',
            content: "Are you sure you want to delete this user and all its associated data permanently.\nThis action can't be undone.",
            confirmButtonClass: 'btn-info',
            confirmButton: 'Yes',
            cancelButton: 'No',
            confirm: function(){
                confirmFunction(data, deleteUrl);
            },
            cancel: function(){
                false;
            }
        });
    }

    function hardDeleteUser(data, deleteUrl) {
        $.ajax({
            url: deleteUrl,
            data: data,
            dataType: "json",
            method: 'DELETE',
            success: function(result) {
                var user_rows_selector = [];
                $.each(result['user_ids'], function() {
                    user_row = "table#users tr#" + this;
                    user_rows_selector.push(user_row);
                });
                user_rows_selector = user_rows_selector.join(', ');
                deleted_users = $(user_rows_selector);
                deleted_users.remove();

                $('div.messages').removeClass('hide');
                $('div.messages').addClass('alert alert-info').html(result['message']);
                $('div.messages span').click(function() {
                    $(this).parent().toggleClass('hide');
                });
            },
            error: function(error) {
                $('div.messages').addClass('alert alert-danger').html('Sorry something went wrong');
            },
            complete: function() {
                $('table#users input.chkbox:checked').attr('checked', false);
                $('a#hard_delete_users').attr('disabled', true);
            }
        });
    }

};

$(document).ready(ready);
$(document).on('page:load', ready);
