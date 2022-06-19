const { v4: uuidv4, validate: validate_uuid } = require("uuid");
const Joi = require("joi");
// TODO advanced: create common joi options patterns somewhere else and import them.

const Dinero = require('dinero.js');
const LANGUAGE_CODES = require('iso-639-1').getAllCodes();
const SCHEMA = require("../util/schema_constants");

const {
  EibarError,
  ERROR_DICT,
  customMessageError,
} = require("../util/error_handling");

const teacherSchemabase = Joi.object({
  eid: Joi.string()
    .optional(),
  display_name: Joi.string()
    .min(SCHEMA.TEACHER_DISPLAYNAME_MIN_LENGTH)
    .max(SCHEMA.TEACHER_DISPLAYNAME_MAX_LENGTH)
    .required(),
  language_code: Joi.string()
    .allow(...LANGUAGE_CODES)
    .required(),
  default_rate: Joi
    .custom(checkDineroObject,"custom checker for Dinero")
    .required(),
});

// Leave New and Update schemas equivalent for now, with all fields required.
const teacherSchemaNew = teacherSchemabase;
const teacherSchemaUpdate = teacherSchemabase;

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

function checkDineroObject(value, helpers) {
  try {
    let dineroValue = Dinero(value);
  } catch {
    throw new Error("Rejected by Dinero")
  }
  if (value.amount > 20000) {
    helpers.error('number.max');
  }
}

const EIBAR_TEACHER_ERROR_MAP = {
  // TODO beginner: fill out the error map for teacher schema
  "display_name--any.required": ERROR_DICT.E0000_DEFAULT_ERROR,
  "display_name--string.min": ERROR_DICT.E0000_DEFAULT_ERROR, // TODO create better eibar error
  "display_name--string.max": ERROR_DICT.E0000_DEFAULT_ERROR, // TODO create better eibar error
};

module.exports = {
  schemaTest: {
    teacherSchemaNew,
    teacherSchemaUpdate,
    EIBAR_TEACHER_ERROR_MAP,
  },
  createTeacher,
  updateTeacher,
  deleteTeacher,
  teacherFactory,
};
