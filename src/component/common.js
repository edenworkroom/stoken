import BigNumber from "bignumber.js";


export function showToken(token) {
    if (token.length > 10) {
        return token.slice(0, 8) + "..." + token.slice(-2)
    } else {
        return token
    }
}

export function showPrice(price) {
    if (price) {
        let ret = new BigNumber(price).dividedBy(new BigNumber(1e18)).toFixed(18);
        return trimNumber(ret, 18);
    } else {
        return "0.000";
    }
}

export function showValueP(val, decimal, decimalPlaces) {
    let num = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal));
    if (num.comparedTo(1000000000000000000) >= 0) {
        let text = num.toNumber().toString();
        let vals = text.split("+")
        text = trimNumber(vals[0], 3);
        if (vals.length > 1) {
            text = text + "..+" + vals[1];
        }
        return text;
    } else if (num.comparedTo(1000000) >= 0) {
        let text = num.dividedBy(1000000).toFixed(decimalPlaces);
        return trimNumber(text, decimalPlaces) + "M";
    } else if (num.comparedTo(1000) >= 0) {
        let text = num.dividedBy(1000).toFixed(decimalPlaces);
        return trimNumber(text, decimalPlaces) + "K";
    } else {
        return trimNumber(num.toFixed(decimalPlaces), decimalPlaces);
    }
}

export function showPK(pk, len) {
    if (!pk) {
        return "";
    }
    if (!len) {
        len = 8;
    }
    return pk.slice(0, len) + "..." + pk.slice(-len)
}

export function showValue(val, decimal, decimalPlaces) {
    let text = new BigNumber(val).dividedBy(new BigNumber(10).pow(decimal)).toFixed(decimalPlaces);
    return trimNumber(text, decimalPlaces)
}


export function tokenToBytes(token) {
    let bytes = Buffer.alloc(32);
    bytes.fill(token, 0, token.length);
    return "0x" + bytes.toString('hex');
}


export function trimNumber(numberStr, decimalPlaces) {
    let vals = numberStr.split(".")
    if (vals.length < 2) {
        return numberStr;
    } else {
        let index = -1;
        let decimal = vals[1];
        for (let i = decimal.length - 1; i >= 0; i--) {
            if (decimal.charAt(i) != '0') {
                index = i;
                break;
            }
        }
        decimal = decimal.substring(0, index + 1);
        let numStr = vals[0];
        if (decimal.length > decimalPlaces) {
            decimal = decimal.substring(0, decimalPlaces);
        }
        if (decimal.length > 0) {
            numStr += "." + decimal;
        }
        return numStr
    }
}

export function prettyFormat(obj) {
    try {
        // 设置缩进为2个空格
        let str = JSON.stringify(obj, null, 2);
        str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    } catch (e) {
        alert("异常信息:" + e);
    }
}
