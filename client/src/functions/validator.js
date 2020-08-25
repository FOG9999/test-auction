var validateEmail = (email) => {
    var regex = /\S{8,}@([a-z]{2,}.){1,}[a-z]{2,}/;
    return regex.test(email);
}

var validatePassword = (password) => {
    var regex1 = /^.*[A-Z](.*)$/g,
    regex2 = /^.*[!,@,#,$,%,^,*](.*)$/g,
    regex3 = /^.*\d(.*)$/g;
    return (regex3.test(password) && regex2.test(password) && regex1.test(password) && password.length >= 8)
}

var validatePhoneNum = (phoneNum) => {
    var regex = /^[01,02,03]\d{8,9}/g;
    return regex.test(phoneNum) && phoneNum.length >= 10 && phoneNum.length <= 11
}

console.log(validatePhoneNum('0156373843s'));