/**
 * Extraction utility functions and regex patterns for auto-detecting
 * trading signal fields from text messages.
 */

export interface ExtractionPattern {
  name: string;
  key: string;
  type: "string" | "number" | "array";
  regex: string;
  required: boolean;
  description?: string;
}

export interface DetectedField {
  name: string;
  key: string;
  type: "string" | "number" | "array";
  method: "regex";
  regex: string;
  required: boolean;
  description?: string;
}

/**
 * Common regex patterns for trading signal extraction
 */
export const EXTRACTION_PATTERNS = {
  // Symbol patterns - various formats
  SYMBOL: {
    // Standalone commodity names (GOLD, SILVER, OIL, etc.)
    COMMODITY_NAMES: /(GOLD|SILVER|OIL|CRUDE|BRENT|WTI|PLATINUM|PALLADIUM)/i,
    // Commodity codes (XAU, XAG, etc.)
    COMMODITY_CODES: /(XAU|XAG|XPT|XPD)(?:USD)?/i,
    // Forex pairs (EURUSD, GBPJPY, etc.)
    FOREX_PAIRS:
      /([A-Z]{3}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|CHF|SEK|NOK|ZAR|MXN|TRY))/i,
    // Crypto symbols (BTC, ETH, etc. with optional USD/USDT)
    CRYPTO:
      /(BTC|ETH|BNB|ADA|SOL|XRP|DOT|DOGE|MATIC|AVAX|LINK|UNI|LTC|BCH|XLM|ATOM|ALGO|VET|FIL|TRX|EOS|AAVE|COMP|MKR|SNX|SUSHI|YFI|1INCH|GRT|ENJ|MANA|SAND|AXS|GALA|RUNE|THETA|FLOW|NEAR|FTM|AVAX|LUNA|UST)(?:USD|USDT)?/i,
    // Indices (US30, SPX, NAS100, etc.)
    INDICES:
      /(US30|SPX|SP500|NAS100|NASDAQ|DXY|VIX|FTSE|DAX|NIKKEI|CAC|ASX|HSI|SSE)/i,
    // Comprehensive pattern - matches symbols at start of line or before BUY/SELL/LONG/SHORT
    // This handles: GOLD, EURUSD, XAUUSD, BTCUSD, US30, etc.
    COMPREHENSIVE:
      /(?:^|\s)(GOLD|SILVER|OIL|CRUDE|BRENT|WTI|XAU|XAG|XPT|XPD|US30|SPX|SP500|NAS100|NASDAQ|DXY|VIX|FTSE|DAX|NIKKEI|BTC|ETH|BNB|ADA|SOL|XRP|DOT|DOGE|MATIC|AVAX|[A-Z]{3,6}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT|CHF|SEK|NOK|ZAR|MXN|TRY)?)(?=\s|$|BUY|SELL|LONG|SHORT)/i,
    // Simple pattern for common cases
    STANDARD:
      /(?:^|\s)([A-Z]{2,8}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\s|$|BUY|SELL|LONG|SHORT)/i,
  },

  // Signal type patterns
  SIGNAL_TYPE: {
    STANDARD: /(BUY|SELL|LONG|SHORT)/i,
    WITH_SPACE: /(BUY|SELL|LONG|SHORT)\s+(?:NOW|LIMIT|MARKET|STOP)?/i,
    ALTERNATIVE: /(GO\s+LONG|GO\s+SHORT|OPEN\s+LONG|OPEN\s+SHORT)/i,
  },

  // Entry price patterns - multiple formats (supports single values and ranges)
  ENTRY_PRICE: {
    // Single entry price patterns
    AT_SYMBOL: /@\s*([0-9]+\.?[0-9]*)/i,
    ENTRY_LABEL: /(?:Entry|EP|ENTRY|Entry\s*Price)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    PRICE_ONLY: /(?:Price|P)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    // Range patterns - two prices separated by whitespace
    RANGE_AFTER_BUY:
      /(?:BUY|SELL|LONG|SHORT)\s+([0-9]+\.?[0-9]*)\s+([0-9]+\.?[0-9]*)/i,
    RANGE_WITH_LABEL:
      /(?:Entry|EP|Entry\s*Price)\s*:?\s*([0-9]+\.?[0-9]*)\s+([0-9]+\.?[0-9]*)/i,
    RANGE_WITH_AT: /@\s*([0-9]+\.?[0-9]*)\s+([0-9]+\.?[0-9]*)/i,
    RANGE_WITH_DASH:
      /(?:Entry|EP|@)\s*:?\s*([0-9]+\.?[0-9]*)\s*[-–—]\s*([0-9]+\.?[0-9]*)/i,
    RANGE_WITH_TO:
      /(?:Entry|EP)\s*:?\s*([0-9]+\.?[0-9]*)\s+to\s+([0-9]+\.?[0-9]*)/i,
    // Comprehensive pattern - matches single or range
    COMPREHENSIVE:
      /(?:@|Entry|EP|Entry\s*Price|Price|(?:BUY|SELL|LONG|SHORT))\s*:?\s*([0-9]+\.?[0-9]*)(?:\s+(?:[-–—]|to)?\s*([0-9]+\.?[0-9]*))?/i,
    // Pattern specifically for range detection
    RANGE_DETECTION:
      /(?:Entry|EP|Entry\s*Price|@|(?:BUY|SELL|LONG|SHORT))\s*:?\s*([0-9]+\.?[0-9]*)\s+([0-9]+\.?[0-9]*)/i,
  },

  // Stop Loss patterns
  STOP_LOSS: {
    STANDARD: /(?:SL|Stop\s*Loss|Stop)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    WITH_PIPS: /(?:SL|Stop)\s*:?\s*([0-9]+\.?[0-9]*)\s*(?:pips?)?/i,
    ALTERNATIVE: /(?:Stop|S\.L\.|S\/L)\s*:?\s*([0-9]+\.?[0-9]*)/i,
  },

  // Take Profit patterns - can be multiple
  TAKE_PROFIT: {
    SINGLE: /(?:TP|Take\s*Profit|Target)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    NUMBERED: /(?:TP|Take\s*Profit|Target)\s*(\d+)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    MULTIPLE: /(?:TP|Take\s*Profit|Target)\s*\d?\s*:?\s*([0-9]+\.?[0-9]*)/gi,
    WITH_PIPS: /(?:TP|Target)\s*:?\s*([0-9]+\.?[0-9]*)\s*(?:pips?)?/i,
  },

  // Timeframe patterns
  TIMEFRAME: {
    STANDARD: /(?:TF|Timeframe|Time)\s*:?\s*([1-9]\d*[MHDW])/i,
    INLINE: /\b([1-9]\d*[MHDW])\b/i,
    COMPREHENSIVE: /(?:TF|Timeframe|Time|Chart)\s*:?\s*([1-9]\d*[MHDW])/i,
  },

  // Risk/Reward ratio patterns
  RISK_REWARD: {
    STANDARD:
      /(?:R:R|RR|Risk:Reward|Risk\/Reward)\s*:?\s*([0-9]+\.?[0-9]*)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    RATIO_ONLY: /(?:R:R|RR)\s*:?\s*([0-9]+\.?[0-9]*)/i,
  },

  // Lot size / Position size
  LOT_SIZE: {
    STANDARD: /(?:Lot|Size|Position)\s*:?\s*([0-9]+\.?[0-9]*)/i,
    ALTERNATIVE: /([0-9]+\.?[0-9]*)\s*(?:lots?|units?)/i,
  },

  // Leverage patterns
  LEVERAGE: {
    STANDARD: /(?:Leverage|Lev|L)\s*:?\s*([0-9]+)\s*(?:x|:1)?/i,
    COMPACT: /([0-9]+)x/i,
  },
} as const;

