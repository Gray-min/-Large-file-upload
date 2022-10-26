import axios from "axios";
import hashFile from "./fileHash";

const CHUNKSIZE = 2 * 1024 * 1024;
let url = "http://localhost:3000/upload";
let merge = "http://localhost:3000/merge";
const controller = new AbortController();

const upload = async (file) => {
  if (!file) return;
  const blockCount = Math.ceil(file.size / CHUNKSIZE);
  const axiosArray = [];
  const hash = await hashFile(file);
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webKitSlice;

  //可使用hash进行校验请求
  const uploadCheck = await axios.post(
    "http://localhost:3000/uploadCheck",
    { hash, name: file.name },
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  let existChunks = [];
  if (uploadCheck.data.code === 200) {
    if (!uploadCheck.data.exist) {
      existChunks = uploadCheck.data.data;
      for (let i = 0; i < blockCount; i++) {
        if (existChunks.includes(i)) continue;
        const start = i * CHUNKSIZE;
        const end = Math.min(start + CHUNKSIZE, file.size);
        const form = new FormData();
        form.append("file", blobSlice.call(file, start, end));
        form.append("name", file.name);
        form.append("total", blockCount);
        form.append("index", i);
        form.append("size", file.size);
        form.append("hash", hash);
        const axiosOptions = {
          onUploadProgress: (e) => {
            console.log(blockCount, i, e, file);
          },
          signal: controller.signal,
        };
        axiosArray.push(axios.post(url, form, axiosOptions));
      }

    await axios.all(axiosArray);
      const data = {
        size: file.size,
        name: file.name,
        total: blockCount,
        hash,
      };

    const mergeRes=await axios
        .post(merge, data, {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        })
    console.log(mergeRes)
    }
  }
};

const abort = () => {
  controller.abort();
};

export { upload as default, abort };
