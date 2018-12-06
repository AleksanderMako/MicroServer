export default interface Irepository {
    create(data: any): any;
    readAll(): any;
    //  readOne(data: any): any;
    update(data: any): any;
    // delete(): any;
    findCustomersInFlight(data: any): any;
    removeReservationBYCustomer(data: any): any;
    findUserReservations(data: any): any;
}