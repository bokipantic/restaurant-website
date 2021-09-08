var polja = $("input");

function registracija() {
    var greska = 0;
    for (i = 0; i < polja.length; i++) {
        var roditelj = polja[i].parentElement;
        if (polja[i].value.length == 0) {
            greska++;
            roditelj.classList.add("has-error");
        } else {
            roditelj.classList.remove("has-error");
        }
    }
    if (greska > 0) {
        swal('Upozorenje', 'Popunite sva polja', 'warning');
        return;
    }
    var password = $("#password").val();
    var rpt_password = $("#rpt_password").val();
    if (password != rpt_password) {
        swal('Greska', 'Lozinke se ne poklapaju', 'error');
        return;
    }
    var email = $("#email").val();
    if (email.includes("@") == false || email.indexOf('@') == 0 || email.indexOf('@') == email.length-1) {
        swal('Upozorenje', 'Unesite ispravan e-mail', 'error');
        return;
    }
    var username = $("#username").val();
    var korisnik = new Korisnik(username, email, password);
    var json_korisnik = JSON.stringify(korisnik);
    $.post("https://obrada.in.rs/api/registracija", json_korisnik, function (data) {
        if (data.sifra == 0) {
            swal('Upozorenje', data.poruka, 'warning');
        } else {
            swal(data.poruka, "Dobrodosli!", "success");
            ocisti();
            setTimeout(function() {
                location.href = "login.html";
            }, 2000);
        }
    });
}

function Korisnik(username, email, password) {
    this.username = username;
    this.password = password;
    this.email = email;
}

function ocisti() {
    for (i = 0; i < polja.length; i++) {
        polja[i].value = "";
    }
}