
export default class UpdateReservationPayload {

    public flightnumber: string;
    public username: string;
    constructor(flightNUmber: string, username: string) {

        this.flightnumber = flightNUmber;
        this.username = username;
    }

}