let tajmer;

function izaberiJelo() {
    tajmer = setInterval(() => {
        $.get("https://www.themealdb.com/api/json/v1/1/random.php", function (data) {
            $("#izabranoJelo tbody").html("<tr><td>" + data.meals[0].idMeal + "</td><td>" + data.meals[0].strMeal + "</td><td>" + data.meals[0].strCategory + "</td><td>" + data.meals[0].strArea + "</td><td><img width='80px' src='" + data.meals[0].strMealThumb + "'</td><td><button class='btn btn-primary' onclick='vratiJelo(" + data.meals[0].idMeal + ")'>Detalji</button></td></tr>");
        });
    }, 3000);
}

$(".jos").hide();

$(".stop").click(() => {
    clearInterval(tajmer);
    swal("Da li ste se odlucili?", {
        buttons: {
            cancel: "Ne, greska!",
            catch: {
                text: "Da!",
                value: "jesam",
            },
        },
    })
        .then((value) => {
            switch (value) {
                case "jesam":
                    let jelo = document.getElementById("izabranoJelo").rows[1].cells[1].innerHTML;
                    swal("Narucili ste: " + jelo, "Prijatno!", "success");
                    toastr.success('Jelo ce biti gotovo vrlo brzo', 'Hvala Vam na poverenju!');
                    $(".jos").show();
                    $(".stop").hide();
                    break;
                default:
                    swal("Pogledajte jos malo!");
                    izaberiJelo();
            }
        });
});

$(".jos").click(() => {
    izaberiJelo();
    $(".jos").fadeOut(2000);
    $(".stop").show();
});

function vratiJelo(id) {
    $.get("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id, function (data) {
        $("#naziv").html(data.meals[0].strMeal);
        $("#vrsta").html(data.meals[0].strCategory);
        $("#oblast").html(data.meals[0].strArea);
        $("#karakteristike").html(data.meals[0].strTags);
        $("#youtube").html(data.meals[0].strYoutube);
        $("#modalDetalji a").attr("href", data.meals[0].strYoutube);
        $("#slika").html("<img src=" + data.meals[0].strMealThumb + " class='img-responsive'>");
        $("#recept").html(data.meals[0].strInstructions);
        for (const key in data.meals[0]) {
            $("#sastojci").empty();
            for (let i = 1; i < 6; i++) {
                $("#sastojci").append("<li>" + data.meals[0]["strIngredient" + i] + "</li>");
            }
        }
        $("#modalDetalji").modal("show");
        clearInterval(tajmer);
        $(".jos").show();
    });
}

$("#unosJela").keyup((event) => {
    let unos = $("#unosJela").val();
    if (event.keyCode == 13) {
        if (unos.length == 0) {
            swal("Upozorenje!", "Unesite nesto!", "warning");
        } else {
            $('#nemaRezultata').hide();
            $('#kategorija').val("");
            $('#podrucje').val("");
            $('#sastojak').val("");
            $.get("https://www.themealdb.com/api/json/v1/1/search.php?s=" + unos, function (data) {
                let dt = [];
                $.each(data.meals, function (key, value) {
                    const jedan = [value.idMeal, "<a onclick='sacuvaj(this.innerHTML);' data-toggle='tooltip' title='Sacuvajte omiljeno jelo'>" + value.strMeal + "</a>", value.strCategory, value.strArea, "<img width='50px' src='" + value.strMealThumb + "'>", "<button class='btn btn-primary btn-sm' onclick='vratiJelo(" + value.idMeal + ")'>Detalji</button>"];
                    dt.push(jedan);
                });
                $('#tabelaPretraga').DataTable().destroy();
                $('#tabelaPretraga').DataTable({
                    data: dt,
                    "order": [[1, "asc"]],
                    responsive: true
                });
            });
            toastr.info('Sve sto Vas zanima mozete nas pitati', 'Pogledajte sva jela sa "' + unos + '" u nazivu');
        }
    }
});

function sacuvaj(jelo) {
    const omiljenaJela = localStorage.getItem('omiljena_jela');
    let omiljenaJelaNiz = [];
    if (omiljenaJela == null) {
        omiljenaJelaNiz.push(jelo);
    } else {
        omiljenaJelaNiz = JSON.parse(omiljenaJela);
        for (let i = 0; i < omiljenaJelaNiz.length; i++) {
            if (omiljenaJelaNiz[i] == jelo) {
                swal("Greska", "Vec ste sacuvali ovo jelo!", "error");
                return;
            }
        }
        omiljenaJelaNiz.push(jelo);
    }
    localStorage.setItem("omiljena_jela", JSON.stringify(omiljenaJelaNiz));
    $('.list-group').empty();
    $.each(omiljenaJelaNiz, function (key, value) {
        $('.list-group').append('<li class="list-group-item">' + value + '<a onclick="ukloni(' + key + ');" href="#"><span class="glyphicon glyphicon-remove obrisi" aria-hidden="true"></span></a></li>');
    });
    toastr.success('Uspesno ste dodali jelo u listu omiljenih jela!');
}

