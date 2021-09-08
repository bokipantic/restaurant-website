var polja = $("input");

function login() {
	var greska = 0;
	for(i=0; i<polja.length; i++) {
		var roditelj = polja[i].parentElement;
		if(polja[i].value.length == 0){
			greska++;
			roditelj.classList.add("has-error");
		} else {
			roditelj.classList.remove("has-error");
		}
	}
	if(greska>0) {
		swal('Upozorenje', 'Popunite sva polja', 'warning');
		return;
	}
	var username = $("#username").val();
	var password = $("#password").val();
	var korisnik = new Korisnik(username, password);
	var json_korisnik = JSON.stringify(korisnik);
	$.post("https://obrada.in.rs/api/login", json_korisnik, function( data ) {
	  	if(data.sifra == 0) {
	  		swal(data.poruka, 'Pokusajte ponovo', 'error');
	  	} else {
	  		localStorage.setItem("token", data.token);
	  		localStorage.setItem("username", data.korisnik.username);
	  		ocisti();
	  		location.href = "index.html";
	  	}
	});
}

function Korisnik(username, password) {
	this.username = username;
	this.password = password;
}

function ocisti() {
	for(i=0; i<polja.length; i++) {
		polja[i].value = "";
	}
}

function vidiPassword() {
	$('#password').attr('type', 'text');
	$('.lozinka a').html('Hide password');
	$('.lozinka a').attr('onclick', 'sakrijPassword()');
}

function sakrijPassword() {
	$('#password').attr('type', 'password');
	$('.lozinka a').html('Show password');
	$('.lozinka a').attr('onclick', 'vidiPassword()');
}
