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
    this.option('skip-migration', {required: true, type: Boolean})
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
      let [column, type] = o.split(':')
      // if(type === 'integer'){
      //   type = 'number().integer().optional(),'
      // }else if(type === 'float'){
      //   type = 'number().precision(2).optional(),'
      // }else if(type === 'boolean'){
      //   type = 'boolean().optional(),'
      // }
      // else{
      //   type = `string().optional(),`
      // }
      type = `any().optional(),`
      return [column, type]
    })
    const name = this.options['name']

    if(!this.options['skip-migration']){
      shell.cd(Path.join(path, 'api'))
      shell.exec(`./node_modules/.bin/sequelize model:create --name ${this.options['name']} --attributes ${this.options['attributes']}`)
    }

    this.fs.copyTpl(Path.join(source, 'curd.js'), Path.join(path, `server/api/admin/${this.options['name']}.js`), {attributes, name}, {}, {globOptions: {dot: true}});
  }
};