/**
 * Predefined extraction patterns for common signal formats
 */
export const COMMON_PATTERNS: ExtractionPattern[] = [
  {
    name: "Symbol",
    key: "symbol",
    type: "string",
    regex:
      "(?:^|\\s)(GOLD|SILVER|OIL|CRUDE|BRENT|WTI|XAU|XAG|XPT|XPD|US30|SPX|SP500|NAS100|NASDAQ|DXY|VIX|FTSE|DAX|NIKKEI|BTC|ETH|BNB|ADA|SOL|XRP|DOT|DOGE|MATIC|AVAX|[A-Z]{3,6}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\\s|$|BUY|SELL|LONG|SHORT)",
    required: true,
    description:
      "Trading pair symbol (e.g., GOLD, XAUUSD, BTCUSD, EURUSD, US30)",
  },
  {
    name: "Signal Type",
    key: "type",
    type: "string",
    regex: "(BUY|SELL|LONG|SHORT)",
    required: true,
    description: "Trade direction",
  },
  {
    name: "Entry Price",
    key: "entry",
    type: "array",
    regex:
      "(?:Entry|EP|Entry\\s*Price|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
    required: true,
    description: "Entry price level (single value or range)",
  },
  {
    name: "Stop Loss",
    key: "sl",
    type: "number",
    regex:
      "(?:SL|Stop\\s*Loss|Stop|S\\.L\\.|S\\/L)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
    required: true,
    description: "Stop loss price level",
  },
  {
    name: "Take Profit",
    key: "tp",
    type: "array",
    regex: "(?:TP|Take\\s*Profit|Target)\\d?\\s*:?\\s*([0-9]+\\.?[0-9]*)",
    required: false,
    description: "Take profit levels (can be multiple)",
  },
  {
    name: "Timeframe",
    key: "timeframe",
    type: "string",
    regex: "(?:TF|Timeframe|Time|Chart)\\s*:?\\s*([1-9]\\d*[MHDW])",
    required: false,
    description: "Chart timeframe (e.g., 1H, 4H, 1D)",
  },
  {
    name: "Risk Reward Ratio",
    key: "risk_reward",
    type: "string",
    regex:
      "(?:R:R|RR|Risk:Reward|Risk\\/Reward)\\s*:?\\s*([0-9]+\\.?[0-9]*)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
    required: false,
    description: "Risk to reward ratio",
  },
];

