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

    this.argument('model:create', {desc: 'model generete', required: false, type: String})
    this.argument('init', {desc: 'model generete', required: false, type: String})
    this.config.save()
  }

  async prompting(){
    if (!this.options['init']) return

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
    if (!this.options['init']) return

    const path = Path.join(this.destinationRoot())
    const source = Path.join(this.sourceRoot())
    mkdirp.sync(Path.join(path, 'admin'))
    mkdirp.sync(Path.join(path, 'api'))

    this.fs.copyTpl(Path.join(source, '../../admin/templates/') , Path.join(path, 'admin'), this.config, {}, {globOptions: {dot: true}});
    this.fs.copyTpl(Path.join(source, '../../api/templates/'), Path.join(path, 'api'), this.config, {}, {globOptions: {dot: true}});
  }

  model(){
    if (!this.options['model:create']) return
    this.option('name', {required: true, type: String})
    this.option('attributes', {required: true, type: String})

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
      if(type === 'integer'){
        type = 'number().integer().optional(),'
      }else if(type === 'float'){
        type = 'number().float().optional(),'
      }else{
        type = `${type}().optional(),`
      }
      return [column, type]
    })
    const name = this.options['name']

    shell.cd(Path.join(path, 'api'))
    shell.exec(`./node_modules/.bin/sequelize model:create --name ${this.options['name']} --attributes ${this.options['attributes']}`)

    this.fs.copyTpl(Path.join(source, 'curd.js'), Path.join(path, `api/server/api/${this.options['name']}.js`), {attributes, name}, {}, {globOptions: {dot: true}});
  }
};
