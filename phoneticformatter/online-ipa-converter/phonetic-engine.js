/**
 * Phonetic Formatter web engine — port of App PhoneticFormatter + display helpers.
 * Phase A: By-sentence output only.
 */
(function (global) {
  "use strict";

  var ABBREVIATION_STEMS = {
    dr: 1, mr: 1, mrs: 1, ms: 1, st: 1, prof: 1, etc: 1, vs: 1, no: 1, rev: 1, sr: 1, jr: 1,
    gen: 1, col: 1, lt: 1, sgt: 1, gov: 1, sen: 1, rep: 1, pres: 1, ph: 1, vol: 1, fig: 1,
    approx: 1, est: 1, al: 1, cf: 1, ed: 1, "a.m": 1, "p.m": 1, "u.s": 1, "u.k": 1, aka: 1,
  };

  var ABBREVIATION_IPA = {
    "dr.": "ˈdɑktɚ", "mr.": "ˈmɪstɚ", "mrs.": "ˈmɪsɪz", "ms.": "mɪz",
    "st.": "seɪnt", "prof.": "prəˈfɛsɚ", "etc.": "ˌɛtˈsɛtɚə", "vs.": "ˈvɚsəs",
    "no.": "ˈnʌmbɚ", "rev.": "ˈrɛvɚənd", "sr.": "ˈsiniɚ", "jr.": "ˈdʒuniɚ",
    "gen.": "ˈdʒɛnɚəl", "col.": "ˈkɚnəl", "lt.": "luˈtɛnənt", "sgt.": "ˈsɑrdʒənt",
    "gov.": "ˈɡʌvɚnɚ", "sen.": "ˈsɛnətɚ", "rep.": "ˈrɛprəˌzɛntətɪv", "pres.": "ˈprɛzədənt",
    "ph.": "ˈdɑktɚ", "vol.": "ˈvɑljum", "fig.": "ˈfɪɡjɚ", "approx.": "əˈprɑksəmətli",
    "est.": "ˈɛstəˌmeɪtɪd", "al.": "ˈɔlsoʊ", "cf.": "ˌkɑmpəˈrɛsən", "ed.": "ˈɛdətɚ",
    "a.m.": "ˌeɪˈɛm", "p.m.": "ˌpiˈɛm", "u.s.": "ˌjuˈɛs", "u.k.": "ˌjuˈkeɪ", "aka.": "ˌeɪˌkeɪˈeɪ",
    "e.g.": "ˌiˈdʒi", "i.e.": "ˌaɪˈi", "u.s.a.": "ˌjuˌɛsˈeɪ", "ph.d.": "ˌpiˌeɪtʃˈdi",
  };

  var LETTER_IPA = {
    A: "eɪ", B: "biː", C: "siː", D: "diː", E: "iː", F: "ɛf", G: "dʒiː", H: "eɪtʃ",
    I: "aɪ", J: "dʒeɪ", K: "keɪ", L: "ɛl", M: "ɛm", N: "ɛn", O: "oʊ", P: "piː",
    Q: "kjuː", R: "ɑr", S: "ɛs", T: "tiː", U: "juː", V: "viː", W: "dʌbəljuː",
    X: "ɛks", Y: "waɪ", Z: "ziː",
  };

  var SPECIAL_SYMBOLS = {
    "|": 1, "©": 1, "®": 1, "™": 1, "§": 1, "†": 1, "‡": 1, "•": 1, "·": 1, "°": 1,
    "‰": 1, "′": 1, "″": 1, "✓": 1, "✔": 1, "✗": 1, "※": 1, "¶": 1,
    "€": 1, $: 1, "£": 1, "¥": 1, "₹": 1, "₽": 1, "₩": 1, "₪": 1, "¢": 1, "¤": 1,
  };

  var CURRENCY = { "€": 1, $: 1, "£": 1, "¥": 1, "₹": 1, "₽": 1, "₩": 1, "₪": 1, "¢": 1, "¤": 1 };

  var LEADING = {
    "\u201C": 1, "\u2018": 1, "\u201E": 1, '"': 1, "'": 1, "(": 1, "[": 1, "{": 1,
  };
  var TRAILING = {
    ",": 1, ".": 1, "?": 1, "!": 1, ":": 1, ";": 1, ")": 1, "]": 1, "}": 1,
    "\u201D": 1, "\u2019": 1, '"': 1, "'": 1,
  };
  var CLOSING_QUOTE = { "\u201D": 1, "\u2019": 1, '"': 1, "'": 1 };

  var dictionaryMap = null;

  function setDictionary(map) {
    dictionaryMap = map;
  }

  function lookupPronunciations(word) {
    if (!dictionaryMap) return [];
    var key = String(word)
      .replace(/\u2019/g, "'")
      .replace(/\u2018/g, "'")
      .toUpperCase();
    return dictionaryMap.get(key) || [];
  }

  function lookupIPA(word) {
    var list = lookupPronunciations(word);
    return list.length ? list[0] : null;
  }

  function isLetter(ch) {
    return /[A-Za-z]/.test(ch);
  }
  function isNumberChar(ch) {
    return ch >= "0" && ch <= "9";
  }
  function isUnifiedHyphen(ch) {
    return ch === "-" || ch === "\u2010" || ch === "\u2011";
  }
  function isCurrencySymbol(ch) {
    return !!CURRENCY[ch];
  }
  function isPunctChar(ch) {
    return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(ch) ||
      "\u2013\u2014\u2018\u2019\u201C\u201D\u2026".indexOf(ch) !== -1;
  }

  function isNumberWithOptionalDecimal(str) {
    if (!str) return false;
    if (/^\d+$/.test(str)) return true;
    var parts = str.split(".");
    return parts.length === 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1]);
  }

  function isNumberWithOptionalDecimalOrSigned(str) {
    var s = str;
    if ((s[0] === "+" || s[0] === "-") && s.length > 1) s = s.slice(1);
    return isNumberWithOptionalDecimal(s);
  }

  function tryConsumeTimeExpression(chars, start) {
    var count = chars.length;
    if (start >= count || !isNumberChar(chars[start])) return null;
    if (
      start + 4 <= count &&
      chars[start + 1] === ":" &&
      isNumberChar(chars[start + 2]) &&
      isNumberChar(chars[start + 3]) &&
      (start + 4 === count || !isNumberChar(chars[start + 4]))
    ) {
      return { token: chars.slice(start, start + 4).join(""), endIndex: start + 4 };
    }
    if (
      start + 5 <= count &&
      isNumberChar(chars[start + 1]) &&
      chars[start + 2] === ":" &&
      isNumberChar(chars[start + 3]) &&
      isNumberChar(chars[start + 4]) &&
      (start + 5 === count || !isNumberChar(chars[start + 5]))
    ) {
      return { token: chars.slice(start, start + 5).join(""), endIndex: start + 5 };
    }
    return null;
  }

  function tryConsumeMultipartAbbreviation(chars, start) {
    var i = start;
    if (i >= chars.length || !isLetter(chars[i])) return null;
    var segments = [];
    while (i < chars.length) {
      var letters = "";
      while (i < chars.length && isLetter(chars[i])) {
        letters += chars[i];
        i += 1;
      }
      if (!letters || i >= chars.length || chars[i] !== ".") break;
      letters += ".";
      segments.push(letters);
      i += 1;
    }
    if (segments.length < 2) return null;
    if (i < chars.length && (isLetter(chars[i]) || chars[i] === ".")) return null;
    return { token: segments.join(""), endIndex: i };
  }

  function isWhitespace(ch) {
    return ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\f";
  }

  function tokenize(text) {
    var tokens = [];
    var currentWord = "";
    var chars = Array.from(text);
    var index = 0;

    function flushWord() {
      if (currentWord) {
        tokens.push(currentWord);
        currentWord = "";
      }
    }

    while (index < chars.length) {
      var char = chars[index];
      if (isWhitespace(char)) {
        flushWord();
        if (char === "\n" || char === "\r") {
          tokens.push("\n");
          index += 1;
          if (char === "\r" && index < chars.length && chars[index] === "\n") index += 1;
        } else {
          tokens.push(" ");
          index += 1;
        }
      } else if (char === "'" || char === "\u2019") {
        var nextIsLetter = index + 1 < chars.length && isLetter(chars[index + 1]);
        if (currentWord && nextIsLetter) {
          currentWord += char;
        } else {
          flushWord();
          tokens.push(char);
        }
        index += 1;
      } else if (isNumberChar(char) && !currentWord) {
        var timeMatch = tryConsumeTimeExpression(chars, index);
        if (timeMatch) {
          tokens.push(timeMatch.token);
          index = timeMatch.endIndex;
        } else {
          currentWord += char;
          index += 1;
        }
      } else if (isLetter(char) && !currentWord) {
        var abbr = tryConsumeMultipartAbbreviation(chars, index);
        if (abbr) {
          tokens.push(abbr.token);
          index = abbr.endIndex;
        } else {
          currentWord += char;
          index += 1;
        }
      } else if (char === ".") {
        var currentIsNumericOrStructural =
          currentWord &&
          (/^\d+$/.test(currentWord) || /^[\d.]+$/.test(currentWord));
        if (currentIsNumericOrStructural) {
          var look = index + 1;
          while (look < chars.length && isWhitespace(chars[look])) look += 1;
          var nextIsDigit = look < chars.length && isNumberChar(chars[look]);
          if (nextIsDigit) {
            currentWord += ".";
            index += 1;
            while (index < chars.length && isWhitespace(chars[index])) index += 1;
            while (index < chars.length && isNumberChar(chars[index])) {
              currentWord += chars[index];
              index += 1;
            }
            continue;
          }
          var nonSpaceTokens = tokens.filter(function (t) {
            return t !== " " && !/^\s+$/.test(t);
          });
          var lastNonSpace = nonSpaceTokens[nonSpaceTokens.length - 1];
          var secondLast = nonSpaceTokens.length >= 2 ? nonSpaceTokens[nonSpaceTokens.length - 2] : null;
          var prevIsNumeric =
            secondLast &&
            (isNumberToken(secondLast) ||
              isStructuralNumber(secondLast) ||
              isNumberWithThousandsSeparator(secondLast));
          var afterSentenceEnd =
            (lastNonSpace === "." || lastNonSpace === "!" || lastNonSpace === "?") && !prevIsNumeric;
          var afterListMarker = lastNonSpace ? isListMarker(lastNonSpace) : false;
          var afterListItemTitle = secondLast ? isListMarker(secondLast) : false;
          var atStructuralStart =
            !tokens.length ||
            tokens[tokens.length - 1] === "\n" ||
            afterSentenceEnd ||
            afterListMarker ||
            afterListItemTitle;
          var isPureDigits = /^\d+$/.test(currentWord);
          if (atStructuralStart && isPureDigits) {
            currentWord += ".";
            tokens.push(currentWord);
            currentWord = "";
            index += 1;
            continue;
          }
          tokens.push(currentWord);
          currentWord = "";
          tokens.push(".");
          index += 1;
          continue;
        }
        if (currentWord && ABBREVIATION_STEMS[currentWord.toLowerCase()]) {
          currentWord += ".";
          tokens.push(currentWord);
          currentWord = "";
        } else {
          flushWord();
          tokens.push(".");
        }
        index += 1;
      } else if (isUnifiedHyphen(char)) {
        if (
          currentWord &&
          index + 1 < chars.length &&
          (isLetter(chars[index + 1]) || isNumberChar(chars[index + 1]))
        ) {
          currentWord += char;
          index += 1;
        } else {
          flushWord();
          tokens.push(char);
          index += 1;
        }
      } else if (char === "&") {
        if (currentWord && index + 1 < chars.length && isLetter(chars[index + 1])) {
          currentWord += "&";
          index += 1;
        } else {
          flushWord();
          tokens.push("&");
          index += 1;
        }
      } else if (char === "\u2013") {
        if (
          currentWord &&
          /^\d+$/.test(currentWord) &&
          index + 1 < chars.length &&
          isNumberChar(chars[index + 1])
        ) {
          currentWord += "\u2013";
          index += 1;
        } else {
          flushWord();
          tokens.push(char);
          index += 1;
        }
      } else if (char === ",") {
        if (
          currentWord &&
          /^\d+$/.test(currentWord) &&
          index + 1 < chars.length &&
          isNumberChar(chars[index + 1])
        ) {
          currentWord += ",";
          index += 1;
          while (index < chars.length && (isNumberChar(chars[index]) || chars[index] === ",")) {
            currentWord += chars[index];
            index += 1;
          }
          continue;
        }
        flushWord();
        tokens.push(",");
        index += 1;
      } else if (char === "%" && currentWord && isNumberWithOptionalDecimalOrSigned(currentWord)) {
        currentWord += "%";
        tokens.push(currentWord);
        currentWord = "";
        index += 1;
      } else if (isPunctChar(char) || isCurrencySymbol(char)) {
        flushWord();
        tokens.push(char);
        index += 1;
      } else {
        currentWord += char;
        index += 1;
      }
    }
    flushWord();
    return tokens;
  }

  function isPunctuation(str) {
    if (!str) return false;
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (!(isPunctChar(c) || isWhitespace(c) || isCurrencySymbol(c))) return false;
    }
    return true;
  }

  function isNumberToken(str) {
    return !!str && /^\d+$/.test(str);
  }

  function isListMarker(str) {
    return str.length >= 2 && str.endsWith(".") && /^\d+\.$/.test(str);
  }

  function isStructuralNumber(str) {
    return !!str && /^[\d.]+$/.test(str) && /\d/.test(str);
  }

  function isNumberWithThousandsSeparator(str) {
    return !!str && str.indexOf(",") !== -1 && /^[\d,]+$/.test(str);
  }

  function isTimeExpression(word) {
    return /^\d{1,2}:\d{2}$/.test(word) &&
      !(/^\d{3,}:/.test(word)) &&
      word.split(":")[1].length === 2;
  }

  function isAlphanumericToken(word) {
    return /[A-Za-z]/.test(word) && /\d/.test(word);
  }

  function isPercentageToken(word) {
    if (!word.endsWith("%") || word.length < 2) return false;
    var num = word.slice(0, -1);
    if (num[0] === "+" || num[0] === "-") num = num.slice(1);
    return isNumberWithOptionalDecimal(num);
  }

  function isNumericRangeWithEnDash(word) {
    var idx = word.indexOf("\u2013");
    if (idx < 1) return false;
    var before = word.slice(0, idx);
    var after = word.slice(idx + 1);
    return /^\d+$/.test(before) && /^\d+$/.test(after);
  }

  function isSpecialSymbolOrEmoji(word) {
    if (!word) return false;
    if (/^[\d.]+$/.test(word)) return false;
    if (word.length === 1 && SPECIAL_SYMBOLS[word]) return true;
    try {
      return /\p{Extended_Pictographic}/u.test(word);
    } catch (e) {
      return false;
    }
  }

  function stemEndsWithVoiceless(ipa) {
    var voiceless = ["tʃ", "p", "t", "k", "f", "θ", "s", "ʃ", "h"];
    for (var i = 0; i < voiceless.length; i++) {
      if (ipa.endsWith(voiceless[i])) return true;
    }
    return false;
  }

  function ipaForPossessive(cleanWord) {
    var normalized = cleanWord.replace(/\u2019/g, "'").replace(/\u2018/g, "'");
    if (!normalized.endsWith("'s") || normalized.length <= 2) return null;
    var stem = normalized.slice(0, -2);
    var stemIPA = lookupIPA(stem);
    if (!stemIPA) return null;
    return stemIPA + (stemEndsWithVoiceless(stemIPA) ? "s" : "z");
  }

  function letterByLetterIPA(letters) {
    var parts = [];
    var upper = letters.toUpperCase();
    for (var i = 0; i < upper.length; i++) {
      var syl = LETTER_IPA[upper[i]];
      if (!syl) continue;
      parts.push(i === 0 ? "ˈ" + syl : syl);
    }
    return parts.join(" ");
  }

  function ipaForAcronym(word) {
    var letters = word.replace(/[^A-Za-z]/g, "");
    if (letters.length < 2) return null;
    if (letters !== letters.toUpperCase()) return null;
    if (!/^[A-Za-z]+$/.test(word)) return null;
    return letterByLetterIPA(letters);
  }

  function ipaForHyphenatedCompound(word) {
    if (!/[-\u2010\u2011]/.test(word)) return null;
    var normalized = word.replace(/[\u2010\u2011]/g, "-");
    var parts = normalized.split("-").filter(function (p) {
      return p && /[A-Za-z]/.test(p);
    });
    if (parts.length < 2) return null;
    var ipas = [];
    for (var i = 0; i < parts.length; i++) {
      var list = lookupPronunciations(parts[i].toLowerCase());
      if (!list.length) return null;
      ipas.push(list[0]);
    }
    return ipas.join("-");
  }

  function makeToken(word, ipa, pronunciations, isPunct) {
    return {
      word: word,
      ipa: ipa == null ? null : ipa,
      pronunciations: pronunciations || null,
      isPunctuation: !!isPunct,
    };
  }

  function enrichToken(token) {
    var w = token.word;
    token.isNumber = isNumberToken(w);
    token.isListMarker = isListMarker(w);
    token.isStructuralNumber = isStructuralNumber(w);
    token.isNumberWithThousandsSeparator = isNumberWithThousandsSeparator(w);
    token.isTimeExpression = isTimeExpression(w);
    token.isAlphanumeric = isAlphanumericToken(w);
    token.isPercentage = isPercentageToken(w);
    token.isSpecialSymbolOrEmoji = isSpecialSymbolOrEmoji(w);
    token.hasMultiplePronunciations = !!(token.pronunciations && token.pronunciations.length > 1);
    token.isTrueOOV =
      !token.isNumber &&
      !token.isListMarker &&
      !token.isStructuralNumber &&
      !token.isNumberWithThousandsSeparator &&
      !token.isTimeExpression &&
      !token.isAlphanumeric &&
      !token.isPercentage &&
      !token.isSpecialSymbolOrEmoji &&
      !token.isPunctuation &&
      token.ipa == null &&
      w !== " " &&
      w !== "\n" &&
      !/^\s+$/.test(w);
    return token;
  }

  function format(text) {
    var words = tokenize(text);
    var tokens = [];
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var token;
      if (isPunctuation(word)) {
        token = makeToken(word, null, null, true);
      } else if (isNumberToken(word)) {
        token = makeToken(word, null, null, false);
      } else if (isListMarker(word)) {
        token = makeToken(word, null, null, false);
      } else if (isStructuralNumber(word)) {
        token = makeToken(word, null, null, false);
      } else if (isNumberWithThousandsSeparator(word)) {
        token = makeToken(word, null, null, false);
      } else if (isTimeExpression(word)) {
        token = makeToken(word, null, null, false);
      } else if (isAlphanumericToken(word)) {
        token = makeToken(word, null, null, false);
      } else if (isPercentageToken(word)) {
        token = makeToken(word, null, null, false);
      } else if (isNumericRangeWithEnDash(word)) {
        token = makeToken(word, null, null, false);
      } else if (word.endsWith(".") && ABBREVIATION_IPA[word.toLowerCase()]) {
        token = makeToken(word, ABBREVIATION_IPA[word.toLowerCase()], null, false);
      } else {
        var hyphenIPA = ipaForHyphenatedCompound(word);
        if (hyphenIPA) {
          token = makeToken(word, hyphenIPA, null, false);
        } else {
          var cleanWord = word.toLowerCase().replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "");
          var list = lookupPronunciations(cleanWord);
          if (list.length) {
            token = makeToken(word, list[0], list.length > 1 ? list : null, false);
          } else {
            var ipa = ipaForPossessive(cleanWord);
            if (ipa == null) ipa = ipaForAcronym(word);
            token = makeToken(word, ipa, null, false);
          }
        }
      }
      tokens.push(enrichToken(token));
    }
    return tokens;
  }

  function isLeadingSymbol(word) {
    return word.length === 1 && !!LEADING[word];
  }
  function isTrailingSymbol(word) {
    return word.length === 1 && !!TRAILING[word];
  }
  function isClosingQuote(word) {
    return word.length === 1 && !!CLOSING_QUOTE[word];
  }

  function shouldOmitSpaceBetweenCurrencyAndNumber(current, next) {
    if (!current || !next) return false;
    if (!CURRENCY[current.word]) return false;
    var w = next.word.trim();
    return w && isNumberChar(w[0]);
  }

  function addSpaceAfterWord(nextToken) {
    if (!nextToken) return true;
    if (nextToken.word === " " || /^\s+$/.test(nextToken.word)) return false;
    if (!nextToken.isPunctuation) return true;
    return !isTrailingSymbol(nextToken.word);
  }

  function addSpaceAfterWordForOriginalLine(currentToken, nextToken) {
    if (shouldOmitSpaceBetweenCurrencyAndNumber(currentToken, nextToken)) return false;
    if (nextToken && nextToken.word === "-") return false;
    return addSpaceAfterWord(nextToken);
  }

  function wrapIPA(ipa, left, right) {
    left = left == null ? "/" : left;
    right = right == null ? "/" : right;
    if (ipa) {
      if (!left && !right) return ipa;
      return left + ipa + right;
    }
    return "-";
  }

  /** Simplified sentence grouping: newlines and .!? (with decimal / in-word period guards). */
  function groupIntoSentences(tokens) {
    var paragraphs = [];
    var current = [];
    var i = 0;

    function flush() {
      if (current.length) {
        paragraphs.push(current);
        current = [];
      }
    }

    while (i < tokens.length) {
      var token = tokens[i];
      if (token.word === "\n" || token.word.indexOf("\n") !== -1) {
        flush();
        while (i < tokens.length && (tokens[i].word === "\n" || tokens[i].word.indexOf("\n") !== -1)) {
          i += 1;
        }
        continue;
      }
      if (token.isPunctuation && (token.word === "." || token.word === "!" || token.word === "?")) {
        var prev = current.length ? current[current.length - 1] : null;
        current.push(token);
        i += 1;
        if (token.word === ".") {
          var next = i < tokens.length ? tokens[i] : null;
          var prevEndsDigit = prev && /\d$/.test(prev.word.trim());
          var nextStartsDigit = next && /^\d/.test(next.word.trim());
          if (prevEndsDigit && nextStartsDigit) continue;
          var prevEndsAlnum = prev && /[A-Za-z0-9]$/.test(prev.word.trim());
          var nextStartsAlnum = next && /^[A-Za-z0-9]/.test(next.word.trim());
          if (prevEndsAlnum && nextStartsAlnum) continue;
        }
        while (i < tokens.length) {
          var n = tokens[i];
          if (n.word === "\n" || n.word.indexOf("\n") !== -1) break;
          if (n.word === " " || /^\s+$/.test(n.word) || isClosingQuote(n.word) || isTrailingSymbol(n.word)) {
            current.push(n);
            i += 1;
            continue;
          }
          break;
        }
        flush();
        continue;
      }
      current.push(token);
      i += 1;
    }
    flush();
    return paragraphs;
  }

  /**
   * Build by-sentence blocks for rendering.
   * @returns {{ originalParts: Array, ipaParts: Array }[]}
   */
  function buildSentenceBlocks(tokens, wrapLeft, wrapRight) {
    var left = wrapLeft == null ? "/" : wrapLeft;
    var right = wrapRight == null ? "/" : wrapRight;
    var paragraphs = groupIntoSentences(tokens);
    var blocks = [];

    for (var p = 0; p < paragraphs.length; p++) {
      var paragraph = paragraphs[p];
      var originalParts = [];
      var ipaParts = [];
      var needSpaceBeforeNextIPA = false;

      for (var localIndex = 0; localIndex < paragraph.length; localIndex++) {
        var token = paragraph[localIndex];
        if (token.word === "\n" || token.word.indexOf("\n") !== -1) continue;
        var nextToken = localIndex + 1 < paragraph.length ? paragraph[localIndex + 1] : null;
        var spaceAfterWord = addSpaceAfterWordForOriginalLine(token, nextToken);

        if (token.isPunctuation) {
          if (token.word === " " && !originalParts.length && !ipaParts.length) continue;
          var nextNext = localIndex + 2 < paragraph.length ? paragraph[localIndex + 2] : null;
          if (
            token.word === " " &&
            nextToken &&
            isClosingQuote(nextToken.word) &&
            (!nextNext || nextNext.isPunctuation)
          ) {
            continue;
          }
          originalParts.push({ text: token.word, multi: false, oov: false });
          var isOpeningQuote =
            isClosingQuote(token.word) && nextToken && !nextToken.isPunctuation;
          if (
            isLeadingSymbol(token.word) &&
            ipaParts.length &&
            !endsWithSpace(ipaParts) &&
            (isOpeningQuote || !isClosingQuote(token.word))
          ) {
            ipaParts.push({ text: " ", multi: false, oov: false });
          }
          if (token.word === " ") needSpaceBeforeNextIPA = false;
          ipaParts.push({ text: token.word, multi: false, oov: false });
          if (isLeadingSymbol(token.word)) needSpaceBeforeNextIPA = false;
          else if (isClosingQuote(token.word)) needSpaceBeforeNextIPA = true;
        } else {
          var origSuffix = spaceAfterWord ? " " : "";
          originalParts.push({
            text: token.word + origSuffix,
            multi: !!token.hasMultiplePronunciations,
            oov: false,
            pronunciations: token.pronunciations,
          });

          var skipIPA =
            token.isNumber ||
            token.isListMarker ||
            token.isStructuralNumber ||
            token.isNumberWithThousandsSeparator ||
            token.isTimeExpression ||
            token.isAlphanumeric ||
            token.isPercentage;

          if (skipIPA || token.isSpecialSymbolOrEmoji) {
            ipaParts.push({
              text: token.word + (spaceAfterWord ? " " : ""),
              multi: false,
              oov: false,
            });
          } else if (token.ipa != null) {
            if (needSpaceBeforeNextIPA && !endsWithSpace(ipaParts)) {
              ipaParts.push({ text: " ", multi: false, oov: false });
            }
            needSpaceBeforeNextIPA = false;
            ipaParts.push({
              text: wrapIPA(token.ipa, left, right) + (spaceAfterWord ? " " : ""),
              multi: false,
              oov: false,
            });
          } else {
            ipaParts.push({
              text: token.word + (spaceAfterWord ? " " : ""),
              multi: false,
              oov: true,
            });
          }
        }
      }

      if (originalParts.length || ipaParts.length) {
        blocks.push({ originalParts: originalParts, ipaParts: ipaParts });
      }
    }
    return blocks;
  }

  function endsWithSpace(parts) {
    if (!parts.length) return false;
    var t = parts[parts.length - 1].text;
    return t.endsWith(" ");
  }

  function blocksToPlainText(blocks) {
    var lines = [];
    for (var i = 0; i < blocks.length; i++) {
      var o = blocks[i].originalParts.map(function (p) { return p.text; }).join("");
      var ipa = blocks[i].ipaParts.map(function (p) { return p.text; }).join("");
      lines.push(o.replace(/\s+$/, ""));
      lines.push(ipa.replace(/\s+$/, ""));
      if (i < blocks.length - 1) lines.push("");
    }
    return lines.join("\n");
  }

  global.PhoneticEngine = {
    setDictionary: setDictionary,
    format: format,
    tokenize: tokenize,
    lookupPronunciations: lookupPronunciations,
    buildSentenceBlocks: buildSentenceBlocks,
    blocksToPlainText: blocksToPlainText,
    wrapIPA: wrapIPA,
    MAX_CHARS: 500,
  };
})(typeof window !== "undefined" ? window : self);
