var express = require("express");
var router = express.Router();
var {
  existsSync,
  promises: { mkdir, copyFile, readdir },
  createReadStream,
  unlinkSync,
  createWriteStream,
} = require("fs");
var path = require("path");

const mkdirsSync = async (dirname) => {
  if (existsSync(dirname)) {
    return true;
  } else {
    try {
      const res = await mkdir(dirname);
    } catch (error) {
      return false;
    }
    return true;
  }
};

const uploadPath = path.resolve(__dirname, "../uploads");

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send({ success: true });
});

router.post("/upload", async function (req, res, next) {
  let { file } = req.files;
  const { name, total, index, size, hash } = req.fields;
  const chunksPath = path.join(uploadPath, hash, "/");
  if (!existsSync(chunksPath)) mkdirsSync(chunksPath);
  console.log(chunksPath);
  try {
    const err = await copyFile(file.path, chunksPath + hash + "-" + index);
  } catch (error) {
    console.log(file.path);
  }
  res.send({ success: true, code: 200 });
});

router.post("/uploadCheck", async function (req, res) {
  let { hash, name } = req.fields;
  const chunksPath = path.join(uploadPath, hash, "/");
  console.log("uploadCheck", chunksPath);
  if (!existsSync(chunksPath)) {
    console.log("从未上传");
    res.send({ data: [], msg: "从未上传", code: 200 });
    return;
  } else {
    const chunks = await readdir(chunksPath);
    let exist = false;
    let existChunk = [];
    for (let chunk of chunks) {
      if (chunk.includes(name)) {
        exist = true;
        break;
      }
      let index = chunk.split("-")[1];
      existChunk.push(parseInt(index));
    }
    res.send({ data: existChunk, code: 200, exist });
  }
});

const mergeChunkFile = (
  fileName,
  chunkPath,
  chunkCount,
  fileToken,
  dataDir = "./"
) => {
  //如果chunkPath 不存在 则直接结束
  if (!existsSync(chunkPath)) return;
  const dataPath = path.resolve(__dirname, dataDir, fileName);
  let writeStream = createWriteStream(dataPath);
  let mergedChunkNum = 0;
  return mergeCore();
  //闭包保存非递归数据
  function mergeCore() {
    //结束标志为已合并数量大于总数（mergedChunkNum从0开始）
    if (mergedChunkNum >= chunkCount) return;
    const curChunk = path.resolve(chunkPath, `${fileToken}-${mergedChunkNum}`);
    const curChunkReadStream = createReadStream(curChunk);
    //将readStream 写入 writeStream
    curChunkReadStream.pipe(writeStream, { end: false }); //end = false 则可以连续给writeStream 写数据
    curChunkReadStream.on("end", () => {
      //readStream 传输结束 则 递归 进行下一个文件流的读写操作
      unlinkSync(curChunk); //删除chunkFile
      mergedChunkNum += 1;
      mergeCore();
    });
  }
};

router.post("/merge", async function (req, res, next) {
  const { size, name, total, hash } = req.fields;
  const chunksPath = path.join(uploadPath, hash, "/");
  const filePath = path.join(uploadPath, name);
  const chunks = await readdir(chunksPath);
  if (chunks.length != total || chunks.length === 0) {
    res.send({ success: false, msg: "切片数量错误" });
    return;
  }
  mergeChunkFile(name, chunksPath, chunks.length, hash, chunksPath);
  res.send({ success: true });
});

module.exports = router;