/**
 * Pattern collections for different signal formats
 */
export const PATTERN_COLLECTIONS = {
  /**
   * Standard format: "GOLD BUY NOW @ 2045.50\nSL: 2040\nTP1: 2050\nTP2: 2055"
   */
  STANDARD: [
    {
      name: "Symbol",
      key: "symbol",
      type: "string" as const,
      regex:
        "(?:^|\\s)(GOLD|SILVER|OIL|XAU|XAG|US30|SPX|BTC|ETH|[A-Z]{3,6}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\\s|$|BUY|SELL|LONG|SHORT)",
      required: true,
    },
    {
      name: "Type",
      key: "type",
      type: "string" as const,
      regex: "(BUY|SELL|LONG|SHORT)",
      required: true,
    },
    {
      name: "Entry",
      key: "entry",
      type: "array" as const,
      regex:
        "(?:Entry|EP|Entry\\s*Price|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
    },
    {
      name: "Stop Loss",
      key: "sl",
      type: "number" as const,
      regex: "(?:SL|Stop)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: true,
    },
    {
      name: "Take Profit",
      key: "tp",
      type: "array" as const,
      regex: "(?:TP|Target)\\d?\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: false,
    },
  ],

  /**
   * Crypto format: "Short BTC/USD\nEntry: 64500\nStop: 65200"
   */
  CRYPTO: [
    {
      name: "Symbol",
      key: "symbol",
      type: "string" as const,
      regex: "(?:Long|Short|Buy|Sell)\\s+([A-Z]+(?:\\/[A-Z]+)?)",
      required: true,
    },
    {
      name: "Type",
      key: "type",
      type: "string" as const,
      regex: "(Long|Short|Buy|Sell)",
      required: true,
    },
    {
      name: "Entry",
      key: "entry",
      type: "array" as const,
      regex:
        "(?:Entry|EP|Entry\\s*Price|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
    },
    {
      name: "Stop Loss",
      key: "sl",
      type: "number" as const,
      regex: "(?:Stop|SL)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: true,
    },
  ],

  /**
   * Compact format: "EURUSD BUY @1.0845 SL:1.0820 TP:1.0900"
   */
  COMPACT: [
    {
      name: "Symbol",
      key: "symbol",
      type: "string" as const,
      regex:
        "(?:^|\\s)([A-Z]{3,8}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\\s|BUY|SELL)",
      required: true,
    },
    {
      name: "Type",
      key: "type",
      type: "string" as const,
      regex: "(BUY|SELL)",
      required: true,
    },
    {
      name: "Entry",
      key: "entry",
      type: "array" as const,
      regex:
        "(?:@|Entry|EP|(?:BUY|SELL))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
    },
    {
      name: "Stop Loss",
      key: "sl",
      type: "number" as const,
      regex: "SL:([0-9]+\\.?[0-9]*)",
      required: true,
    },
    {
      name: "Take Profit",
      key: "tp",
      type: "array" as const,
      regex: "TP:([0-9]+\\.?[0-9]*)",
      required: false,
    },
  ],

  /**
   * Detailed format with timeframe and R:R
   */
  DETAILED: [
    {
      name: "Symbol",
      key: "symbol",
      type: "string" as const,
      regex:
        "(?:^|\\s)(GOLD|SILVER|OIL|XAU|XAG|US30|SPX|BTC|ETH|[A-Z]{3,6}(?:USD|JPY|EUR|GBP|CHF|CAD|AUD|NZD|USDT)?)(?=\\s|$|BUY|SELL|LONG|SHORT)",
      required: true,
    },
    {
      name: "Type",
      key: "type",
      type: "string" as const,
      regex: "(BUY|SELL|LONG|SHORT)",
      required: true,
    },
    {
      name: "Entry",
      key: "entry",
      type: "array" as const,
      regex:
        "(?:Entry|EP|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
    },
    {
      name: "Stop Loss",
      key: "sl",
      type: "number" as const,
      regex: "(?:SL|Stop\\s*Loss)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: true,
    },
    {
      name: "Take Profit",
      key: "tp",
      type: "array" as const,
      regex: "(?:TP|Take\\s*Profit|Target)\\d?\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: false,
    },
    {
      name: "Timeframe",
      key: "timeframe",
      type: "string" as const,
      regex: "(?:TF|Timeframe)\\s*:?\\s*([1-9]\\d*[MHDW])",
      required: false,
    },
    {
      name: "Risk Reward",
      key: "risk_reward",
      type: "string" as const,
      regex:
        "(?:R:R|RR)\\s*:?\\s*([0-9]+\\.?[0-9]*)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: false,
    },
  ],
};

