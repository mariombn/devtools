export type Translations = {
  nav: {
    jsonToolkit: string
    validators: string
    dataGenerator: string
    textComparator: string
    bcryptGenerator: string
    cryptoToolkit: string
    markdownPreview: string
    sqlTools: string
    dateTimeTools: string
    regexTools: string
    githubRepository: string
  }
  topbar: {
    openMenu: string
    expandSidebar: string
    collapseSidebar: string
    lightMode: string
    darkMode: string
    switchToPortuguese: string
    switchToEnglish: string
  }
  common: {
    copy: string
    copied: string
    nothingToCopy: string
    clear: string
    close: string
    input: string
    output: string
    generate: string
    formatted: string
    error: string
  }
  json: {
    title: string
    description: string
    validate: string
    prettify: string
    minify: string
    placeholder: string
    validJson: string
    invalidJson: string
    cannotPrettify: string
    cannotMinify: string
  }
  validators: {
    title: string
    description: string
    cpfTitle: string
    cpfDesc: string
    cpfPlaceholder: string
    cnpjTitle: string
    cnpjDesc: string
    cnpjPlaceholder: string
    emailTitle: string
    emailDesc: string
    emailPlaceholder: string
    creditCardTitle: string
    creditCardDesc: string
    creditCardPlaceholder: string
  }
  generator: {
    title: string
    description: string
    generateAll: string
    formatted: string
    mobile: string
    ddd: string
    format: string
    paragraphs: string
    sentences: string
    words: string
  }
  diff: {
    title: string
    description: string
    originalText: string
    modifiedText: string
    original: string
    modified: string
    split: string
    unified: string
    comparisonResult: string
    originalPlaceholder: string
    modifiedPlaceholder: string
  }
  bcrypt: {
    title: string
    description: string
    generateHash: string
    generateHashDesc: string
    verifyHash: string
    verifyHashDesc: string
    textToHash: string
    textPlaceholder: string
    roundsLabel: string
    generating: string
    verifying: string
    generatedHash: string
    bcryptHash: string
    hashPlaceholder: string
    originalText: string
    originalPlaceholder: string
    hashMatches: string
    hashNoMatch: string
    faq: string
    faqQ1: string
    faqA1: string
    faqQ2: string
    faqA2: string
    faqQ3: string
    faqA3: string
    faqQ4: string
    faqA4: string
    roundsLow: string
    roundsMedium: string
    roundsHigh: string
    roundsVeryHigh: string
  }
  crypto: {
    title: string
    description: string
    algorithms: string
    secretKey: string
    secretKeyPlaceholder: string
    secretKeyHint: string
    inputLabel: string
    inputPlaceholderBidirectional: string
    inputPlaceholderHash: string
    encrypt: string
    decrypt: string
    encode: string
    decode: string
    generateHash: string
    reversible: string
    oneWay: string
    useAsInput: string
    copy: string
    copied: string
    encryptedOutput: string
    decryptedOutput: string
    encodedOutput: string
    decodedOutput: string
    hashOutput: string
    securityNotice: string
    securityNoticeText: string
    categoryEncoding: string
    categoryHash: string
    categorySymmetric: string
    algoBase64Desc: string
    algoMd5Desc: string
    algoSha1Desc: string
    algoSha256Desc: string
    algoSha384Desc: string
    algoSha512Desc: string
    algoSha3Desc: string
    algoAesDesc: string
    algoDesDesc: string
    algoTripleDesDesc: string
    algoRabbitDesc: string
    algoRc4Desc: string
    errorEmpty: string
    errorUnknown: string
  }
  dates: {
    title: string
    description: string
    tabTimestamp: string
    tabDifference: string
    tabIso: string
    tabTimezone: string
    tabPeriods: string
    unixToDate: string
    unixToDateDesc: string
    enterTimestamp: string
    currentTime: string
    isoLabel: string
    utcTime: string
    localTime: string
    dateToUnix: string
    dateToUnixDesc: string
    selectDateTime: string
    unixTimestampSeconds: string
    invalidOrOutOfRange: string
    dateDifference: string
    dateDifferenceDesc: string
    startDateTime: string
    endDateTime: string
    results: string
    differenceBreakdown: string
    detailedDifference: string
    totalDays: string
    totalDaysLabel: string
    identical: string
    years: string
    months: string
    days: string
    hours: string
    invalidDateFormat: string
    isoValidator: string
    isoValidatorDesc: string
    dateString: string
    validIso: string
    invalidIso: string
    typeToValidate: string
    commonFormats: string
    commonFormatsDesc: string
    humanReadable: string
    unixTimestamp: string
    timezoneConverter: string
    timezoneConverterDesc: string
    dateTime: string
    fromTimezone: string
    toTimezone: string
    resultLabel: string
    resultDesc: string
    formattedDate: string
    iso8601Repr: string
    invalidConversion: string
    dateMath: string
    dateMathDesc: string
    baseDate: string
    operation: string
    add: string
    subtract: string
    amount: string
    unit: string
    unitDays: string
    unitWeeks: string
    unitMonths: string
    businessDaysOnly: string
    result: string
    shiftedDate: string
    humanReadableLabel: string
    iso8601String: string
    invalidBaseDate: string
  }
  regex: {
    title: string
    description: string
    pattern: string
    testString: string
    testStringPlaceholder: string
    patternPlaceholder: string
    commonPatterns: string
    matchResults: string
    matches: string
    matchesPlural: string
    highlightedMatches: string
    matchDetails: string
    match: string
    groups: string
    namedGroups: string
    emptyState: string
    emptyStateHint: string
  }
  sql: {
    title: string
    description: string
    inputTitle: string
    format: string
    placeholder: string
    errorFormatting: string
    formattedTitle: string
    emptyStateTitle: string
    emptyStateHint: string
  }
  markdown: {
    title: string
    description: string
    editorTitle: string
    previewTitle: string
    placeholder: string
  }
}

