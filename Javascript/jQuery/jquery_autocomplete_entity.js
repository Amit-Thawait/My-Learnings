entity = {

    clear_fields : function() {
        $("input#feild_1").toggleClass('grey-bg', false).attr("readonly", false).val('');
        $("input#feild_2").toggleClass('grey-bg', false).attr("readonly", false).val('');
        $("div#error_msg, div#error_msg_2").html("");
    },

    fetch_item1 : function(url, term, item1_cache, response) {
        $.ajax({
            url: url,
            dataType: "json",
            data: {
                email_id: $("input#entity_email").val().trim(),
                entity_name: $("input#entity_name").val()
            },
            success: function(data) {
                $("input#entity_name").removeClass("ui-autocomplete-loading");

                var entities = data.entities;
                var error = data.error;
                if (error) $("div#error_msg").html("There is no entity found with this name. Please enter the name manually.");

                if (data.more_records) {
                    entities.push({
                        attr1: "",
                        attr_name: "........ More ........"
                    });
                }
                item1_cache[term] = entities;
                response(entities);
            },
            failure: function(msg) {
                $("input#entity_name").removeClass("ui-autocomplete-loading");
                $("div#error_msg").html("The entity names could not be fetched due to some error. Please try again later.");
            },
            error: function(XMLHttpRequest) {
                if (XMLHttpRequest.status == 401) {
                    window.open(XMLHttpRequest.responseText, '_self');
                    return false;
                }
            }
        });
    },

    fetch_item2 : function(url, ui, item2_cache) {
        $.ajax({
            url: url + ui.item.attr1 + '/',
            dataType: "json",
            data: {},
            success: function(data) {
                item2_cache[ui.item.attr1] = data.some_other_field;
                $("input#feild_2").removeClass("ui-autocomplete-loading");
                $("input#feild_2").toggleClass('grey-bg', true).attr("readonly", true).val(data.some_other_field);
            },
            failure: function(msg) {
                $("input#feild_2").removeClass("ui-autocomplete-loading");
                $("div#error_msg_guid").html("The entity guid cannot be fetched. Please try again by selecting the entity.");
            }
        });
    },

    append_li_element : function(ul, item) {
        return $("<li>")
                .attr("data-value", item.attr1)
                .append(item.attr_name)
                .appendTo(ul);
    }

};

(function (){

    $("input#entity_name").off("keypress").on("keypress", function() {
        var entity_name = $(this).val();
        if (entity_name.length < 3) {
            entity.clear_fields();
        }
    });

    var root_url = document.getElementById("root_url").value;
    var url = root_url + '/entities/';

    var xhr;
    var item1_cache = {};
    var item2_cache = {};

    $("#entity_name").autocomplete({
        source: function(request, response) {
            entity.clear_fields();

            var term = request.term;
            if (term in item1_cache) {
                $("input#entity_name").removeClass("ui-autocomplete-loading");
                if (item1_cache[term].length == 0) $("div#error_msg").html("No result found.");
                response(item1_cache[term]);
                return false;
            }

            // Abort previous ajax call
            if(xhr && xhr.readyState != 4) {
                xhr.abort();
            }

            xhr = entity.fetch_item1(url, term, item1_cache, response);
        },
        minLength: 3,
        autoFocus: true,
        select: function(event, ui) {
            if ( ui.item.attr_name == "........ More ........") {
                return false;
            }

            $("input#entity_name").val(ui.item.attr_name);
            $("input#feild_1").toggleClass('grey-bg', true).attr("readonly", true).val(ui.item.attr1);
            $("input#feild_2").addClass("ui-autocomplete-loading");

            var guid = ui.item.attr1;
            if (guid in item2_cache) {
                if (item2_cache[guid].length == 0) $("div#error_msg_guid").html("The entity guid cannot be fetched. Please try again by selecting the entity.");
                $("input#feild_2").removeClass("ui-autocomplete-loading");
                $("input#feild_2").toggleClass('grey-bg', true).attr("readonly", true).val(item2_cache[guid]);
                return false;
            }

            var url = root_url + '/get_entities/';
            entity.fetch_item2(url, ui, item2_cache);
            return false;
        }
    }).autocomplete("instance")._renderItem = function(ul, item) {
        return entity.append_li_element(ul, item);
      };

})();

