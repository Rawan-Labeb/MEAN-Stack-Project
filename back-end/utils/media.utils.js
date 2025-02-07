const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

async function uploadImage(file) {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.data,
      fileName: file.name,
    });
    return uploadResponse;
  } catch (error) {
    throw new Error('Error uploading image: ' + error.message);
  }
}

module.exports = {
  uploadImage
};
