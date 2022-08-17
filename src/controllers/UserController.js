let users = require('../mocks/Users');

module.exports = {
  getAllUsers(request, response) {
    const { orderBy } = request.query;

    const sortedUsers = users.sort((a, b) => {
      if (orderBy === 'desc') {
        return a.id < b.id ? 1 : -1;
      } else {
        return a.id > b.id ? 1 : -1;
      }
    })

    response.send(200, sortedUsers);
  },

  getUserById(request, response) {
    const { id } = request.params;

    const foundedUser = users.find(user => user.id === Number(id));

    if (!foundedUser) {
      return response.send(400, { message: 'User not founded' });
    }

    response.send(200, foundedUser);
  },

  createUser(request, response) {

    const { name } = request.body;

    const newUser = {
      id: users[users.length - 1].id + 1,
      name
    }

    users.push(newUser);

    response.send(200, newUser);

  },

  updateUser(request, response) {

    const { id } = request.params;
    const { name } = request.body;

    const existsUser = users.find(user => user.id === Number(id));

    if (!existsUser) {
      response.send(400, { message: 'User not found' });
    }

    users = users.map(user => {
      if (user.id === Number(id)) {
        return {
          ...user,
          name,
        }
      }

      return user;
    })

    response.send(200, { message: 'User updated' });
  },

  deleteUser(request, response) {

    const { id } = request.params;

    const existsUser = users.find(user => user.id === Number(id));

    if (!existsUser) {
      response.send(400, { message: 'User not found' });
    }

    users = users.filter(user => user.id !== Number(id));

    response.send(200, { message: 'User deleted' });
  },
};