$(document).ready(function () {
    const omiljenaJela = localStorage.getItem('omiljena_jela');
    let omiljenaJelaNiz = JSON.parse(omiljenaJela);
    if (omiljenaJelaNiz == null) {
        $('.list-group').html('<li class="list-group-item">Nemate sacuvanih jela</li>');
    } else {
        $('.list-group').empty();
        $.each(omiljenaJelaNiz, function (key, value) {
            $('.list-group').append('<li class="list-group-item">' + value + '<a onclick="ukloni(' + key + ');" href="#"><span class="glyphicon glyphicon-remove obrisi" aria-hidden="true"></span></a></li>');
        });
    }
});

function ukloni(index) {
    const omiljenaJela = localStorage.getItem('omiljena_jela');
    let omiljenaJelaNiz = JSON.parse(omiljenaJela);
    omiljenaJelaNiz.splice(index, 1);
    toastr.warning('Izbrisali ste jelo iz liste omiljenih jela!');
    localStorage.setItem("omiljena_jela", JSON.stringify(omiljenaJelaNiz));
    if (omiljenaJelaNiz.length == 0) {
        $('.list-group').html('<li class="list-group-item">Nemate sacuvanih jela</li>');
    } else {
        $('.list-group').empty();
        $.each(omiljenaJelaNiz, function (key, value) {
            $('.list-group').append('<li class="list-group-item">' + value + '<a onclick="ukloni(' + key + ');" href="#"><span class="glyphicon glyphicon-remove obrisi" aria-hidden="true"></span></a></li>');
        });
    }
}

$(document).ready(function () {
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?c=list", function (data) {
        $.each(data.meals, function (key, value) {
            $("#kategorije").append('<li>' + value.strCategory + '</li>');
            $("#kategorija").append('<option value="' + value.strCategory + '">' + value.strCategory + '</option>');
        });
    });
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list", function (data) {
        $.each(data.meals, function (key, value) {
            $("#oblasti").append('<li>' + value.strArea + '</li>');
            $("#podrucje").append('<option value="' + value.strArea + '">' + value.strArea + '</option>');
        });
    });
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?i=list", function (data) {
        $.each(data.meals, function (key, value) {
            $("#sviSastojci").append('<li>' + value.strIngredient + '</li>');
            $("#sastojak").append('<option value="' + value.strIngredient + '">' + value.strIngredient + '</option>');
        });
    });
});

const slova = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
$(document).ready(function () {
    for (let i = 1; i < slova.length; i++) {
        $('.dropdown-menu').append('<li role="separator" class="divider"></li><li><a onclick="prvoSlovo(this.innerHTML);" href="#">' + slova.charAt(i) + '</a></li>');
    }
});

function prvoSlovo(slovo) {
    $('#nemaRezultata').hide();
    $('#unosJela').val("");
    $('#kategorija').val("");
    $('#podrucje').val("");
    $('#sastojak').val("");
    $.get("https://www.themealdb.com/api/json/v1/1/search.php?f=" + slovo, function (data) {
        let dt = [];
        $.each(data.meals, function (key, value) {
            const jedan = [value.idMeal, "<a onclick='sacuvaj(this.innerHTML);' data-toggle='tooltip' title='Sacuvajte omiljeno jelo'>" + value.strMeal + "</a>", value.strCategory, value.strArea, "<img width='50px' src='" + value.strMealThumb + "'>", "<button class='btn btn-primary btn-sm' onclick='vratiJelo(" + value.idMeal + ")'>Detalji</button>"];
            dt.push(jedan);
        });
        $('#tabelaPretraga').DataTable().destroy();
        $('#tabelaPretraga').DataTable({
            data: dt,
            "order": [[1, "asc"]],
            responsive: true
        });
    });
    toastr.info('Sve sto Vas zanima mozete nas pitati', 'Pogledajte sva jela sa prvim slovom ' + slovo);
}

function birajKategoriju(kategorija) {
    $('#nemaRezultata').hide();
    $('#unosJela').val("");
    $('#podrucje').val("");
    $('#sastojak').val("");
    $.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + kategorija, function (data) {
        let dt = [];
        $.each(data.meals, function (key, value) {
            const jedan = [value.idMeal, "<a onclick='sacuvaj(this.innerHTML);' data-toggle='tooltip' title='Sacuvajte omiljeno jelo'>" + value.strMeal + "</a>", "/", "/", "<img width='50px' src='" + value.strMealThumb + "'>", "<button class='btn btn-primary btn-sm' onclick='vratiJelo(" + value.idMeal + ")'>Detalji</button>"];
            dt.push(jedan);
        });
        $('#tabelaPretraga').DataTable().destroy();
        $('#tabelaPretraga').DataTable({
            data: dt,
            "order": [[1, "asc"]],
            responsive: true
        });
    });
    toastr.info('Sve sto Vas zanima mozete nas pitati', 'Pogledajte sva jela iz kategorije ' + kategorija);
}

