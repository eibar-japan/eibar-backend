module.exports = {
  test: {
    client: "postgresql",
    connection: {
      host: process.env.DOCKER_DB_HOST || "localhost",
      port: "5432",
      database: "eibar_test",
      user: "eibaradmin",
      password: "eibar12345",
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
      host: process.env.DOCKER_DB_HOST || "localhost",
      port: "5432",
      database: "eibar",
      user: "eibaradmin",
      password: "eibar12345",
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
    connection: process.env.DATABASE_URL + "?ssl=true",
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
    connection: process.env.DATABASE_URL + "?ssl=true",
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
    },
  },
};
