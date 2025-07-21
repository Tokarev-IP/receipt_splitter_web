import { ReceiptData, OrderData, ReceiptWithOrdersData } from "../Receipt/ReceiptData";
import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";
import {generateGeminiContent} from "../Firebase/GeminiAi"
import * as FirestoreUseCase from "../Firebase/FirestoreUseCase";
import { UserAttemptsData } from "../Receipt/FirestoreData";


const receiptJsonSchemaNotTranslated = Schema.object({
    properties: {
      receipt_name: Schema.string(),
      translated_receipt_name: Schema.string(),
      date: Schema.string(),
      total_sum: Schema.number(),
      tax_in_percent: Schema.number(),
      discount_in_percent: Schema.number(),
      tip_in_percent: Schema.number(),
      orders: Schema.array({
        items: Schema.object({
          properties: {
            name: Schema.string(),
            translated_name: Schema.string(),
            quantity: Schema.integer(),
            price: Schema.number(),
          },
          optionalProperties: ["translated_name"],
        }),
      }),
    },
    optionalProperties: [
      "translated_receipt_name",
      "tax_in_percent",
      "discount_in_percent",
      "tip_in_percent",
      "orders"
    ],
});
  
const receiptJsonSchemaTranslated = Schema.object({
    properties: {
        receipt_name: Schema.string(),
        translated_receipt_name: Schema.string(),
        date: Schema.string(),
        total_sum: Schema.number(),
        tax_in_percent: Schema.number(),
        discount_in_percent: Schema.number(),
        tip_in_percent: Schema.number(),
        orders: Schema.array({
          items: Schema.object({
            properties: {
              name: Schema.string(),
              translated_name: Schema.string(),
              quantity: Schema.integer(),
              price: Schema.number(),
            },
          }),
        }),
      },
      optionalProperties: [
          "translated_receipt_name",
          "tax_in_percent",
          "discount_in_percent",
          "tip_in_percent",
          "orders"
      ],
});

async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}

export async function generateReceipt(file: File, userId: string): Promise<ReceiptWithOrdersData & { attemptsLeft: number }> {
    // Get user attempts and constants
    const [userAttempts, constants] = await Promise.all([
        FirestoreUseCase.getUserAttempts(userId),
        FirestoreUseCase.getMainConstantsForReceipts()
    ]);

    if (!constants) {
        throw new Error("Failed to load receipt constants");
    }

    // Check if user can make another attempt
    const currentTime = Date.now();
    let newUserAttempts: UserAttemptsData;
    let attemptsLeft: number;

    if (!userAttempts) {
        // First time use
        newUserAttempts = {
            lastAttemptTime: currentTime,
            attempts: 1
        };
        attemptsLeft = constants.maximumAttemptsForUser - 1;
    } else {
        // Check if enough time has passed since last attempt
        const timeSinceLastAttempt = currentTime - userAttempts.lastAttemptTime;
        const hasEnoughTimePassed = timeSinceLastAttempt >= constants.deltaTimeBetweenAttempts;

        if (hasEnoughTimePassed) {
            // Enough time has passed - reset attempts to 1 and update lastAttemptTime
            newUserAttempts = {
                lastAttemptTime: currentTime,
                attempts: 1
            };
            attemptsLeft = constants.maximumAttemptsForUser - 1;
        } else {
            // Not enough time has passed - increment attempts
            const nextAttempts = userAttempts.attempts + 1;
            const hasExceededMaxAttempts = nextAttempts > constants.maximumAttemptsForUser;
            attemptsLeft = constants.maximumAttemptsForUser - nextAttempts;

            if (hasExceededMaxAttempts) {
                // User has exceeded maximum attempts
                const waitTimeMs = constants.deltaTimeBetweenAttempts - timeSinceLastAttempt;
                const error: any = new Error("You have exceeded the maximum number of attempts");
                error.attemptsLeft = 0;
                error.waitTimeMs = waitTimeMs;
                throw error;
            }

            newUserAttempts = {
                lastAttemptTime: userAttempts.lastAttemptTime, // Keep same time
                attempts: nextAttempts
            };
        }
    }

    // Generate receipt using AI
    const prompt = constants.requestText || "Read data from receipt image";
    const imagePart = await fileToGenerativePart(file);
    const generatedText = await generateGeminiContent(prompt, receiptJsonSchemaNotTranslated, imagePart, constants.aiModel);
    const generatedReceiptWithOrdersData = transformGeneratedTextToReceiptWithOrdersData(generatedText());

    // Update user attempts
    await FirestoreUseCase.updateUserAttempts(userId, newUserAttempts);

    return { ...generatedReceiptWithOrdersData, attemptsLeft };
}