/**
 * Detect which pattern collection best matches the given text
 */
export function detectPatternCollection(
  text: string
): keyof typeof PATTERN_COLLECTIONS | null {
  const lowerText = text.toLowerCase();

  // Check for crypto patterns
  if (
    lowerText.includes("btc") ||
    lowerText.includes("eth") ||
    lowerText.match(/[a-z]+\/[a-z]+/)
  ) {
    return "CRYPTO";
  }

  // Check for compact format (no line breaks, everything on one line)
  if (!text.includes("\n") && text.match(/[A-Z]{6}\s+(BUY|SELL)\s+@/)) {
    return "COMPACT";
  }

  // Check for detailed format (has timeframe or R:R)
  if (lowerText.match(/(?:tf|timeframe|r:r|rr)/i)) {
    return "DETAILED";
  }

  // Default to standard format
  if (text.match(/@\s*[0-9]/) && text.match(/(?:SL|Stop)/i)) {
    return "STANDARD";
  }

  return null;
}

/**
 * Auto-detect fields from text using pattern matching
 */
export function autoDetectFields(text: string): DetectedField[] {
  const detectedFields: DetectedField[] = [];
  const lowerText = text.toLowerCase();

  // Detect Symbol - use comprehensive pattern that handles all cases
  if (EXTRACTION_PATTERNS.SYMBOL.COMPREHENSIVE.test(text)) {
    detectedFields.push({
      name: "Symbol",
      key: "symbol",
      type: "string",
      method: "regex",
      regex: EXTRACTION_PATTERNS.SYMBOL.COMPREHENSIVE.source.replace(
        /^\/|\/[a-z]*$/gi,
        ""
      ),
      required: true,
      description: "Trading pair symbol",
    });
  }

  // Detect Signal Type
  if (EXTRACTION_PATTERNS.SIGNAL_TYPE.STANDARD.test(text)) {
    detectedFields.push({
      name: "Type",
      key: "type",
      type: "string",
      method: "regex",
      regex: "(BUY|SELL|LONG|SHORT)",
      required: true,
      description: "Trade direction",
    });
  }

  // Detect Entry Price (supports single values and ranges)
  // Check for range first (two prices)
  if (EXTRACTION_PATTERNS.ENTRY_PRICE.RANGE_DETECTION.test(text)) {
    detectedFields.push({
      name: "Entry",
      key: "entry",
      type: "array",
      method: "regex",
      regex:
        "(?:Entry|EP|Entry\\s*Price|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)\\s+([0-9]+\\.?[0-9]*)",
      required: true,
      description: "Entry price level (range)",
    });
  } else if (EXTRACTION_PATTERNS.ENTRY_PRICE.COMPREHENSIVE.test(text)) {
    // Single entry price
    detectedFields.push({
      name: "Entry",
      key: "entry",
      type: "array",
      method: "regex",
      regex:
        "(?:Entry|EP|Entry\\s*Price|@|(?:BUY|SELL|LONG|SHORT))\\s*:?\\s*([0-9]+\\.?[0-9]*)(?:\\s+(?:[-–—]|to)?\\s*([0-9]+\\.?[0-9]*))?",
      required: true,
      description: "Entry price level (single or range)",
    });
  }

  // Detect Stop Loss
  if (EXTRACTION_PATTERNS.STOP_LOSS.STANDARD.test(text)) {
    detectedFields.push({
      name: "Stop Loss",
      key: "sl",
      type: "number",
      method: "regex",
      regex:
        "(?:SL|Stop\\s*Loss|Stop|S\\.L\\.|S\\/L)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: true,
      description: "Stop loss price level",
    });
  }

  // Detect Take Profit (array - can be multiple)
  const tpMatches = text.match(EXTRACTION_PATTERNS.TAKE_PROFIT.MULTIPLE);
  if (tpMatches && tpMatches.length > 0) {
    detectedFields.push({
      name: "Take Profit",
      key: "tp",
      type: "array",
      method: "regex",
      regex: "(?:TP|Take\\s*Profit|Target)\\d?\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: false,
      description: "Take profit levels (can be multiple)",
    });
  }

  // Detect Timeframe
  if (EXTRACTION_PATTERNS.TIMEFRAME.COMPREHENSIVE.test(text)) {
    detectedFields.push({
      name: "Timeframe",
      key: "timeframe",
      type: "string",
      method: "regex",
      regex: "(?:TF|Timeframe|Time|Chart)\\s*:?\\s*([1-9]\\d*[MHDW])",
      required: false,
      description: "Chart timeframe",
    });
  }

  // Detect Risk/Reward Ratio
  if (EXTRACTION_PATTERNS.RISK_REWARD.STANDARD.test(text)) {
    detectedFields.push({
      name: "Risk Reward",
      key: "risk_reward",
      type: "string",
      method: "regex",
      regex:
        "(?:R:R|RR|Risk:Reward|Risk\\/Reward)\\s*:?\\s*([0-9]+\\.?[0-9]*)\\s*:?\\s*([0-9]+\\.?[0-9]*)",
      required: false,
      description: "Risk to reward ratio",
    });
  }

  return detectedFields;
}

