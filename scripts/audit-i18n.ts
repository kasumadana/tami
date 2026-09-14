import fs from "node:fs";
import path from "node:path";

function getAllKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  let keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function auditLocales(): boolean {
  const idPath = path.join(process.cwd(), "locales", "id.json");
  const enPath = path.join(process.cwd(), "locales", "en.json");

  if (!fs.existsSync(idPath) || !fs.existsSync(enPath)) {
    console.error("❌ Missing locale files in locales/");
    return false;
  }

  const idJson = JSON.parse(fs.readFileSync(idPath, "utf8"));
  const enJson = JSON.parse(fs.readFileSync(enPath, "utf8"));

  const idKeys = new Set(getAllKeys(idJson));
  const enKeys = new Set(getAllKeys(enJson));

  let hasError = false;

  for (const key of idKeys) {
    if (!enKeys.has(key)) {
      console.error(`❌ Key missing in en.json: ${key}`);
      hasError = true;
    }
  }

  for (const key of enKeys) {
    if (!idKeys.has(key)) {
      console.error(`❌ Key missing in id.json: ${key}`);
      hasError = true;
    }
  }

  if (!hasError) {
    console.log(`✅ Locales audit passed! (${idKeys.size} keys verified across id and en)`);
  }
  return !hasError;
}

function findFiles(dir: string, ext: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, ext));
    } else if (ext.some((e) => file.endsWith(e))) {
      results.push(filePath);
    }
  }
  return results;
}

function auditSourceFiles(): boolean {
  const sourceFiles = [
    ...findFiles(path.join(process.cwd(), "app"), [".tsx"]),
    ...findFiles(path.join(process.cwd(), "components"), [".tsx"]),
  ];

  let violations = 0;
  const rawTextRegex = />\s*([A-Za-z0-9\u00C0-\u024F\u1E00-\u1EFF\s.,!?:;'"()-]{3,})\s*</g;

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const prevLine = i > 0 ? lines[i - 1].trim() : "";
      const hasIgnore =
        line.includes("i18n-ignore") ||
        (i > 0 && lines[i - 1].includes("i18n-ignore")) ||
        (i > 1 && lines[i - 2].includes("i18n-ignore"));
      if (hasIgnore) {
        continue;
      }

      // Check for raw text inside JSX tags
      let match;
      while ((match = rawTextRegex.exec(line)) !== null) {
        const text = match[1].trim();
        // Ignore empty, purely punctuation, or numeric strings
        if (
          text.length > 2 &&
          !/^[0-9\s.,/\\#!$%^&*;:{}=\-_`~()|@+<>?"'\[\]]+$/.test(text) &&
          !text.startsWith("{") &&
          !text.endsWith("}")
        ) {
          console.error(
            `❌ [i18n violation] ${path.relative(process.cwd(), file)}:${i + 1} -> "${text}"`
          );
          violations++;
        }
      }

      // Check for standalone multiline JSX text (e.g. <tag>\n  Text here\n</tag>)
      const trimmed = line.trim();
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : "";
      if (
        !trimmed.startsWith("<") &&
        !trimmed.endsWith(">") &&
        !trimmed.startsWith("{") &&
        !trimmed.endsWith("}") &&
        !trimmed.startsWith("//") &&
        !trimmed.startsWith("/*") &&
        !trimmed.startsWith("*") &&
        !trimmed.startsWith("import ") &&
        !trimmed.startsWith("export ") &&
        !trimmed.startsWith("const ") &&
        !trimmed.startsWith("let ") &&
        !trimmed.startsWith("var ") &&
        !trimmed.startsWith("return ") &&
        !trimmed.startsWith("type ") &&
        !trimmed.startsWith("interface ") &&
        !trimmed.startsWith("className=") &&
        !trimmed.includes("? (") &&
        !trimmed.includes(") :") &&
        !trimmed.includes("&&") &&
        !trimmed.includes("===") &&
        !trimmed.includes("!==") &&
        !trimmed.startsWith("&ldquo;{") &&
        !trimmed.endsWith("}&rdquo;") &&
        !trimmed.startsWith(")") &&
        !trimmed.endsWith("(") &&
        prevLine.endsWith(">") &&
        nextLine.startsWith("<") &&
        trimmed.length > 2 &&
        !/^[0-9\s.,/\\#!$%^&*;:{}=\-_`~()|@+<>?"'\[\]]+$/.test(trimmed)
      ) {
        console.error(
          `❌ [i18n violation] ${path.relative(process.cwd(), file)}:${i + 1} -> "${trimmed}"`
        );
        violations++;
      }
    }
  }

  if (violations === 0) {
    console.log(`✅ Source AST scan passed! (0 hardcoded string violations across ${sourceFiles.length} files)`);
    return true;
  } else {
    console.error(`❌ Found ${violations} i18n violations. Extract them into locales/id.json and locales/en.json.`);
    return false;
  }
}

const localesOk = auditLocales();
const sourceOk = auditSourceFiles();

if (!localesOk || !sourceOk) {
  process.exit(1);
} else {
  console.log("🎉 Strict i18n Audit Completed with 0 Violations!");
  process.exit(0);
}
