# Eibar backend

## Dev Environment Setup

### Prerequisites

- Postgresql
- Redis?

### Initializing Postgres

1. initdb -d ....
1. createuser -d eibaradmin
1. createdb -O eibaradmin -U eibaradmin eibar

## DB maintenance

### Migrations

knex migrate:make NAME --knexfile ./external/db/knexfile.js

knex migrate:latest --knexfile ./external/db/knexfile.js --env development
knex migrate:down --knexfile ./external/db/knexfile.js --env development

### Postgres cheatsheet

- \l - list databases
- \dt - list tables
- \d TABLENAME - describe table

## Testing

Tests can be run by using the `npm test` script command from the root folder.

Testing setup consists of:

- Framework: mocha
- Assertion library: chai, chai-http
