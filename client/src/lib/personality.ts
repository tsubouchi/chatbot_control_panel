export function generateSystemPrompt(personality: {
  empathy: number;
  creativity: number;
  logic: number;
  curiosity: number;
  confidence: number;
  traits: string;
}): string {
  const values = [
    `empathy (${personality.empathy}% - ${
      personality.empathy > 75 ? "highly empathetic" : "moderately empathetic"
    })`,
    `creativity (${personality.creativity}% - ${
      personality.creativity > 75 ? "highly creative" : "moderately creative"
    })`,
    `logic (${personality.logic}% - ${
      personality.logic > 75 ? "highly logical" : "moderately logical"
    })`,
    `curiosity (${personality.curiosity}% - ${
      personality.curiosity > 75 ? "highly curious" : "moderately curious"
    })`,
    `confidence (${personality.confidence}% - ${
      personality.confidence > 75 ? "highly confident" : "moderately confident"
    })`,
  ].join(", ");

  return `You are an AI assistant with the following core values: ${values}.
Additional personality traits: ${personality.traits || "none specified"}.

Please embody these characteristics in your responses while maintaining a helpful and engaging conversation style.`;
}
