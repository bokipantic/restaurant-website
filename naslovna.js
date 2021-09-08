$(document).ready(function () {
    $.get("https://www.themealdb.com/api/json/v1/1/categories.php", function (data) {
        $.each(data.categories, function (key, value) {
                $("#jelo").append('<div class="col-lg-3 col-md-6 col-xs-12"><div class="thumbnail"><img src="'+value.strCategoryThumb+'" alt="jelo" width="100%"><h4><b>'+value.strCategory+'</b></h4><br><p>'+value.strCategoryDescription+'</p></div></div>');
        });
    });
});