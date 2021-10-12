const knexfile = require("./knexfile");
const inputEnvironment = process.argv[2];
const migrationAction = process.argv[3];
const color = require("colorette");

const validMigrationActions = ["rollback", "latest", "up", "down"];

let knexs = [];
let environments = [];

if (inputEnvironment) {
  environments = inputEnvironment.split(",");
  environments.forEach((env) => {
    if (knexfile.hasOwnProperty(env)) {
      knexs.push(require("./knex")(env));
    } else {
      console.error(
        `${env} is an invalid environment. Valid environments are:`
      );

      environments = Object.entries(knexfile);
      for (const key in environments) {
        console.log(environments[key][0]);
      }
      console.log("\n");
      process.exit(0);
    }
  });
} else {
  console.error(
    color.red(
      `Please specify an Environment. Syntax: "npm run mig -- ENVIRONMENT ACTION`
    )
  );
  process.exit(0);
}

if (migrationAction) {
  if (validMigrationActions.includes(migrationAction)) {
    let migrationPromises = [];
    knexs.forEach((knex) => {
      migrationPromises.push(
        knex.migrate[migrationAction]({ directory: "./external/db/migrations" })
      );
    });
    Promise.all(migrationPromises)
      // knex.migrate[migrationAction]({ directory: "./external/db/migrations" })
      .then((results) => {
        for (let i = 0; i < environments.length; i++) {
          const ranMigrations = results[i][1];

          console.log(`Environment: ${environments[i]}`);
          console.log(`  Action: ${migrationAction}`);
          if (ranMigrations.length === 0) {
            console.log(`    Result: NO MIGRATIONS TO APPLY`);
          } else {
            console.log(
              `    Result: the following migrations were applied/rolled back.`
            );
            ranMigrations.forEach((mig) => {
              console.log(`      ${mig}`);
            });
          }
          console.log("");
        }
        process.exit(0);
      })
      .catch((err) => {
        console.error("******* ERROR ON MIGRATION:\n");
        console.error(err);
        process.exit(0);
      });
  } else {
    const actionsString = validMigrationActions.join("\n");
    console.error(
      `"${migrationAction}" is an invalid action. Valid actions are:\n${actionsString}`
    );
    return;
  }
} else {
  console.error(
    color.red(
      `Please specify an action. Syntax: "npm run mig -- ENVIRONMENT ACTION`
    )
  );
}