export async function generateReceiptTranslated(file: File, translatedLanguage: string, userId: string): Promise<ReceiptWithOrdersData & { attemptsLeft: number }> {
    // Get user attempts and constants
    const [userAttempts, constants] = await Promise.all([
        FirestoreUseCase.getUserAttempts(userId),
        FirestoreUseCase.getMainConstantsForReceipts()
    ]);

    if (!constants) {
        throw new Error("Failed to load receipt constants");
    }

    // Check if user can make another attempt
    const currentTime = Date.now();
    let newUserAttempts: UserAttemptsData;
    let attemptsLeft: number;

    if (!userAttempts) {
        // First time use
        newUserAttempts = {
            lastAttemptTime: currentTime,
            attempts: 1
        };
        attemptsLeft = constants.maximumAttemptsForUser - 1;
    } else {
        // Check if enough time has passed since last attempt
        const timeSinceLastAttempt = currentTime - userAttempts.lastAttemptTime;
        const hasEnoughTimePassed = timeSinceLastAttempt >= constants.deltaTimeBetweenAttempts;

        if (hasEnoughTimePassed) {
            // Enough time has passed - reset attempts to 1 and update lastAttemptTime
            newUserAttempts = {
                lastAttemptTime: currentTime,
                attempts: 1
            };
            attemptsLeft = constants.maximumAttemptsForUser - 1;
        } else {
            // Not enough time has passed - increment attempts
            const nextAttempts = userAttempts.attempts + 1;
            const hasExceededMaxAttempts = nextAttempts > constants.maximumAttemptsForUser;
            attemptsLeft = constants.maximumAttemptsForUser - nextAttempts;

            if (hasExceededMaxAttempts) {
                // User has exceeded maximum attempts
                const waitTimeMs = constants.deltaTimeBetweenAttempts - timeSinceLastAttempt;
                const error: any = new Error("You have exceeded the maximum number of attempts");
                error.attemptsLeft = 0;
                error.waitTimeMs = waitTimeMs;
                throw error;
            }

            newUserAttempts = {
                lastAttemptTime: userAttempts.lastAttemptTime, // Keep same time
                attempts: nextAttempts
            };
        }
    }

    // Generate receipt using AI
    const prompt = `${constants.requestText || "Read data from receipt image"} and translated language is ${translatedLanguage}`;
    const imagePart = await fileToGenerativePart(file);
    const generatedText = await generateGeminiContent(prompt, receiptJsonSchemaTranslated, imagePart, constants.aiModel);
    const generatedReceiptWithOrdersData = transformGeneratedTextToReceiptWithOrdersData(generatedText());

    // Update user attempts
    await FirestoreUseCase.updateUserAttempts(userId, newUserAttempts);

    return { ...generatedReceiptWithOrdersData, attemptsLeft };
}

// Transforms generatedText (JSON string) to ReceiptWithOrdersData
export function transformGeneratedTextToReceiptWithOrdersData(generatedText: string) {
    let parsed: any;
    try {
        parsed = JSON.parse(generatedText);
    } catch (e) {
        throw new Error("Invalid JSON string provided to transformGeneratedTextToReceiptWithOrdersData");
    }

    // Map receipt fields
    const receipt = {
        receiptName: parsed.receipt_name,
        translatedReceiptName: parsed.translated_receipt_name,
        date: parsed.date,
        total: parsed.total_sum,
        tax: parsed.tax_in_percent,
        discount: parsed.discount_in_percent,
        tip: parsed.tip_in_percent,
    };

    // Map orders if present
    const orders = (parsed.orders || []).map((order: any) => ({
        name: order.name,
        translatedName: order.translated_name,
        quantity: order.quantity,
        price: order.price,
    }));

    return {
        receipt,
        orders,
    };
}

// Converts a list of OrderData to a list of OrderDataSplitForAll, expanding by quantity
export function convertOrderDataListToOrderSplitDataList(orders: import("../Receipt/ReceiptData").OrderData[]): import("../Receipt/ReceiptData").OrderDataSplitForAll[] {
    let result: import("../Receipt/ReceiptData").OrderDataSplitForAll[] = [];
    orders.forEach(order => {
        for (let i = 0; i < order.quantity; i++) {
            result.push({
                name: order.name,
                translatedName: order.translatedName,
                price: order.price,
                consumerNamesList: []
            });
        }
    });
    return result;
}

// Converts a list of OrderData to a list of OrderDataSplitForOne, keeping original quantities with selectedQuantity = 0
export function convertOrderDataListToOrderSplitForOneList(orders: import("../Receipt/ReceiptData").OrderData[]): import("../Receipt/ReceiptData").OrderDataSplitForOne[] {
    return orders.map(order => ({
        name: order.name,
        translatedName: order.translatedName,
        price: order.price,
        quantity: order.quantity,
        selectedQuantity: 0
    }));
}
