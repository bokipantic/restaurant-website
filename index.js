$(document).ready( () => {
    $.get("https://www.themealdb.com/api/json/v1/1/categories.php", (data) => {
        $.each(data.categories, (key, value) => {
                $("#portfolio").append('<div class="col-lg-3 col-sm-6 col-md-4 col-xs-12"><div class="thumbnail"><img src="'+value.strCategoryThumb+'" alt="jelo" width="100%"><h4><b>'+value.strCategory+'</b></h4><br><p>'+value.strCategoryDescription+'</p></div></div>');
        });
    });
});

function idiNaVrh() {
    $('html').animate({scrollTop: 0}, 1000);
}