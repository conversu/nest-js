var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/transformers/index.ts
var transformers_exports = {};
__export(transformers_exports, {
  Attribute: () => attribute_exports,
  Column: () => column_exports
});

// src/transformers/attribute/index.ts
var attribute_exports = {};
__export(attribute_exports, {
  TransformDate: () => TransformDate,
  TransformEmail: () => TransformEmail,
  TransformJson: () => TransformJson,
  TransformObject: () => TransformObject,
  TransformPhone: () => TransformPhone
});

// src/transformers/attribute/date.transformer.ts
import { Transform } from "class-transformer";
import { format } from "date-fns";
function TransformDate(pattern) {
  return Transform(({ value }) => {
    if (typeof value === "number" || typeof value === "object") {
      return format(value, pattern);
    }
    return value;
  });
}

// src/transformers/attribute/email.transformer.ts
import { Transform as Transform2 } from "class-transformer";
function TransformEmail(_type) {
  return Transform2(({ value }) => {
    const [username, domain] = value.split("@");
    const cut = Math.floor(username.length / 4);
    let email = value.slice(0, cut);
    email += "*".repeat(cut * 2);
    email += username.slice(-cut);
    email += `@${domain}`;
    return email;
  });
}

// src/transformers/attribute/json.transformer.ts
import { Transform as Transform3 } from "class-transformer";
function TransformJson(serialize, property) {
  return Transform3(({ value }) => {
    if (typeof value === "string") {
      let result = JSON.parse(value);
      if (property) {
        result = result[property];
      }
      if (serialize) {
        return new serialize(result);
      }
      return result;
    }
    return value;
  });
}

// src/transformers/attribute/obj.transformer.ts
import { Transform as Transform4 } from "class-transformer";
function TransformObject(keys) {
  return Transform4(({ value }) => {
    const newObj = {};
    for (const key of keys) {
      Object.assign(newObj, {
        key: value[key]
      });
    }
    return newObj;
  });
}

// src/transformers/attribute/phone.transformer.ts
import { Transform as Transform5 } from "class-transformer";

// src/utils/format.ts
function formatPhone(value) {
  if (!!value && value.length === 13) {
    return `+${value.substring(0, 2)} (${value.substring(2, 4)}) ${value.substring(4, 9)}-${value.substring(9, value.length)}`;
  }
  return value;
}

// src/utils/mask.ts
function maskPhone(value) {
  if (value) {
    let phone = formatPhone(value);
    phone = phone.includes("-") ? phone : `${phone.slice(0, phone.length - 4)}-${phone.slice(phone.length - 4, phone.length)}`;
    const [part1, part2] = phone.split("-");
    let result = part1.slice(0, 12);
    result += "**-**";
    result += part2.slice(2, 4);
    return result;
  }
  return value;
}

// src/transformers/attribute/phone.transformer.ts
function TransformPhone(type) {
  return Transform5(({ value }) => {
    if (!value) {
      return null;
    }
    if (type === "MASK") {
      return maskPhone(value);
    }
    return formatPhone(value);
  });
}

// src/transformers/column/index.ts
var column_exports = {};
__export(column_exports, {
  CryptographerTransformer: () => CryptographerTransformer,
  DecimalTransformer: () => DecimalTransformer,
  JsonTransformer: () => JsonTransformer,
  LargeJsonTransformer: () => LargeJsonTransformer,
  LargeStringTransformer: () => LargeStringTransformer,
  NumberTransformer: () => NumberTransformer
});

// src/transformers/column/cryptographer.transformer.ts
import { decrypt as decrypt2 } from "dotenv";

// src/utils/aes.ts
import CryptoJS from "crypto-js";
function encrypt(secret, value) {
  if (value) {
    return CryptoJS.AES.encrypt(value, secret).toString();
  }
  return null;
}
function decrypt(secret, value) {
  if (value) {
    return CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8);
  }
  return null;
}
function encode(value) {
  return String(Buffer.from(value).toString("base64"));
}
function decode(value) {
  return Buffer.from(value, "base64").toString("utf-8");
}

