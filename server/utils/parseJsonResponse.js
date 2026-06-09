export const extractJsonString = (text) => {
  if (!text || typeof text !== "string") return "";

  let trimmed = text.trim();

  // Remove triple-backtick code fences and optional language tags.
  const fenceMatch = trimmed.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/i);
  if (fenceMatch) {
    trimmed = fenceMatch[1].trim();
  }

  // Remove single-backtick wrapping if present.
  if (trimmed.startsWith("`") && trimmed.endsWith("`")) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const normalizeJsonString = (text) => {
  let normalized = text.trim();

  // Quote ratio-like values such as 1:1.43 that are invalid JSON numbers.
  normalized = normalized.replace(
    /:\s*([0-9]+:[0-9]+(?:\.[0-9]+)?)/g,
    ': "$1"',
  );

  // Remove trailing commas before } or ]
  normalized = normalized.replace(/,\s*(?=[}\]])/g, "");

  return normalized;
};

const extractFirstJsonObject = (text) => {
  const start = text.indexOf("{");
  if (start === -1) return text;

  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return text;
};

export const parseJsonResponse = (text) => {
  const jsonText = extractJsonString(text);
  try {
    return JSON.parse(jsonText);
  } catch (firstError) {
    const normalized = normalizeJsonString(jsonText);
    try {
      return JSON.parse(normalized);
    } catch (secondError) {
      const objectText = extractFirstJsonObject(normalized);
      return JSON.parse(objectText);
    }
  }
};
