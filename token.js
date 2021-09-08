function proveriToken() {
	var token = localStorage.getItem("token");
	if (token == null) {
		logout();
	} else {
		$.get( "https://obrada.in.rs/api/proveriToken/"+ token, function(data) {
			if(data.sifra == 0) {
				logout();
			}
		});
	}
}

setInterval(() => {
	proveriToken();
}, 10000);

$(document).ready( () => {
	$("#username").html('Izlogujte se: ' + localStorage.getItem("username"));
});

function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("username");
	location.href = "login.html";
}
