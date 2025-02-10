export interface Contact {
    id:string;
    fName: string;
    lName: string;
    email: string;
    message: string;
    status: 'Pending'|'Replied'  ;
}
