export class Product {
    _id!: string;
    name: string;
    description: string;
    price: number;
    prevPrice?: number;
    noOfSale: number;
    images: string[];
    isActive: boolean;
    quantity: number;
    sellerId: string;
    supplierId?: string;
    categoryId: string;
  
    constructor(
      name: string,
      price: number,
      sellerId: string,
      categoryId: string,
      description: string,
      prevPrice?: number,
      noOfSale: number = 0,
      images: string[] = [],
      isActive: boolean = true,
      quantity: number = 0,
      supplierId?: string
    ) {
      this.name = name;
      this.price = price;
      this.sellerId = sellerId;
      this.categoryId = categoryId;
      this.description = description;
      this.prevPrice = prevPrice;
      this.noOfSale = noOfSale;
      this.images = images;
      this.isActive = isActive;
      this.quantity = quantity;
      this.supplierId = supplierId;
    }
  }
  