// src/transformers/column/cryptographer.transformer.ts
var CryptographerTransformer = class {
  constructor(secret) {
    this.secret = secret;
  }
  to(data) {
    return encrypt(this.secret, data);
  }
  from(data) {
    return decrypt2(this.secret, data);
  }
};

// src/transformers/column/json.transformer.ts
import CryptoJS2 from "crypto-js";
var JsonTransformer = class {
  constructor(secret, encrypt2) {
    this.secret = secret;
    this.encrypt = encrypt2;
  }
  to(data) {
    try {
      let result = "transformation_error";
      if (typeof data === "string") {
        result = data;
      } else {
        result = JSON.stringify(data);
      }
      if (this.encrypt) {
        result = CryptoJS2.AES.encrypt(result, this.secret).toString();
      }
      return result;
    } catch (err) {
      return "transformation_error";
    }
  }
  from(data) {
    if (data === "transformation_error") {
      return null;
    }
    try {
      if (this.encrypt) {
        return JSON.parse(CryptoJS2.AES.decrypt(data, this.secret).toString(CryptoJS2.enc.Utf8));
      }
      return JSON.parse(data);
    } catch (err) {
      return data;
    }
  }
};

// src/transformers/column/number.transformer.ts
var NumberTransformer = class {
  to(data) {
    return data;
  }
  from(data) {
    return parseInt(data);
  }
};

// src/transformers/column/decimal.transformer.ts
var DecimalTransformer = class {
  to(data) {
    return data;
  }
  from(data) {
    if (!data) {
      return null;
    }
    return Number(String(data));
  }
};

// src/transformers/column/large-json.transformer.ts
import CryptoJS3 from "crypto-js";
var LargeJsonTransformer = class {
  constructor(secret, encrypt2) {
    this.encrypt = encrypt2;
    this.secret = secret;
  }
  to(data) {
    try {
      let result = "transformation_error";
      if (typeof data === "string") {
        result = data;
      } else {
        result = JSON.stringify(data);
      }
      if (this.encrypt) {
        result = CryptoJS3.AES.encrypt(result, this.secret).toString();
      }
      return Buffer.from(result, "utf-8");
    } catch (err) {
      return Buffer.from("transformation_error");
    }
  }
  from(data) {
    const content = data.toString("utf-8");
    if (content === "transformation_error") {
      return null;
    }
    try {
      let result = content;
      if (this.encrypt) {
        result = CryptoJS3.AES.decrypt(content, this.secret).toString(CryptoJS3.enc.Utf8);
      }
      return result ? JSON.parse(result) : null;
    } catch (err) {
      return content;
    }
  }
};

// src/transformers/column/large-string.transformer.ts
import CryptoJS4 from "crypto-js";
var LargeStringTransformer = class {
  constructor(secret, encrypt2) {
    this.secret = secret;
    this.encrypt = encrypt2;
  }
  to(data) {
    if (!data) {
      return null;
    }
    try {
      let result = data;
      if (this.encrypt) {
        result = CryptoJS4.AES.encrypt(result, this.secret).toString();
      }
      return Buffer.from(result, "utf-8");
    } catch (err) {
      return null;
    }
  }
  from(data) {
    if (!data) {
      return null;
    }
    let result = data.toString("utf-8");
    try {
      if (this.encrypt) {
        result = CryptoJS4.AES.decrypt(result, this.secret).toString(CryptoJS4.enc.Utf8);
      }
      return result;
    } catch (err) {
      return null;
    }
  }
};

// src/typeorm/index.ts
var typeorm_exports = {};
__export(typeorm_exports, {
  getDataSource: () => getDataSource
});

// src/typeorm/datasource/index.ts
import { DataSource } from "typeorm";
var getDataSource = (options) => {
  const dataSource = new DataSource(options);
  dataSource.initialize();
  return dataSource;
};

