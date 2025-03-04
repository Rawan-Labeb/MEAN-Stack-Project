export interface Product {
    _id: string;
    name: string;
    images: string[];
}

export interface Seller {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
}


export interface ProdReq {
    _id: string;
    product: Product;
    seller: Seller;
    superAdmin: string;
    requestedQuantity: number;
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    createdAt: string;
    updatedAt: string;
}
