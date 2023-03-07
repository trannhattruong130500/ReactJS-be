'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'Tran Nhat ',
      lastName: 'Truong',
      address: 'Viet Nam',
      gender: 1,
      roleId: 'R1',
      phoneNumber: '0797549289',
      positionId: 'VL',
      image: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
