import fs from "fs";

const upload_image = async (base64String) => {
  return new Promise((resolve, reject) => {
    const uploadsDirectory = "uploads";
    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(uploadsDirectory);
    }
    const ext = base64String.split(";base64,")[0].split("/").pop();
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    const filename = uploadsDirectory + "/" + "image_" + Date.now() + `.${ext}`;
    fs.writeFile(filename, imageBuffer, (err) => {
      if (err) {
        console.error("Error saving the file:", err);
        reject("Error saving the file");
        res.status(500).send("Error saving the file");
      } else {
        console.log(`Image saved at: ${filename}`);
        resolve(filename);
      }
    });
  });
};

export default upload_image;
