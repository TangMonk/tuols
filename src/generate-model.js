const yeoman = require('yeoman-environment');

function generete(program){
  const args = program.args
  if(args.length != 2){
    console.error('argument required');
    process.exit(1);
  }
  const [name, attributes] = args
  const env = yeoman.createEnv();
  env.register(require.resolve('../app/generate-model'), 'tuols:generate-model');

  env.run('tuols:generate-model', {name: name, attributes: attributes, 'skip-migration': program.skipMigration});
}

module.exports = generete