function birajPodrucje(podrucje) {
    $('#nemaRezultata').hide();
    $('#unosJela').val("");
    $('#kategorija').val("");
    $('#sastojak').val("");
    $.get("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + podrucje, function (data) {
        let dt = [];
        $.each(data.meals, function (key, value) {
            const jedan = [value.idMeal, "<a onclick='sacuvaj(this.innerHTML);' data-toggle='tooltip' title='Sacuvajte omiljeno jelo'>" + value.strMeal + "</a>", "/", "/", "<img width='50px' src='" + value.strMealThumb + "'>", "<button class='btn btn-primary btn-sm' onclick='vratiJelo(" + value.idMeal + ")'>Detalji</button>"];
            dt.push(jedan);
        });
        $('#tabelaPretraga').DataTable().destroy();
        $('#tabelaPretraga').DataTable({
            data: dt,
            "order": [[1, "asc"]],
            responsive: true
        });
    });
    toastr.info('Sve sto Vas zanima mozete nas pitati', 'Pogledajte sva jela sa podrucja ' + podrucje);
}

function birajSastojak(sastojak) {
    $('#nemaRezultata').hide();
    $('#unosJela').val("");
    $('#kategorija').val("");
    $('#podrucje').val("");
    $.get("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + sastojak, function (data) {
        let dt = [];
        $.each(data.meals, function (key, value) {
            const jedan = [value.idMeal, "<a onclick='sacuvaj(this.innerHTML);' data-toggle='tooltip' title='Sacuvajte omiljeno jelo'>" + value.strMeal + "</a>", "/", "/", "<img width='50px' src='" + value.strMealThumb + "'>", "<button class='btn btn-primary btn-sm' onclick='vratiJelo(" + value.idMeal + ")'>Detalji</button>"];
            dt.push(jedan);
        });
        $('#tabelaPretraga').DataTable().destroy();
        $('#tabelaPretraga').DataTable({
            data: dt,
            "order": [[1, "asc"]],
            responsive: true
        });
    });
    toastr.info('Sve sto Vas zanima mozete nas pitati', 'Pogledajte sva jela sa sastojkom ' + sastojak);
}

function kategorijeGrafikon() {
    var podaci_grafikon = [["Kategorija", "Broj jela"]];
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?c=list", function (json) {
        $.each(json.meals, function (key, value) {
            $.get("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + value.strCategory, function (data) {
                var jedna = [value.strCategory, data.meals.length];
                podaci_grafikon.push(jedna);
            });
        });
        setTimeout( () => {
            nacrtaj_grafikon(podaci_grafikon);
        }, 2000);
    });
}

google.charts.load('current', { 'packages': ['corechart'] });
// google.charts.setOnLoadCallback(nacrtaj_grafikon);

function nacrtaj_grafikon(podaci_grafikon) {
    var data = google.visualization.arrayToDataTable(podaci_grafikon);
    var options = {
        title: 'Broj jela po kategoriji jela',
        titleTextStyle: {
            fontSize: 18
        },
        pieSliceTextStyle: {
            fontSize: 14
        },
        legendTextStyle: {
            fontSize: 15
        },
        height: 400,
        width: 570,
        is3D: true
    };
    var grafikon = new google.visualization.PieChart(document.getElementById('grafikon_1'));
    grafikon.draw(data, options);

    google.visualization.events.addListener(grafikon, 'select', function () {
        var selectedItem = grafikon.getSelection()[0];
        console.log(selectedItem);
        if (selectedItem) {
            $('#nemaRezultata').hide();
            var kategorija = data.getValue(selectedItem.row, 0);
            birajKategoriju(kategorija);
            $('#kategorija').val(kategorija);
        }
    });
}

function podrucjaGrafikon() {
    var podaci_grafikon = [["Podrucje", "Broj jela"]];
    $.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list", function (json) {
        $.each(json.meals, function (key, value) {
            $.get("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + value.strArea, function (data) {
                var jedna = [value.strArea, data.meals.length];
                podaci_grafikon.push(jedna);
            });
        });
        setTimeout( () => {
            nacrtaj_grafikon2(podaci_grafikon);
        }, 2000);
    });
}

google.charts.load('current', { 'packages': ['corechart'] });
// google.charts.setOnLoadCallback(nacrtaj_grafikon);

function nacrtaj_grafikon2(podaci_grafikon) {
    var data = google.visualization.arrayToDataTable(podaci_grafikon);
    var options = {
        title: 'Broj jela po podrucju jela',
        titleTextStyle: {
            fontSize: 18
        },
        pieSliceTextStyle: {
            fontSize: 14
        },
        legendTextStyle: {
            fontSize: 15
        },
        height: 400,
        width: 570,
        is3D: true
    };
    var grafikon = new google.visualization.PieChart(document.getElementById('grafikon_2'));
    grafikon.draw(data, options);

    google.visualization.events.addListener(grafikon, 'select', function () {
        var selectedItem = grafikon.getSelection()[0];
        console.log(selectedItem);
        if (selectedItem) {
            $('#nemaRezultata').hide();
            var podrucje = data.getValue(selectedItem.row, 0);
            birajPodrucje(podrucje);
            $('#podrucje').val(podrucje);
        }
    });
}

function idiNaVrh() {
    $('html').animate({ scrollTop: 0 }, 1000);
}