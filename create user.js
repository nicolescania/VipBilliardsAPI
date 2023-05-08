

function create(){

	//usuario no existe
	if (verify() == true) {
		return "El email ya existe";
	}else{
		//si existe
		save();
	}

	//usuario no existe
	if (!verify()) {
		save();
	}else{
		//si existe
		return "El email ya existe";
	}


}

function verify(){

	const verifyEmail = 'QUERY DB';

	if (verifyEmail != null) {
		return true;
	}else{
		return false;
	}


	if (verifyEmail == null){
		//no lo encontró
		return false;
	}else{
		return true;
	}

	return verifyEmail == null ? false : true;
}

function save(){
	//try and catch
}