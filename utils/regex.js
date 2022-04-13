module.exports = pattern = {

    strPattern: /^[A-Z]+[a-zA-Z ]*([A-Z]*[a-z]+[ ])*[ ]*[0-9]*$/,
    conturyCodePatter: /^(\+){1}[0-9]+$/,
    mobileNoPattern: /^[6-9][0-9]+$/,
    passwordPattern: /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/,
    num: /^[0-9]+$/,
    cvvPattern: /^[0-9]{3}$/,
    productPattern: /^[A-Z]+([a-z ]+)?([0-9]+)? ?$/,
    size: /^[SMLX]{1}|{XL}|{XXL}$/,
    state: /^[A-Z]+[A-Za-z ]*[0-9]*$/,
    gender: /^(m|M|male|Male|f|F|female|Female)?$/,
    name: /^[A-Z]+[a-z]{2,30}$/,
    houseNo: /^[A-Za-z0-9 ]*[/]?[A-Za-z0-9 ]*$/
}