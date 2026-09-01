export const encodeCursor = (id: string): string => {
  return Buffer.from(id).toString("base64");
};

export const decodeCursor = (cursor: string): string => {
  const decoded = Buffer.from(cursor, "base64").toString("utf8");

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(decoded)) {
    throw new Error("Invalid cursor: decoded value is not a valid UUID");
  }

  return decoded;
};
