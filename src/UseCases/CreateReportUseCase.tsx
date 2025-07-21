import { ReceiptData, OrderDataSplitForAll } from "../Receipt/ReceiptData";

// Constants for report formatting
const SHORT_DIVIDER_STRING = "----";
const START_STRING = "·";
const EQUAL_STRING = "=";
const LONG_DIVIDER_STRING = "------------";
const EMPTY_STRING = "";

// Helper functions
function extractConsumerNames(orderDataSplitList: OrderDataSplitForAll[]): string[] {
    const consumerNames = new Set<string>();
    orderDataSplitList.forEach(order => {
        order.consumerNamesList.forEach(name => consumerNames.add(name));
    });
    return Array.from(consumerNames);
}

function roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
}

function isMoreThanOne(value: number): boolean {
    return value > 1;
}

function isNotZero(value: number): boolean {
    return value !== 0;
}

function isPositive(value: number): boolean {
    return value > 0;
}

export function buildOrderReportForAll(
    receiptData: ReceiptData,
    orderDataSplitList: OrderDataSplitForAll[],
): string | null {
    try {
        const consumerNameList = extractConsumerNames(orderDataSplitList);
        if (consumerNameList.length === 0) {
            return null;
        }

        const orderReport: string[] = [];

        if (receiptData.receiptName) {
            orderReport.push(receiptData.receiptName);
        }
        if (receiptData.date) {
            orderReport.push(receiptData.date);
        }

        if (consumerNameList.length > 0) {
            orderReport.push(SHORT_DIVIDER_STRING);
        }

        for (const consumerName of consumerNameList) {
            let index = 1;
            let consumerFinalPrice = 0;
            const newOrderDataSplitList = orderDataSplitList.filter(
                order => order.consumerNamesList.includes(consumerName)
            );

            orderReport.push(`${START_STRING} ${consumerName}`);

            for (const orderDataSplit of newOrderDataSplitList) {
                if (isMoreThanOne(orderDataSplit.consumerNamesList.length)) {
                    const newPrice = roundToTwoDecimalPlaces(
                        orderDataSplit.price / orderDataSplit.consumerNamesList.length
                    );
                    orderReport.push(
                        `  ${index}. ${orderDataSplit.name} ${orderDataSplit.translatedName || EMPTY_STRING} ${EQUAL_STRING} 1/${orderDataSplit.consumerNamesList.length} x ${roundToTwoDecimalPlaces(orderDataSplit.price)} ${EQUAL_STRING} ${roundToTwoDecimalPlaces(newPrice)}`
                    );
                    consumerFinalPrice += newPrice;
                } else {
                    orderReport.push(
                        `  ${index}. ${orderDataSplit.name} ${orderDataSplit.translatedName || EMPTY_STRING} ${EQUAL_STRING} ${roundToTwoDecimalPlaces(orderDataSplit.price)}`
                    );
                    consumerFinalPrice += roundToTwoDecimalPlaces(orderDataSplit.price);
                }
                index++;
            }

            if ((isNotZero(receiptData.discount || 0) || isNotZero(receiptData.tip || 0) || isNotZero(receiptData.tax || 0)) && isNotZero(consumerFinalPrice)) {
                orderReport.push(`  ${EQUAL_STRING} ${roundToTwoDecimalPlaces(consumerFinalPrice)}`);

                if (isNotZero(receiptData.discount || 0)) {
                    consumerFinalPrice -= (consumerFinalPrice * (receiptData.discount || 0)) / 100;
                    orderReport.push(` - ${roundToTwoDecimalPlaces(receiptData.discount || 0)} %`);
                }
                if (isNotZero(receiptData.tip || 0)) {
                    consumerFinalPrice += (consumerFinalPrice * (receiptData.tip || 0)) / 100;
                    orderReport.push(` + ${roundToTwoDecimalPlaces(receiptData.tip || 0)} %`);
                }
                if (isNotZero(receiptData.tax || 0)) {
                    consumerFinalPrice += (consumerFinalPrice * (receiptData.tax || 0)) / 100;
                    orderReport.push(` + ${roundToTwoDecimalPlaces(receiptData.tax || 0)} %`);
                }
                orderReport.push(` ${EQUAL_STRING} ${roundToTwoDecimalPlaces(consumerFinalPrice)}`);
            }
            orderReport.push(`${EQUAL_STRING} ${roundToTwoDecimalPlaces(consumerFinalPrice)}`);
            orderReport.push(LONG_DIVIDER_STRING);
        }

        return orderReport.join('\n').trim();
    } catch (error) {
        return null;
    }
}

export function buildOrderReportForOne(
    receiptData: ReceiptData,
    orderDataList: import("../Receipt/ReceiptData").OrderDataSplitForOne[],
): string | null {
    try {
        let orderReport: string[] = [];
        let finalPrice = 0;
        let index = 1;

        if (receiptData.receiptName) {
            orderReport.push(receiptData.receiptName);
        }
        if (receiptData.date) {
            orderReport.push(receiptData.date);
        }

        if (orderDataList.length > 0) {
            orderReport.push(SHORT_DIVIDER_STRING);
        }

        for (const orderData of orderDataList) {
            if (isPositive(orderData.selectedQuantity)) {
                const sumPrice = orderData.selectedQuantity * orderData.price;
                finalPrice += sumPrice;
                if (isMoreThanOne(orderData.selectedQuantity)) {
                    orderReport.push(
                        `  ${index}. ${orderData.name} ${orderData.translatedName || EMPTY_STRING} ${EQUAL_STRING} ${orderData.selectedQuantity} x ${roundToTwoDecimalPlaces(orderData.price)} ${EQUAL_STRING} ${roundToTwoDecimalPlaces(sumPrice)}`
                    );
                } else {
                    orderReport.push(
                        `  ${index}. ${orderData.name} ${orderData.translatedName || EMPTY_STRING} ${EQUAL_STRING} ${roundToTwoDecimalPlaces(sumPrice)}`
                    );
                }
                index++;
            }
        }

        if ((isNotZero(receiptData.discount || 0) || isNotZero(receiptData.tip || 0) || isNotZero(receiptData.tax || 0)) && isNotZero(finalPrice)) {
            orderReport.push(` ${EQUAL_STRING} ${roundToTwoDecimalPlaces(finalPrice)}`);

            if (isNotZero(receiptData.discount || 0)) {
                finalPrice -= (finalPrice * (receiptData.discount || 0)) / 100;
                orderReport.push(` - ${roundToTwoDecimalPlaces(receiptData.discount || 0)} %`);
            }
            if (isNotZero(receiptData.tip || 0)) {
                finalPrice += (finalPrice * (receiptData.tip || 0)) / 100;
                orderReport.push(` + ${roundToTwoDecimalPlaces(receiptData.tip || 0)} %`);
            }
            if (isNotZero(receiptData.tax || 0)) {
                finalPrice += (finalPrice * (receiptData.tax || 0)) / 100;
                orderReport.push(` + ${roundToTwoDecimalPlaces(receiptData.tax || 0)} %`);
            }
            orderReport.push(` ${EQUAL_STRING} ${roundToTwoDecimalPlaces(finalPrice)}`);
        }

        orderReport.push(`${EQUAL_STRING} ${roundToTwoDecimalPlaces(finalPrice)}`);

        return orderReport.join('\n').trim();
    } catch (error) {
        return null;
    }
}
