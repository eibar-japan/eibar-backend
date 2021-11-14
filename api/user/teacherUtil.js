const { v4: uuidv4, validate: validate_uuid } = require("uuid");
const Joi = require("joi");
// TODO advanced: create common joi options patterns somewhere else and import them.
const joiOptions = {
  abortEarly: false, // report all errors in schema
  render: false, // stops creation of Joi-formatted error message for performance
};

const {
  EibarError,
  ERROR_DICT,
  customMessageError,
} = require("../util/error_handling");

const teacherSchemaNew = Joi.object({// TODO beginner: finish defining schema - DONE
  username: Joi.string(),
  email: Joi.string()
    .max(SCHEMA.USER_EMAIL_MAX_LENGTH)
    .email()
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
  first_name: Joi.string()
    .alphanum()
    .min(SCHEMA.FIRST_NAME_MIN_LENGTH)
    .max(SCHEMA.LAST_NAME_MAX_LENGTH)
    .alter({
      post: (schema) => schema.required(),
      patch: (schema) => schema.optional(),
      login: (schema) => schema.required(),
    }),
  last_name: Joi.string()
    .aplhanum()
    .min(SCHEMA.LAST_NAME_MIN_LENGTH),
    .max(SCHEMA.LAST_NAME_MAX_LENGTH),
    .alter({
      post:(schema) => schema.required(),
      patch:(schema) => schema.optional(),
      login:(schema) => schema.required(),
    }),
  password: Joi.string()
    .pattern(SCHEMA.USER_PASSWORD_REGEX)
    .alter({
      post:(schema) => schema.required(),
      patch:(schema) => schema.optional(),
      patch:(schema) => schema.required(),
    }),  
});

const teacherSchemaUpdate = Joi.object({
  username: Joi.string(),
  // TODO beginner: finish defining schema
}).or("username");

function createTeacher(knex) {
  return (req, res, next) => {
    // TODO beginner: code create method
    res.sendStatus(200);
  };
}

function updateTeacher(knex) {
  return (req, res, next) => {
    // TODO beginner: code update method
    res.sendStatus(200);
  };
}

function deleteTeacher(knex) {
  return (req, res, next) => {
    // TODO beginner: code delete method
    res.sendStatus(200);
  };
}

function insertTeacher(knex, newTeacherData) {
  return knex("teacher_profile").insert(newTeacherData, ["eid"]);
}

function teacherFactory(knex, userId) {
  const newTeacherData = {
    // to implement when required
  };
  return insertTeacher(knex, userId, newTeacherData);
}

async function checkNewTeacher(newTeacherInput, knex) {
  // TODO beginner: code this. should return a promise (if designed like userUtil)
  return;
}

async function checkUpdateTeacher(eid, updateTeacherInput, knex) {
  // TODO beginner: code this. should return a promise (if designed like userUtil)
  return;
}

const EIBAR_TEACHER_ERROR_MAP = {
  // TODO beginner: fill out the error map for teacher schema
  "username--any.required": "MY ERROR",
};

module.exports = {
  schemaTest: {
    joiOptions,
    teacherSchemaNew,
    teacherSchemaUpdate,
    EIBAR_TEACHER_ERROR_MAP,
  },
  createTeacher,
  updateTeacher,
  deleteTeacher,
  teacherFactory,
};
