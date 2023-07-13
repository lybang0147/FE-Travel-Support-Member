
interface Voucher {
    id: string;
    name: string;
    discount: number;
    createAt: Date;
    updateAt: Date;
    expirationDate: Date;
    quantity:number;
    remainingQuantity: number;
    hidden: boolean;
}

export default Voucher