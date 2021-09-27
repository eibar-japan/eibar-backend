# Eibar backend

## What is Eibar and what is the role of this repo?

Eibar is the "Uber" for freelance, in-person language tutors. It allows teachers and students to sign up as users of the Eibar app and find each other for in-person language lessons.

This repo is the heart of the Eibar system, as it is the API backend that holds (will hold?) all user, lesson, and payment data and serve that data to the various other Eibar consumers of that data: web application, iOS, and Android apps.

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
