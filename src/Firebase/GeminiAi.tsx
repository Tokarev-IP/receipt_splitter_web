import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";
import { ai } from "./FirebaseConfig";

function createModel(responseSchema: any, modelName: string,) {
  return getGenerativeModel(ai, {
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });
}

export async function generateGeminiContent(
  prompt: string, 
  responseSchema: any, 
  imagePart: any, 
  modelName: string,
) {
  const schema = responseSchema;
  const model = createModel(schema, modelName);
  const result = await model.generateContent([prompt, imagePart]);
  return result.response.text;
}