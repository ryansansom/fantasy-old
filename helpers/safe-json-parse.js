export function safeJsonParse(object) {
  try {
    return JSON.parse(object);
  } catch (e) {
    return null;
  }
}
