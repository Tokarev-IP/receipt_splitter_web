export interface ReceiptData {
  receiptName: string;
  translatedReceiptName?: string;
  date: string;
  total: number;
  tax?: number;
  discount?: number;
  tip?: number;
}

export interface OrderData {
  name: string;
  translatedName?: string;
  quantity: number;
  price: number;
}

export interface ReceiptWithOrdersData {
  receipt: ReceiptData;
  orders: OrderData[];
}

export interface OrderDataSplitForAll {
  name: string;
  translatedName?: string;
  price: number;
  consumerNamesList: string[];
}

export interface OrderDataSplitForOne {
  name: string;
  translatedName?: string;
  price: number;
  quantity: number;
  selectedQuantity: number,
}