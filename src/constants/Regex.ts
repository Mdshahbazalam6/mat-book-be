export const REGEX = {
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
    objectId: /^[0-9a-fA-F]{24}$/,
    name: /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/,
    firstName: /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/,
    lastName: /^[a-zA-Z]+(([' -][a-zA-Z ])?[a-zA-Z]*)*$/,
    mobile_dial_code: /\+\d{1,4}/,
    mobile: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/,
    city: /^[a-zA-Z -]+([a-zA-Z. ]+)?$/,
    state: /^[a-zA-Z]+([a-zA-Z ]+)?$/,
    zipcode: /(^\d{5}$)|(^\d{9}$)/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
}