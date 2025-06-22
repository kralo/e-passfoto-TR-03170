const basic_set = ["*", "*", "*", " ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

function c40t_Idx(idx: number): string {
    return basic_set[idx];
}

function c40t_ASC(str: string): number {
    for (let i = 0; i < basic_set.length; i++)
        if (basic_set[i] === str) {
            return i;
        }
    return 0;
}

const c40enc = (str: string): string => { // does not fully work yet
    let ret = "0x";

    for (let i = 0; i < str.length; i = i + 3) {
        const triplet = str.substring(i, i + 3);
        const c40vals = [0, 0, 0];

        for (let y = 0; y < 3; y++) {
            c40vals[y] = c40t_ASC(triplet.substring(y, y + 1));
        }

        const U = 1600 * c40vals[0] + 40 * c40vals[1] + c40vals[2] + 1;

        const byte1 = Math.floor(U / 256);
        const byte2 = U % 256;
        ret = ret + byte1.toString(16) + byte2.toString(16);
    }
    return ret;
}

const c40dec = (bytes: Uint8Array) => {
    let ret = "";
    let shift = 0;
    for (let i = 0; i < bytes.length; i = i + 2) {
        if (bytes[i] == 254) {
            // unlatch codeword, following is ascii
            ret = ret + String.fromCharCode(bytes[i + 1] - 1); // -1 Datamatrix <-> Ascii sic!
        } else {
            const V16 = bytes[i] * 256 + bytes[i + 1];
            const U = [0, 0, 0];
            U[0] = Math.floor((V16 - 1) / 1600);
            U[1] = Math.floor((V16 - U[0] * 1600 - 1) / 40);
            U[2] = V16 - U[0] * 1600 - U[1] * 40 - 1;
            //console.log("V16 " + V16 + " = 256*"+bytes[i]+" + " + bytes[i+1] )
            for (let ui = 0; ui < 3; ui++) {
                const v = U[ui];
                switch (shift) {
                    case 0:
                        if (v < 3)
                            shift = v + 1;
                        else
                            ret = ret + c40t_Idx(v);
                        break;
                    case 2:
                        ret = ret + String.fromCharCode(v + 33);
                        shift = 0;
                        break;
                    case 3:
                        ret = ret + String.fromCharCode(v + 96);
                        shift = 0;
                }
            }
        }
    }
    return ret;
};

const hexToByte = (hex: string): Uint8Array => {
    hex = hex.replaceAll(" ", "").toLowerCase();
    const key = "0123456789abcdef";
    let newBytes = [];
    let currentChar = 0;
    let currentByte = 0;
    for (let i = 0; i < hex.length; i++) {
        // Go over two 4-bit hex chars to convert into one 8-bit byte
        currentChar = key.indexOf(hex[i]);
        if (i % 2 === 0) {
            // First hex char
            currentByte = currentChar << 4; // Get 4-bits from first hex char
        }
        if (i % 2 === 1) {
            // Second hex char
            currentByte += currentChar; // Concat 4-bits from second hex char
            newBytes.push(currentByte); // Add byte
        }
    }
    return new Uint8Array(newBytes);
};

function Uint8AtoHex(arr: Uint8Array): string {
    return Array.from(arr, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

const formatUUID = (arr: Uint8Array): string => {
    if (arr.length != 16)
        throw new RangeError("formatUUID needs 32byte Array");
    return Uint8AtoHex(arr).replace(/([0-9a-f]{8})([0-9a-f]{4})([0-5][0-9a-f]{3})([089ab][0-9a-f]{3})([0-9a-f]{12})/, '$1-$2-$3-$4-$5');
}

type tplTakeStr = [long: string, outtaken: string];
type tplTakeUint8A = [long: string, outtaken: Uint8Array];
type tplTakeUint8 = [long: string, outtaken: uint8];

const takeStr = (inp: string, howmany: number): tplTakeStr => {
    const taken = inp.slice(0, howmany);
    const inpnew = inp.substring(howmany);

    return [inpnew, taken];
}

const take1 = (inp: string): tplTakeUint8 => {
    const [inpnew, ret] = takeUint8(inp, 1);
    return [inpnew, toUint8(ret[0])]
}

const takeUint8 = (inp: string, howmany: number): tplTakeUint8A => {
    const taken = inp.slice(0, howmany);
    const inpnew = inp.substring(howmany);

    let newBytes = [];
    for (let i = 0; i < taken.length; i++) {
        newBytes.push(toUint8FStr(taken.slice(i, i + 1)));
    }

    return [inpnew, new Uint8Array(newBytes)];
}

const [t1, t2] = takeStr("abc", 1);
console.assert(t1 === "bc");
console.assert(t2 === "a");

type uint8 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 142 | 143 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 153 | 154 | 155 | 156 | 157 | 158 | 159 | 160 | 161 | 162 | 163 | 164 | 165 | 166 | 167 | 168 | 169 | 170 | 171 | 172 | 173 | 174 | 175 | 176 | 177 | 178 | 179 | 180 | 181 | 182 | 183 | 184 | 185 | 186 | 187 | 188 | 189 | 190 | 191 | 192 | 193 | 194 | 195 | 196 | 197 | 198 | 199 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212 | 213 | 214 | 215 | 216 | 217 | 218 | 219 | 220 | 221 | 222 | 223 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 237 | 238 | 239 | 240 | 241 | 242 | 243 | 244 | 245 | 246 | 247 | 248 | 249 | 250 | 251 | 252 | 253 | 254 | 255;



const expect = (inp1: string, val: uint8, desc: string): boolean => {
    if (inp1.charCodeAt(0) != val) {
        console.assert(false, "val " + val + " does not match input " + inp1.charCodeAt(0) + " regarding " + desc)
        return false;
    }
    return true;
}
console.assert(expect("a", 97, "tes2tder"));

const expect2 = (inp1: uint8, val: uint8, desc: string): boolean => {
    if (inp1 != val) {
        console.assert(false, "val " + val + " does not match input " + inp1 + " regarding " + desc)
        return false;
    }
    return true;
}

function toUint8(n: number): uint8 {
    if (!Number.isInteger(n) || n < 0 || n > 255) throw new RangeError("Number is out of Uint8 range");
    return n as uint8;
}

function toUint8FStr(n: string): uint8 {
    return toUint8(parseInt(n.codePointAt(0) + ""));
}

class epassfoto {
    cloudURL: string = ""; lbID: Uint8Array = new Uint8Array(); schlAlg: string = "";
    initVec: Uint8Array = new Uint8Array();
    lenPad_p: number = 0;
    pad: Uint8Array = new Uint8Array();
    lenKey_z: number = 0;
    key: Uint8Array = new Uint8Array;
}
class epassfoto_p { // "pretty" or "print"
    cloudUrl: string = ""; lbID: string = ""; schlAlgOID: string = ""; schlAlgTxt: string = ""; initVec: string = ""; pad: string = ""; key: string = "";
}

const conv_epassfoto_pretty = (inp: epassfoto): epassfoto_p => {
    let ret = new epassfoto_p();
    ret.cloudUrl = inp.cloudURL;
    ret.lbID = formatUUID(inp.lbID);
    ret.schlAlgOID = inp.schlAlg;
    if (inp.schlAlg === "2.16.840.1.101.3.4.1.46")
        ret.schlAlgTxt = "aes256-GCM";
    else if (inp.schlAlg === "2.16.840.1.101.3.4.1.42")
        ret.schlAlgTxt="aes256-CBC-PAD"

    ret.initVec = Uint8AtoHex(inp.initVec);
    ret.pad = Uint8AtoHex(inp.pad);
    ret.key = Uint8AtoHex(inp.key);
    return ret;
}

const decodeComplete = (inp: string): epassfoto => {
    let ret: epassfoto = new epassfoto();

    let bytes = atob(inp);
    let byte: string = "";
    {
        let uint: uint8;
        [bytes, uint] = take1(bytes);
        expect2(uint, 0xe2, "starttag");
        [bytes, uint] = take1(bytes);
        expect2(uint, 0x01, "version");
    }

    {
        let lenCloud_v: uint8;
        [bytes, lenCloud_v] = take1(bytes);
        [bytes, ret.cloudURL] = takeStr(bytes, lenCloud_v);
    }
    [bytes, ret.lbID] = takeUint8(bytes, 16);
    {
        let lenVerschl_x: uint8
        [bytes, lenVerschl_x] = take1(bytes);
        let schl;
        [bytes, schl] = takeUint8(bytes, lenVerschl_x);
        ret.schlAlg = c40dec(schl);
    }
    {
        [bytes, byte] = takeStr(bytes, 1);
        const initVec_y = toUint8FStr(byte);
        [bytes, ret.initVec] = takeUint8(bytes, initVec_y);
    }

    [bytes, ret.lenPad_p] = take1(bytes);
    [bytes, ret.pad] = takeUint8(bytes, ret.lenPad_p);

    [bytes, ret.lenKey_z] = take1(bytes);
    [bytes, ret.key] = takeUint8(bytes, ret.lenKey_z);

    console.assert(bytes.length === 0);
    return ret;
}
console.assert(c40t_ASC("X") === 37);
console.assert(c40t_Idx(37) === "X");
console.assert(c40enc("XKCD") === "0xeb11fe45"); // BSI normative

// https://www.bsi.bund.de/SharedDocs/Downloads/EN/BSI/Publications/TechGuidelines/TR03137/BSI-TR-03137_Part1.pdf?__blob=publicationFile&v=7
console.assert(c40dec(hexToByte("62 d7 19 c9")) === "BSI01"); // BSI normative p.16
console.assert(c40dec(hexToByte("eb 04 66 a9")) === "XK CD"); // BSI normative p.50
console.assert(c40dec(hexToByte("eb 11 fe 45")) === "XKCD"); // BSI normative p.50

// https://ants.gouv.fr/files/1ba15231-0320-40da-819a-655888f43eb9/ants_2d-doc_cabspec_v334.pdf
console.assert(c40dec(hexToByte("28 2A 4D C5 FE 44")) === "2D-DOC"); // French 2d-Doc normative

console.assert(
    c40dec(hexToByte("25b6 20d2 5329 1936 1f76 1fe6 0850 0851 084e 0851 fe37")) === "2.16.840.1.101.3.4.1.46"
); // ringfoto

console.assert(
    c40dec(hexToByte("25b6 20d2 5329 1936 1f76 1fe6 0850 0851 084e 0851 2581")) === "2.16.840.1.101.3.4.1.42"); // dm


const dm = decodeComplete("4gEwaHR0cHM6Ly9kLmJpb21ldHJpYy1waG90b3MtcHJvZC5hd3MuZG10ZWNoLmNsb3VkCWwee0esRNWcWwQbi6S75hYltiDSUykZNh92H+YIUAhRCE4IUSWBEPPKGS+eQGD/DU7ExxZzPIEIDwNFFA96TGkgdEok85XAm+jFBUB1gAE7jyXIst4yc3mKdFO2u0KSeXI=");
console.log(conv_epassfoto_pretty(dm));
