import SparkMD5 from 'spark-md5'

const CHUNKSIZE=2*1024*1024

const hashFile=(file)=>{
    return new Promise((resolve,reject)=>{
        const blobSlice=File.prototype.slice || File.prototype.mozSlice|| File.prototype.webKitSlice
        const chunks=Math.ceil(file.size/CHUNKSIZE)
        let currentChunk=0;
        const spark=new SparkMD5.ArrayBuffer();
        const fileReader=new FileReader()
        function loadNext(){
            const start=currentChunk*CHUNKSIZE
            const end=start+CHUNKSIZE>=file.size?file.size:start+CHUNKSIZE
            fileReader.readAsArrayBuffer(blobSlice.call(file,start,end))
        }
        fileReader.onload=e=>{
            spark.append(e.target.result)
            currentChunk++
            if(currentChunk<chunks){
                loadNext()
            }else{
                console.log('finished loading')
                const result=spark.end()
                const sparkMd5=new SparkMD5()
                sparkMd5.append(result)
                sparkMd5.append(file.name)
                const hexHash=sparkMd5.end()
                resolve(hexHash)
            }
        }

        fileReader.onerror=()=>{
            console.warn("文件读取失败")
        }
        loadNext()
    }).catch(err=>{
        console.log(err)
    })
}


export default hashFile