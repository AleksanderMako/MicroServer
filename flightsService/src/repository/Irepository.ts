export default interface Irepository {
    create(data: any): any;
    readAll(): any;
    readOne(id: any): any;
    update(data: any): any;
    delete(data: any): any;
    seedSeats(): any;
}