$(function() {
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var searched_term = extractLast(this.term);
        label = item.name.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" +
                                    $.ui.autocomplete.escapeRegex(searched_term) +
                                    ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        return $("<li></li>")
                .append(label)
                .appendTo(ul);
    };

    function split(val) {
        return val.split(/,\s*/);
    }

    function extractLast(term) {
        return split(term).pop();
    }

    $("input#tags_autocomplete")
    // don't navigate away from the field on tab when selecting an item
    .bind("keydown", function(event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
            event.preventDefault();
        }
    })
    .autocomplete({
        minLength: 0,
        source: function(request, response) {
            $.getJSON("/tags_autocomplete", { q: extractLast(request.term) }, response);
        },
        focus: function() {
            // prevent value inserted on focus
            return false;
        },
        select: function(event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.name);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            $(this).val(terms.join(", "));
            return false;
        }
    });
});

/*
class AutoCompleter
  def initialize(app)
    @app = app
  end

  def call(env)
    @request = Rack::Request.new(env)
    if env["PATH_INFO"] == "/tags_autocomplete"
      session = @request.env['rack.session']
      params = @request.params
      if true # TODO: session && session["user_id"].present?
        tags = Tag.select("id, name").where("name like ?", "#{params['q']}%")
        [200, {"Content-Type" => "application/json"}, [tags.to_json]]
      else
       [404, {"Content-Type" => "text/html"}, ["Not Found"]]
      end
    else
      @app.call(env)
    end
  end
end
*/
