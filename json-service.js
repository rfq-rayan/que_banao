export function parseQuestionPayload(jsonString) {
  const data = JSON.parse(jsonString);

  if (Array.isArray(data)) {
    return { questions: data, metadata: {} };
  }

  if (data && Array.isArray(data.questions)) {
    return { questions: data.questions, metadata: data.metadata || {} };
  }

  throw new Error("JSON ফাইলের গঠন সঠিক নয়। questions অ্যারে থাকতে হবে।");
}