// src/interceptors/index.ts
var interceptors_exports = {};
__export(interceptors_exports, {
  Serialize: () => Serialize,
  SerializeInterceptor: () => SerializeInterceptor
});

// src/interceptors/serialize.interceptor.ts
import { UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map } from "rxjs";
function Serialize(dto) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
var SerializeInterceptor = class {
  // dto is the variable. so you can use this class for different entities
  constructor(dto) {
    this.dto = dto;
  }
  intercept(context, handler) {
    return handler.handle().pipe(
      // data is the incoming user entity
      map((data) => {
        return plainToInstance(this.dto, data, {
          //   this takes care of everything. this will expose things that are set in the UserDto
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        });
      })
    );
  }
};

// src/validators/index.ts
var validators_exports = {};
__export(validators_exports, {
  IsCnpj: () => IsCnpj,
  IsConversuEmail: () => IsConversuEmail,
  IsCpf: () => IsCpf,
  IsDeterminedString: () => IsDeterminedString
});

// src/validators/is-cnpj.validator.ts
import { registerDecorator } from "class-validator";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
function IsCnpj(validationOptions) {
  return function(object, propertyName) {
    registerDecorator({
      name: "IsCnpj",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value, _args) {
          return cnpjValidator.isValid(value);
        },
        defaultMessage(_args) {
          return `Invalid CNPJ. Must have 14 numeric characters.`;
        }
      }
    });
  };
}

// src/validators/is-cpf.validator.ts
import { registerDecorator as registerDecorator2 } from "class-validator";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
function IsCpf(validationOptions) {
  return function(object, propertyName) {
    registerDecorator2({
      name: "IsCpf",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value, _args) {
          return cpfValidator.isValid(value);
        },
        defaultMessage(_args) {
          return `Invalid CPF. Must have 11 numeric characters.`;
        }
      }
    });
  };
}

// src/validators/is-conversu-email.validator.ts
import { registerDecorator as registerDecorator3, isEmail } from "class-validator";
function IsConversuEmail(validationOptions) {
  return function(object, propertyName) {
    registerDecorator3({
      name: "IsConversuEmail",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value, _args) {
          return isEmail(value) && value.toLowerCase().endsWith(process.env.CONVERSU_EMAIL_DOMAIN);
        },
        defaultMessage(_args) {
          return `Must be an institutional email.`;
        }
      }
    });
  };
}

// src/validators/is-determinated-string.validator.ts
import { registerDecorator as registerDecorator4 } from "class-validator";
function IsDeterminedString(allowedValues, validationOptions) {
  return function(object, propertyName) {
    registerDecorator4({
      name: "IsDeterminedString",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value, _args) {
          if (!allowedValues.includes(value)) {
            return false;
          }
          return true;
        },
        defaultMessage(args) {
          return `${args.property} must be one of: ${allowedValues.join(", ")}`;
        }
      }
    });
  };
}

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  SAFETY_JSON: () => SAFETY_JSON,
  decode: () => decode,
  decrypt: () => decrypt,
  encode: () => encode,
  encrypt: () => encrypt,
  escapeRegExp: () => escapeRegExp,
  estimateContentSize: () => estimateContentSize,
  extractTypeValues: () => extractTypeValues,
  findDuplicates: () => findDuplicates,
  generateUUID: () => generateUUID,
  getBytes: () => getBytes,
  getMimeType: () => getMimeType,
  hasDuplicates: () => hasDuplicates,
  hasUniqueKeys: () => hasUniqueKeys,
  isBase64: () => isBase64,
  normalizeText: () => normalizeText,
  normalizeTextNumber: () => normalizeTextNumber
});

