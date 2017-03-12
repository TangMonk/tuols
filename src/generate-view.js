const yeoman = require('yeoman-environment');

function generete(program){
  const args = program.args
  if(args.length != 2){
    console.error('argument required');
    process.exit(1);
  }
  const [name, attributes] = args
  const env = yeoman.createEnv();
  env.register(require.resolve('../app/generate-view'), 'tuols:generate-view');

  env.run('tuols:generate-view', {name: name, attributes: attributes}, () =>{
    console.log(`
      Templates genereted! Now you should copy this following codes to files:

      1. at 'admin/src/router.js', append follwing:

      {
        path: '${name}s',
        name: '${name}s',
        getComponent (nextState, cb) {
          require.ensure([], require => {
            registerModel(app, require('./models/${name}s'))
            cb(null, require('./routes/${name}s'))
          }, '${name}s')
        }
      }

      2. at 'admin/src/utils/menu.js', append follwing:

      {
        key: '${name}s',
        name: '${name}管理',
        icon: 'user'
      }

    `)
  });
}

module.exports = generete
