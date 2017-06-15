var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Password please\n', (answer) => {
    //console.log('Thank you for your valuable feedback:', answer);
    rl.close();


    var config = {
        username: "web385",
        password: answer, // optional, prompted if none given 
        host: "ftp.dasunwahrscheinliche.de",
        port: 21,
        localRoot: __dirname + "/build",
        remoteRoot: "/httpdocs/",
        // include: ['build/version.txt'],
        // exclude: ['.git', '.idea', 'tmp/*', 'build/*']
    }
        
    ftpDeploy.deploy(config, function(err) {
        if (err) console.log(err)
        else console.log('finished');
    });

    ftpDeploy.on('uploading', function(data) {
        data.totalFileCount;       // total file count being transferred 
        data.transferredFileCount; // number of files transferred 
        data.percentComplete;      // percent as a number 1 - 100 
        data.filename;             // partial path with filename being uploaded 
    });
    ftpDeploy.on('uploaded', function(data) {
        console.log(data);         // same data as uploading event 
    });

});