// node_modules/uuid/dist/esm-node/rng.js
import crypto from "crypto";
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/uuid/dist/esm-node/native.js
import crypto2 from "crypto";
var native_default = {
  randomUUID: crypto2.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/utils/functions.ts
function generateUUID(identifier, isSuffix) {
  if (!!isSuffix && isSuffix) {
    return `${v4_default()}-${identifier.toLowerCase()}`;
  }
  return `${identifier.toLowerCase()}-${v4_default()}`;
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isBase64(str) {
  const base64Regex = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/;
  return base64Regex.test(str);
}
function estimateContentSize(value) {
  if (!value) {
    return null;
  }
  let decodedData;
  try {
    decodedData = Buffer.from(value, "base64");
  } catch (error) {
    decodedData = Buffer.from(value);
  }
  const byteSize = decodedData.length;
  return byteSize != null ? byteSize : 0;
}
function hasUniqueKeys(obj) {
  const keysSet = new Set(Object.keys(obj));
  return keysSet.size === Object.keys(obj).length;
}
function hasDuplicates(arr) {
  const valueSet = new Set(arr);
  return valueSet.size !== arr.length;
}
function findDuplicates(arr) {
  const seen = /* @__PURE__ */ new Set();
  const duplicates = /* @__PURE__ */ new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }
  return Array.from(duplicates);
}
function extractTypeValues(type) {
  if (type && type.name === "String") {
    return Object.values(type);
  }
  throw new Error(`Invalid type provided: ${type}`);
}
function getMimeType(value) {
  if (value.includes("base64")) {
    const [type, _base64str] = value.split(";");
    return type.split(":")[1];
  }
  return "text/plain";
}
function getBytes(value) {
  if (value.includes("base64")) {
    const [_type, base64str] = value.split(";");
    try {
      return Buffer.from(base64str, "base64");
    } catch (err) {
      return null;
    }
  }
  return Buffer.from(value, "utf-8");
}

// src/utils/json.ts
function safetyParse(obj) {
  if (!obj) {
    return null;
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (err) {
      return null;
    }
  }
  if (typeof obj === "object") {
    return obj;
  }
  return null;
}
function safetyStringify(obj) {
  if (!obj) {
    return null;
  }
  if (typeof obj === "string") {
    return obj;
  }
  if (typeof obj === "object") {
    try {
      return JSON.stringify(obj);
    } catch (err) {
      return null;
    }
  }
  return null;
}
function safetyUpdate(obj, data) {
  let current = obj;
  if (!data) {
    return current;
  }
  if (!obj) {
    current = {};
  }
  if (typeof obj === "string") {
    try {
      current = JSON.parse(obj);
    } catch (err) {
      return obj;
    }
  }
  current = Object.assign(current, data);
  return current;
}
function safetyRemove(obj, key) {
  let metadata = safetyParse(obj);
  if (!metadata) {
    return metadata;
  }
  Object.keys(metadata).filter((key2) => key2 !== "waitingFor").forEach((key2) => {
    metadata[key2] = metadata[key2];
  });
  return metadata;
}
var SAFETY_JSON = {
  parse: safetyParse,
  stringify: safetyStringify,
  update: safetyUpdate,
  remove: safetyRemove
};

// src/utils/normalize.ts
function normalizeTextNumber(value) {
  if (!value) {
    return null;
  }
  const result = value.trim();
  return result.replace(" ", "").replace(/\D/g, "");
}
function normalizeText(value, params) {
  let result = value;
  if (value) {
    result = result.trim().replace("\n", "");
    result = result.replace(/\n/g, "");
    if (params.toUpperCase) {
      result = result.toUpperCase();
    }
    if (params.replaceSpace) {
      result = result.replace(/ /g, "_");
    }
    if (params.replaceSpecialChars) {
      for (const char of params.replaceSpecialChars) {
        if (value.includes(char)) {
          const regex = new RegExp(escapeRegExp(char), "g");
          result = result.replace(regex, "");
        }
      }
    }
  }
  return result;
}
export {
  interceptors_exports as Interceptors,
  transformers_exports as Transformers,
  typeorm_exports as Typeorm,
  utils_exports as Utils,
  validators_exports as Validators
};
//# sourceMappingURL=index.mjs.map