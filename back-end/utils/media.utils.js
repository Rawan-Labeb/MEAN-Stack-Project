const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY',
  urlEndpoint: 'YOUR_URL_ENDPOINT',
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