export const en: Translations = {
  nav: {
    jsonToolkit: 'JSON Toolkit',
    validators: 'Validators',
    dataGenerator: 'Data Generator',
    textComparator: 'Text Comparator',
    bcryptGenerator: 'Bcrypt Generator',
    cryptoToolkit: 'Crypto Toolkit',
    markdownPreview: 'Markdown Preview',
    sqlTools: 'SQL Tools',
    dateTimeTools: 'Date & Time Tools',
    regexTools: 'Regex Tools',
    githubRepository: 'GitHub Repository',
  },
  topbar: {
    openMenu: 'Open menu',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    switchToPortuguese: 'Switch to Portuguese',
    switchToEnglish: 'Switch to English',
  },
  common: {
    copy: 'Copy to clipboard',
    copied: 'Copied!',
    nothingToCopy: 'Nothing to copy',
    clear: 'Clear',
    close: 'Close',
    input: 'Input',
    output: 'Output',
    generate: 'Generate',
    formatted: 'Formatted',
    error: 'Error',
  },
  json: {
    title: 'JSON Toolkit',
    description: 'Validate, format, and minify JSON with a single click.',
    validate: 'Validate',
    prettify: 'Prettify',
    minify: 'Minify',
    placeholder: 'Paste or type JSON here... e.g., {"name": "John", "age": 30}',
    validJson: '✓ Valid JSON',
    invalidJson: 'Invalid JSON',
    cannotPrettify: 'Invalid JSON - cannot prettify',
    cannotMinify: 'Invalid JSON - cannot minify',
  },
  validators: {
    title: 'Data Validators',
    description: 'Quickly validate common formats and documents like CPF, CNPJ, Email, and Credit Cards.',
    cpfTitle: 'CPF Validator',
    cpfDesc: 'Assesses format and mathematically verifies CPF check digits.',
    cpfPlaceholder: '000.000.000-00 or numbers only',
    cnpjTitle: 'CNPJ Validator',
    cnpjDesc: 'Assesses format and mathematically verifies CNPJ check digits.',
    cnpjPlaceholder: '00.000.000/0000-00 or numbers only',
    emailTitle: 'Email Validator',
    emailDesc: 'Checks if the email string adheres to common email string layout.',
    emailPlaceholder: 'example@domain.com',
    creditCardTitle: 'Credit Card Validator',
    creditCardDesc: 'Verifies credit card using the Luhn algorithm (modulus 10).',
    creditCardPlaceholder: '0000 0000 0000 0000',
  },
  generator: {
    title: 'Data Generator',
    description: 'Generate CPF, CNPJ, phone, CEP, names, emails, and passwords.',
    generateAll: 'Generate All',
    formatted: 'Formatted',
    mobile: 'Mobile',
    ddd: 'DDD',
    format: 'Format',
    paragraphs: 'Paragraphs',
    sentences: 'Sentences',
    words: 'Words',
  },
  diff: {
    title: 'Text Comparator',
    description: 'Compare two texts and see line-by-line differences.',
    originalText: 'Original Text',
    modifiedText: 'Modified Text',
    original: 'Original',
    modified: 'Modified',
    split: 'Split',
    unified: 'Unified',
    comparisonResult: 'Comparison Result',
    originalPlaceholder: 'Enter original text here...',
    modifiedPlaceholder: 'Enter modified text here...',
  },
  bcrypt: {
    title: 'Bcrypt Hash Generator',
    description: 'Generate and verify bcrypt hashes. All processing happens in your browser for security.',
    generateHash: 'Generate Hash',
    generateHashDesc: 'Generate a bcrypt hash from your text. Higher rounds provide better security but take longer to process.',
    verifyHash: 'Verify Hash',
    verifyHashDesc: 'Check if a bcrypt hash matches the original text.',
    textToHash: 'Text to Hash',
    textPlaceholder: 'Enter text to hash...',
    roundsLabel: 'Rounds (Cost Factor): {rounds}',
    generating: 'Generating...',
    verifying: 'Verifying...',
    generatedHash: 'Generated Hash',
    bcryptHash: 'Bcrypt Hash',
    hashPlaceholder: 'Enter bcrypt hash to verify...',
    originalText: 'Original Text',
    originalPlaceholder: 'Enter original text...',
    hashMatches: '✓ Hash matches the original text!',
    hashNoMatch: '✗ Hash does not match the original text',
    faq: 'FAQ',
    faqQ1: 'What is bcrypt?',
    faqA1: "Bcrypt is a password hashing function designed to be computationally intensive. It's commonly used for securely storing passwords in databases.",
    faqQ2: 'How many rounds should I use?',
    faqA2: '12 rounds is the recommended minimum for production use. More rounds increase security but also processing time. Choose based on your security requirements.',
    faqQ3: 'Is this tool secure?',
    faqA3: 'All processing happens in your browser using the bcryptjs library. No data is sent to any servers or stored anywhere.',
    faqQ4: 'Can I use this in production?',
    faqA4: 'This tool is primarily for testing and learning. For production use, implement bcrypt directly in your application using a trusted library.',
    roundsLow: 'Low security - for testing only',
    roundsMedium: 'Medium security',
    roundsHigh: 'High security - suitable for production',
    roundsVeryHigh: 'Very high security - slow processing',
  },
  crypto: {
    title: 'Crypto Toolkit',
    description: 'Encrypt, decrypt, hash and encode values using the most popular cryptographic algorithms. All processing runs entirely in your browser.',
    algorithms: 'Algorithms',
    secretKey: 'Secret Key / Passphrase',
    secretKeyPlaceholder: 'Enter your secret key...',
    secretKeyHint: 'Use a strong, unique key. The same key must be used for both encryption and decryption.',
    inputLabel: 'Input',
    inputPlaceholderBidirectional: 'Enter text to encrypt or ciphertext to decrypt...',
    inputPlaceholderHash: 'Enter text to hash...',
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
    encode: 'Encode',
    decode: 'Decode',
    generateHash: 'Generate Hash',
    reversible: 'Reversible',
    oneWay: 'One-Way',
    useAsInput: 'Use as Input',
    copy: 'Copy',
    copied: 'Copied!',
    encryptedOutput: 'Encrypted Output',
    decryptedOutput: 'Decrypted Output',
    encodedOutput: 'Encoded Output',
    decodedOutput: 'Decoded Output',
    hashOutput: 'Hash Output',
    securityNotice: 'Security Notice',
    securityNoticeText: 'All operations run entirely in your browser — no data is ever transmitted to any server. Hash functions (MD5, SHA) are one-way and cannot be reversed. For production applications, prefer AES-256 for symmetric encryption and SHA-256 or SHA-3 for hashing.',
    categoryEncoding: 'Encoding',
    categoryHash: 'Hash Functions',
    categorySymmetric: 'Symmetric Encryption',
    algoBase64Desc: 'Encode/decode binary data as ASCII text. Not encryption — encoding only.',
    algoMd5Desc: 'Produces a 128-bit hash. Deprecated for security — use SHA-256 or higher.',
    algoSha1Desc: 'Produces a 160-bit hash. Deprecated for cryptographic use.',
    algoSha256Desc: 'Part of SHA-2 family. Widely used for integrity verification and digital signatures.',
    algoSha384Desc: 'Stronger SHA-2 variant with a 384-bit output.',
    algoSha512Desc: 'Strongest SHA-2 variant providing 512-bit output.',
    algoSha3Desc: 'SHA-3 (Keccak) is the latest NIST hash standard, resistant to length-extension attacks.',
    algoAesDesc: 'Advanced Encryption Standard — the current gold standard for symmetric encryption.',
    algoDesDesc: 'Data Encryption Standard — legacy cipher, 56-bit key. Do NOT use in production.',
    algoTripleDesDesc: 'Applies DES three times. More secure than DES but slower; superseded by AES.',
    algoRabbitDesc: 'Fast stream cipher with 128-bit key. High performance for large data.',
    algoRc4Desc: 'Stream cipher — fast and simple but cryptographically broken. Avoid in production.',
    errorEmpty: 'Empty result — check your input and key.',
    errorUnknown: 'An error occurred. Check your input and key.',
  },
  dates: {
    title: 'Date & Time Tools',
    description: 'Utilities for conversions, validation, operations, and timezone mathematics.',
    tabTimestamp: 'Timestamp',
    tabDifference: 'Difference',
    tabIso: 'ISO 8601',
    tabTimezone: 'Timezones',
    tabPeriods: 'Add/Subtract',
    unixToDate: 'Unix Timestamp to Date',
    unixToDateDesc: 'Convert seconds or milliseconds to human-readable dates',
    enterTimestamp: 'Enter Timestamp',
    currentTime: 'Current Time',
    isoLabel: 'ISO 8601',
    utcTime: 'UTC Time',
    localTime: 'Local Time',
    dateToUnix: 'Date to Unix Timestamp',
    dateToUnixDesc: 'Convert a calendar date back to a timestamp',
    selectDateTime: 'Select Date & Time',
    unixTimestampSeconds: 'Unix Timestamp (Seconds)',
    invalidOrOutOfRange: 'Invalid or out of range',
    dateDifference: 'Date Difference',
    dateDifferenceDesc: 'Calculate the exact distance between two dates',
    startDateTime: 'Start Date & Time',
    endDateTime: 'End Date & Time',
    results: 'Results',
    differenceBreakdown: 'Difference breakdown',
    detailedDifference: 'Detailed Difference',
    totalDays: 'Total Days',
    totalDaysLabel: 'Total: {n} days',
    identical: 'Identical',
    years: 'Years',
    months: 'Months',
    days: 'Days',
    hours: 'Hours',
    invalidDateFormat: 'Invalid date format',
    isoValidator: 'ISO 8601 Validator',
    isoValidatorDesc: 'Validate ISO or RFC 3339 datetime strings instantly',
    dateString: 'Date String',
    validIso: 'Valid ISO 8601 Formatted String',
    invalidIso: 'Invalid ISO string format',
    typeToValidate: 'Type a string to validate',
    commonFormats: 'Common Formats',
    commonFormatsDesc: 'The validated date formatted in standard patterns (Local Time)',
    humanReadable: 'Human Readable',
    unixTimestamp: 'Unix Timestamp',
    timezoneConverter: 'Timezone Converter',
    timezoneConverterDesc: 'Convert time instantly between different global regions',
    dateTime: 'Date & Time',
    fromTimezone: 'From Timezone',
    toTimezone: 'To Timezone',
    resultLabel: 'Result ({tz})',
    resultDesc: 'The converted exact time in the destination timezone',
    formattedDate: 'Formatted Date',
    iso8601Repr: 'ISO 8601 representation',
    invalidConversion: 'Invalid conversion',
    dateMath: 'Date Mathematics',
    dateMathDesc: 'Add or subtract time periods securely',
    baseDate: 'Base Date',
    operation: 'Operation',
    add: 'Add',
    subtract: 'Sub',
    amount: 'Amount',
    unit: 'Unit',
    unitDays: 'Days',
    unitWeeks: 'Weeks',
    unitMonths: 'Months',
    businessDaysOnly: 'Business Days Only (Skip weekends)',
    result: 'Result',
    shiftedDate: 'Shifted date calculation',
    humanReadableLabel: 'Human Readable',
    iso8601String: 'ISO 8601 String',
    invalidBaseDate: 'Invalid base date',
  },
  regex: {
    title: 'Regex Tools',
    description: 'Test and validate regular expressions with real-time match highlighting.',
    pattern: 'Pattern',
    testString: 'Test String',
    testStringPlaceholder: 'Enter text to test against the pattern...',
    patternPlaceholder: 'Enter regex pattern...',
    commonPatterns: 'Common Patterns',
    matchResults: 'Match Results',
    matches: 'match',
    matchesPlural: 'matches',
    highlightedMatches: 'Highlighted Matches',
    matchDetails: 'Match Details',
    match: 'Match',
    groups: 'Groups:',
    namedGroups: 'Named Groups:',
    emptyState: 'Enter a pattern and test string',
    emptyStateHint: 'Matches will be highlighted in real time',
  },
  sql: {
    title: 'SQL Tools',
    description: 'Format and beautify SQL queries with proper indentation and syntax.',
    inputTitle: 'SQL Input',
    format: 'Format',
    placeholder: 'Paste your SQL here to format...',
    errorFormatting: 'Error formatting SQL',
    formattedTitle: 'Formatted SQL',
    emptyStateTitle: 'Paste your SQL and click "Format"',
    emptyStateHint: 'The formatted output will appear here',
  },
  markdown: {
    title: 'Markdown Preview',
    description: 'Write Markdown and see it rendered in real time.',
    editorTitle: 'Editor',
    previewTitle: 'Preview',
    placeholder: 'Type your markdown here...',
  },
}
