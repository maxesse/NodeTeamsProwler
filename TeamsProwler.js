import urlExist from "url-exist"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import sort from "alphanum-sort"
import Downloader from "nodejs-file-downloader"
import os from "os"

const yarg = yargs(hideBin(process.argv))

const options = yarg.usage("Usage: -mv <Major Teams version> -b <Starting Build> -c <Builds ahead to lookup>")
    .option("m", { alias: "majorversion", describe: "Major Teams Version (i.e. 1.4.00)", type: "string", demandOption: true})
    .option("b", { alias: "build", describe: "Start searching from (i.e. 10000)", type: "string", demandOption: true})
    .option("c", { alias: "count", describe: "Builds to search for (i.e. 100)", type: "string", demandOption: true})
    .argv

const majorVersion = options.majorversion
const build = options.build
const count = options.count
var versionsToCheck = new Array()
var existingVersions = new Array()
for (var version = Number(build); version < Number(build) + Number(count); version++) {
    versionsToCheck.push(`https://statics.teams.microsoft.com/production-osx/${majorVersion}.${version}/Teams_osx.pkg`)
}

var promise1 = Promise.all(versionsToCheck.map(async url => {
    const result = await urlExist(url);
    if (result === true) {
        console.log(result + " " + url)
        existingVersions.push(url)
    }
}))

promise1.then(() => {
    var downloadDirectory = os.homedir() + "/Downloads"
    existingVersions = sort(existingVersions)
    console.log(`Downloading version ${existingVersions.slice(-1).pop()}`)
    const downloader = new Downloader({     
    url: existingVersions.slice(-1).pop(),     
    directory: downloadDirectory,//Sub directories will also be automatically created if they do not exist.    
    })    
    
    try {
    downloader.download();   
    } catch (error) {
    console.log(error)
    }
})

function onErr(err) {
    console.log(err)
    return 1
}