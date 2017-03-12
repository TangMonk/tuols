const Generator = require('yeoman-generator');
const chalk = require('chalk');
const username = require('username');
const mkdirp = require('mkdirp');
const Path = require('path')
const shell = require('shelljs');
const Joi = require('joi');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.option('name', {required: true, type: String})
    this.option('attributes', {required: true, type: String})
  }

  model(){
    Joi.assert({
      name: this.options['name'],
      attributes: this.options['attributes']
    },{
      name: Joi.string().required(),
      attributes: Joi.string().required()
    }, '--name or --attributes is not valid')

    const path = Path.join(this.destinationRoot())
    const source = Path.join(this.sourceRoot())

    const attributes = this.options['attributes'].split(',').map(o => {
      let [column, type, ui] = o.split(':')
      ui = ui || type

      return [column, type]
    })
    const name = this.options['name']
    mkdirp.sync(`admin/src/components/${this.options['name']}`)

    this.fs.copyTpl(Path.join(source, 'admin/components/'), Path.join(path, `admin/src/components/${this.options['name']}s/`), {attributes, name});
    this.fs.copyTpl(Path.join(source, 'admin/models/model.js'), Path.join(path, `admin/src/models/${this.options['name']}s.js`), {attributes, name});
    this.fs.copyTpl(Path.join(source, 'admin/routes/route.js'), Path.join(path, `admin/src/routes/${this.options['name']}s.js`), {attributes, name});
    this.fs.copyTpl(Path.join(source, 'admin/services/service.js'), Path.join(path, `admin/src/services/${this.options['name']}s.js`), {attributes, name});
  }
};