/**
 * Get pattern collection for a specific format
 */
export function getPatternCollection(
  format: keyof typeof PATTERN_COLLECTIONS
): ExtractionPattern[] {
  return PATTERN_COLLECTIONS[format];
}

/**
 * Test if a regex pattern matches text
 */
export function testPattern(
  pattern: string,
  text: string,
  flags: string = "i"
): boolean {
  try {
    const regex = new RegExp(pattern, flags);
    return regex.test(text);
  } catch (e) {
    return false;
  }
}

/**
 * Extract value using a regex pattern
 */
export function extractValue(
  pattern: string,
  text: string,
  flags: string = "i"
): string | null {
  try {
    const regex = new RegExp(pattern, flags);
    const match = text.match(regex);
    return match && match[1] ? match[1] : null;
  } catch (e) {
    return null;
  }
}

/**
 * Extract multiple values using a regex pattern (for arrays)
 */
export function extractValues(
  pattern: string,
  text: string,
  flags: string = "gi"
): string[] {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...text.matchAll(regex)];
    return matches
      .map((m) => (m[1] ? m[1] : m[0]))
      .filter((v) => v !== null && v !== undefined);
  } catch (e) {
    return [];
  }
}

/**
 * Generate a regex pattern from a text selection
 * (Smart pattern generation based on context)
 */
export function generateRegexFromSelection(
  fullText: string,
  selection: string
): string {
  const escapedSelection = selection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const selectionIndex = fullText.indexOf(selection);

  if (selectionIndex === -1) return `(${escapedSelection})`;

  // Look at context before the selection (up to 15 chars)
  const contextBefore = fullText.substring(
    Math.max(0, selectionIndex - 15),
    selectionIndex
  );

  // Check for common delimiters like ": ", "@ ", " ", "="
  const delimiterMatch = contextBefore.match(/([:@\s=]+)$/);

  if (delimiterMatch) {
    const delimiter = delimiterMatch[1]
      .replace(/\s/g, "\\s*")
      .replace(/[:@=]/g, "\\$&");

    // Try to generalize the value based on selection type
    let valuePattern = "(.+)";

    // Number pattern
    if (!isNaN(Number(selection)) && selection.match(/^[0-9.]+$/)) {
      valuePattern = "([0-9]+\\.?[0-9]*)";
    }
    // Uppercase letters (likely symbol)
    else if (/^[A-Z]{2,6}$/.test(selection)) {
      valuePattern = "([A-Z]{2,6})";
    }
    // Mixed case with slash (likely pair)
    else if (/^[A-Z]{2,6}\/[A-Z]{2,6}$/.test(selection)) {
      valuePattern = "([A-Z]{2,6}\\/[A-Z]{2,6})";
    }
    // Timeframe pattern (e.g., 1H, 4H, 1D)
    else if (/^[0-9]+[MHDW]$/i.test(selection)) {
      valuePattern = "([0-9]+[MHDW])";
    }

    return `${delimiter}${valuePattern}`;
  }

  return `(${escapedSelection})`;
}
