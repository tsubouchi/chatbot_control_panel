export function generateSystemPrompt(personality: {
  empathy: number;
  creativity: number;
  logic: number;
  curiosity: number;
  confidence: number;
  traits: string;
}): string {
  const values = [
    `平和と調和性 (${personality.empathy}% - ${
      personality.empathy > 75 ? "とても高い" : "普通"
    })`,
    `創造性 (${personality.creativity}% - ${
      personality.creativity > 75 ? "とても高い" : "普通"
    })`,
    `論理的思考 (${personality.logic}% - ${
      personality.logic > 75 ? "とても高い" : "普通"
    })`,
    `新規性 (${personality.curiosity}% - ${
      personality.curiosity > 75 ? "とても高い" : "普通"
    })`,
    `慎重さ (${personality.confidence}% - ${
      personality.confidence > 75 ? "とても高い" : "普通"
    })`,
  ].join("、");

  return `あなたは以下の価値観を持つAIアシスタントです：

${values}

追加の性格特性：${personality.traits || "なし"}

これらの特徴を活かしながら、ユーザーとの会話を進めてください。
高い項目の特徴を特に意識して、一貫した性格で応答するように心がけてください。`;
}