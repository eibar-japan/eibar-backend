module.exports = {
  test: {
    client: "postgresql",
    connection: {
      database: "eibar-test",
      user: "eibaradmin",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
    },
  },

  development: {
    client: "postgresql",
    connection: {
      database: "eibar",
      user: "eibaradmin",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "eibar",
      user: "eibaradmin",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
    },
  },
};
