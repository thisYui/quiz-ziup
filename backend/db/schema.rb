# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_06_29_073017) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", force: :cascade do |t|
    t.bigint "participations_id", null: false
    t.bigint "question_id", null: false
    t.string "answerable_type"
    t.bigint "answerable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answerable_type", "answerable_id"], name: "index_answers_on_answerable"
    t.index ["participations_id"], name: "index_answers_on_participations_id"
    t.index ["question_id"], name: "index_answers_on_question_id"
  end

  create_table "choice_answers", force: :cascade do |t|
    t.bigint "option_id", null: false
    t.string "answerable_type", null: false
    t.bigint "answerable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answerable_type", "answerable_id"], name: "index_choice_answers_on_answerable"
    t.index ["option_id"], name: "index_choice_answers_on_option_id"
  end

  create_table "choice_options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "content", null: false
    t.boolean "is_correct", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_choice_options_on_question_id"
    t.check_constraint "\"position\" > 0", name: "index_greater_than_zero"
  end

  create_table "clients", force: :cascade do |t|
    t.text "full_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["full_name"], name: "index_clients_on_full_name", unique: true
  end

  create_table "fill_answers", force: :cascade do |t|
    t.bigint "option_id", null: false
    t.string "answerable_type", null: false
    t.bigint "answerable_id", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answerable_type", "answerable_id"], name: "index_fill_answers_on_answerable"
    t.index ["option_id"], name: "index_fill_answers_on_option_id"
  end

  create_table "fill_options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "reply", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_fill_options_on_question_id"
  end

  create_table "matching_answers", force: :cascade do |t|
    t.bigint "option_left_id", null: false
    t.bigint "option_right_id", null: false
    t.string "answerable_type", null: false
    t.bigint "answerable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answerable_type", "answerable_id"], name: "index_matching_answers_on_answerable"
    t.index ["option_left_id"], name: "index_matching_answers_on_option_left_id"
    t.index ["option_right_id"], name: "index_matching_answers_on_option_right_id"
  end

  create_table "matching_options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "content", null: false
    t.integer "side", null: false
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_matching_options_on_question_id"
    t.check_constraint "\"position\" > 0", name: "index_greater_than_zero"
  end

  create_table "participations", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.string "participator_type"
    t.bigint "participator_id"
    t.datetime "time"
    t.integer "score", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participator_type", "participator_id"], name: "index_participations_on_participator"
    t.index ["quiz_id"], name: "index_participations_on_quiz_id"
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.text "content", null: false
    t.integer "question_type", null: false
    t.integer "score", default: 1
    t.integer "level"
    t.integer "time", default: 30
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.bigint "owner_user_id", null: false
    t.text "code", null: false
    t.text "title", null: false
    t.text "description"
    t.integer "status", null: false
    t.integer "max_participants"
    t.boolean "can_register", null: false
    t.text "key"
    t.integer "topic", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "code_unique_index", unique: true
    t.index ["owner_user_id"], name: "index_quizzes_on_owner_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.text "full_name", null: false
    t.text "email", null: false
    t.text "password", null: false
    t.date "birth_date", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.check_constraint "birth_date <= CURRENT_DATE", name: "birth_date_not_in_future"
  end

  add_foreign_key "answers", "participations", column: "participations_id", on_delete: :cascade
  add_foreign_key "answers", "questions", on_delete: :cascade
  add_foreign_key "choice_answers", "choice_options", column: "option_id", on_delete: :cascade
  add_foreign_key "choice_options", "questions", on_delete: :cascade
  add_foreign_key "fill_answers", "fill_options", column: "option_id", on_delete: :cascade
  add_foreign_key "fill_options", "questions", on_delete: :cascade
  add_foreign_key "matching_answers", "matching_options", column: "option_left_id", on_delete: :cascade
  add_foreign_key "matching_answers", "matching_options", column: "option_right_id", on_delete: :cascade
  add_foreign_key "matching_options", "questions", on_delete: :cascade
  add_foreign_key "participations", "quizzes", on_delete: :cascade
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quizzes", "users", column: "owner_user_id", on_delete: :cascade
end
