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

    this.config.save()
  }

  async prompting(){
    const user = await username()
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }, {
      type    : 'input',
      name    : 'database_name',
      message : 'Database name',
      default : this.appname
    },{
      type    : 'input',
      name    : 'database_username',
      message : 'Database user name',
      default :  user
    },{
      type    : 'input',
      name    : 'database_port',
      message : 'Database port',
      default : '5432'
    }]).then((result) => {
      this.config = result
      this.config.secret = require('crypto').randomBytes(32).toString('hex');
      this.config.appname = this.appname
    });
  }

  copyTemplates(){
    const path = Path.join(this.destinationRoot())
    const source = Path.join(this.sourceRoot())
    mkdirp.sync(Path.join(path, 'admin'))
    mkdirp.sync(Path.join(path, 'api'))

    this.fs.copyTpl(Path.join(source, '../../admin/templates/') , Path.join(path, 'admin'), this.config, {}, {globOptions: {dot: true, ignore: ['**/*.png', '**/*.gif', '**/*.jpg']}});
    this.fs.copy(Path.join(source, '../../admin/templates/**/*.*(jpg|gif|jpg)') , Path.join(path, 'admin'), this.config, {globOptions: {dot: true}});
    this.fs.copyTpl(Path.join(source, '../../api/templates/'), Path.join(path, 'api'), this.config, {}, {globOptions: {dot: true}});
    this.fs.copy(Path.join(source, '.gitignore') , `${path}/.gitignore`);
  }

};
