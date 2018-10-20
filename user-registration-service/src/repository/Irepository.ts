export default interface Irepository {
    create(data: any): any;
    readAll(): any;
    readOne(id: any): any;
    update(data: any): any;
    delete(id: any): any;
}