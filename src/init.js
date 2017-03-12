const yeoman = require('yeoman-environment');

module.exports = () => {
  const env = yeoman.createEnv();
  env.register(require.resolve('../app'), 'tuols:app');
  env.run('tuols:app');
}
