/* */
const ShellDao = require('./dao/shellDao');
/* Load lilypond model entity */
const Model = require('./model');

/**
 * Theme Controller
 */
class Controller {

  constructor() {
    this.shellDao = new ShellDao();
  }

  midiConverter(req, res) {
    this.shellDao.midiConverter(req.file)
        .then(this.findConvertedResult(req, res))
        .catch(function(error) {
          console.log("Controller lyConverter error: " + error);
          //this.findError(res)
        });
  }

  /**
   * Tries to find an entity using its
   * @params req, res
   * @return entity
   */
  lyConverter(req, res) {
    this.shellDao.lyConverter(Controller.createModel(req))
    .then(this.findConvertedResult(req, res))
    .catch(function(error) {
        res.status(400); // Not found
        res.json(error);
    });
  };


  static createModel = req => {
    let model = new Model();
    model.format = req.body.format;
    model.content = req.body.content;

    model.binaryPath = 'lilypond';
    model.resolution = 100;

    return model;
  };

  findSuccess(res) {
    return (result) => {
      res.status(200); // Found
      res.json(result);
    }
  };

  findConvertedResult(req, res) {
    return (result) => {

      // Archive Muliple Files:
      // https://stackoverflow.com/questions/21981919/compressing-multiple-files-using-zlib
      // https://github.com/archiverjs/node-archiver
      res.status(200);

      let contentType = "";

      if (result.format === 'pdf') {
        contentType = 'application/pdf';
      } else if (result.format === 'zip') {
        contentType = 'application/zip';
      } else if (result.format === 'png') {
        contentType = 'image/png';
      } else if (result.format === 'svg') {
        contentType = 'image/svg';
      }  else if (result.format === 'midi') {
        contentType = 'application/midi';
      } else if (result.format === 'ly') {
        contentType = 'text/plain';
      }

      res.status(200);
      res.set('Content-Type', contentType);
      res.set('responseType', result.format);
      res.set('format', result.format);

      res.write(Buffer.from(result.data));
      res.end();
    }
  }

  findError(res) {
    return (error) => {
      console.log('res: ' + res);
      console.log('error: ' + error);
      res.status(404); // Not found
      res.json(error);
    }
  };

}

module.exports = Controller;
