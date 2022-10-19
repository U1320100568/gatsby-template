const path = require('path');

exports.createPages = async ({graphql, actions}) => {
  const {createPage} = actions;

  createPage({
    path: '/',
    component: path.resolve('src/Templates/Landing.js'),
    context: {},
  });

};

