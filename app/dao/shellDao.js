/* Load Song entity */
const fs = require('fs'),
 path = require('path'),
 archiver = require('archiver-promise'),
 childProcess = require('child_process'),
 Promise = require('bluebird');

const DaoError = require('./daoError');

/**
 * Song Data Access Object
 */
class ShellDao {

  constructor() {
  }

  promiseExec(task, format) {
    function cleanTmpFolder() {
      let directory = './tmp/';
      fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });
    }


    function resolver(format, resolve) {
      fs.readFile('./tmp/tmp.' + format, function read(err, data) {
        if (err) {
          throw err;
        }
        let result = {};
        result.data = data;
        result.format = format;

        resolve(result);
        cleanTmpFolder();

      });
    }

    function resolveData(resolve, format, count) {

      if (count > 1) {

        var output = fs.createWriteStream('./tmp/tmp.zip');
        var archive = archiver('zip', {
          zlib: {level: 9} // Sets the compression level.
        });
        archive.glob('tmp/*.' + format);

        output.on('close', function () {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.pipe(output);

        archive.finalize().then(function () {
          resolver('zip',resolve);
        });
      } else {
        resolver(format, resolve);
      }

    }

    return new Promise(function (resolve, reject) {
      childProcess.exec(task, function(error) {
        if (error !== null) {
          reject(new DaoError('20', 'Lilypond binary throws an error: ' + error));
        } else {
          let count = 0;
          let directory = './tmp/';
          fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
              if (file.split('.').pop() === format)
                count++;
            }
            resolveData(resolve,format, count);

          });

        }
      });
    });
  }

  midiConverter(uploadedFile) {
    fs.writeFileSync('./tmp/tmp.midi', uploadedFile.buffer);
    let shellCommand = [
      "midi2ly",
      './tmp/tmp.midi',
      '-o ./tmp/tmp.ly'
    ];

    return this.promiseExec(shellCommand.join(' '), 'ly');
  }

  /**
   * Tries to find an entity using its Id / Primary Key
   * @params id
   * @return entity
   */
  lyConverter(model) {
    const file = fs.createWriteStream('./tmp/tmp.ly');
    file.write(model.content);
    file.end();

       let format = "";

       if (model.format === 'svg') {
         format = '-dbackend=svg';
       } else if (model.format === 'midi') {
         format = '-dmidi-extension=midi';
       } else {
         format = '-f ' + model.format;
       }

      let shellCommand = [
        model.binaryPath,
        format,
         '-d resolution=' + (model.resolution * 2.54),
        '--silent',
        '--output ./tmp/tmp',
        './tmp/tmp.ly'
      ];

    return this.promiseExec(shellCommand.join(' '), model.format);
  };
}

module.exports = ShellDao;
