export default class UpdatePayload {
    public username: String;
    public password: String;
    public firstname: String;
    public lastName: String;
    public age: Number;

    constructor(username: String, password: String, firstname: String, lastName: String, age: Number) {

        this.username = username;
        this.firstname = firstname;
        this.lastName = lastName;
        this.password = password;
        this.age = age;

    }


}