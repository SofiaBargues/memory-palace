// Generated with ChatGPT. Cloudinary SDK doesn't work on edge runtime

export async function uploadToCloudinary(imageUrl: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = "palace_";

  // URL de la API de Cloudinary para subir imágenes
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Generar la firma de autenticación
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${apiSecret}`;
  const signature = sha1(stringToSign);

  // Crear el cuerpo de la solicitud como JSON
  const requestBody = {
    file: imageUrl,
    upload_preset: uploadPreset,
    api_key: apiKey,
    timestamp: timestamp.toString(),
    signature: signature,
  };

  // Realizar la solicitud POST a la API de Cloudinary
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificar el tipo de contenido JSON
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const body = await response.json();
    throw new Error(`Error al subir la imagen: ${body.error}`);
  }

  // Extraer y devolver la URL de la imagen subida
  const data = await response.json();
  return data.secure_url;
}
function sha1(message: string): string {
  function rotateLeft(n: number, s: number) {
    return (n << s) | (n >>> (32 - s));
  }

  function toHex(val: number) {
    let hex = "";
    for (let i = 7; i >= 0; i--) {
      hex += ((val >>> (i * 4)) & 0x0f).toString(16);
    }
    return hex;
  }

  const msg = unescape(encodeURIComponent(message));
  const msgLength = msg.length;

  const wordArray = [];
  for (let i = 0; i < msgLength - 3; i += 4) {
    const j =
      (msg.charCodeAt(i) << 24) |
      (msg.charCodeAt(i + 1) << 16) |
      (msg.charCodeAt(i + 2) << 8) |
      msg.charCodeAt(i + 3);
    wordArray.push(j);
  }

  let i;
  switch (msgLength % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msgLength - 1) << 24) | 0x0800000;
      break;
    case 2:
      i =
        (msg.charCodeAt(msgLength - 2) << 24) |
        (msg.charCodeAt(msgLength - 1) << 16) |
        0x08000;
      break;
    case 3:
      i =
        (msg.charCodeAt(msgLength - 3) << 24) |
        (msg.charCodeAt(msgLength - 2) << 16) |
        (msg.charCodeAt(msgLength - 1) << 8) |
        0x80;
      break;
  }

  wordArray.push(i);

  while (wordArray.length % 16 !== 14) {
    wordArray.push(0);
  }

  wordArray.push(msgLength >>> 29);
  wordArray.push((msgLength << 3) & 0x0ffffffff);

  const W = new Array(80);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;
  let e = 0xc3d2e1f0;

  for (let i = 0; i < wordArray.length; i += 16) {
    for (let j = 0; j < 16; j++) W[j] = wordArray[i + j];
    for (let j = 16; j < 80; j++)
      W[j] = rotateLeft(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1);

    let temp;
    let aa = a;
    let bb = b;
    let cc = c;
    let dd = d;
    let ee = e;

    for (let j = 0; j < 80; j++) {
      if (j < 20) {
        temp =
          (rotateLeft(aa, 5) +
            ((bb & cc) | (~bb & dd)) +
            ee +
            W[j] +
            0x5a827999) &
          0x0ffffffff;
      } else if (j < 40) {
        temp =
          (rotateLeft(aa, 5) + (bb ^ cc ^ dd) + ee + W[j] + 0x6ed9eba1) &
          0x0ffffffff;
      } else if (j < 60) {
        temp =
          (rotateLeft(aa, 5) +
            ((bb & cc) | (bb & dd) | (cc & dd)) +
            ee +
            W[j] +
            0x8f1bbcdc) &
          0x0ffffffff;
      } else {
        temp =
          (rotateLeft(aa, 5) + (bb ^ cc ^ dd) + ee + W[j] + 0xca62c1d6) &
          0x0ffffffff;
      }

      ee = dd;
      dd = cc;
      cc = rotateLeft(bb, 30);
      bb = aa;
      aa = temp;
    }

    a = (a + aa) & 0x0ffffffff;
    b = (b + bb) & 0x0ffffffff;
    c = (c + cc) & 0x0ffffffff;
    d = (d + dd) & 0x0ffffffff;
    e = (e + ee) & 0x0ffffffff;
  }

  return toHex(a) + toHex(b) + toHex(c) + toHex(d) + toHex(e);
}
