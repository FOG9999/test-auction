var validateEmail = (email) => {
    var regex = /\S{8,}@([a-z]{2,}.){1,}[a-z]{2,}/;
    return regex.test(email);
}

var validatePassword = (password) => {
    var regex1 = /[(a-z)|/d]{7,}/g,
    regex2 = /^.*[!,@,#,$,%,^,*](.*)$/g;
    return regex1.test(password)
}

console.log(validatePassword('fog12345'));