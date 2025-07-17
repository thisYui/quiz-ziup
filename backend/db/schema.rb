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
    t.integer "magic_points", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "answerable_type", null: false
    t.index ["participations_id"], name: "index_answers_on_participations_id"
    t.index ["question_id"], name: "index_answers_on_question_id"
  end

  create_table "choice_answers", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.bigint "choice_option_id", null: false
    t.bigint "answer_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answer_id"], name: "index_choice_answers_on_answer_id"
    t.index ["choice_option_id"], name: "index_choice_answers_on_choice_option_id"
    t.index ["question_id"], name: "index_choice_answers_on_question_id"
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
    t.bigint "question_id", null: false
    t.bigint "answer_id", null: false
    t.text "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answer_id"], name: "index_fill_answers_on_answer_id"
    t.index ["question_id"], name: "index_fill_answers_on_question_id"
  end

  create_table "fill_results", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_fill_results_on_question_id"
  end

  create_table "jwt_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "jti"
    t.datetime "exp"
    t.string "device"
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_tokens_on_jti", unique: true
    t.index ["user_id"], name: "index_jwt_tokens_on_user_id"
  end

  create_table "matching_answers", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.bigint "option_left_id", null: false
    t.bigint "option_right_id", null: false
    t.bigint "answer_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["answer_id"], name: "index_matching_answers_on_answer_id"
    t.index ["option_left_id"], name: "index_matching_answers_on_option_left_id"
    t.index ["option_right_id"], name: "index_matching_answers_on_option_right_id"
    t.index ["question_id"], name: "index_matching_answers_on_question_id"
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

  create_table "matching_results", force: :cascade do |t|
    t.bigint "option_left_id", null: false
    t.bigint "option_right_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "question_id", null: false
    t.index ["option_left_id"], name: "index_matching_results_on_option_left_id"
    t.index ["option_right_id"], name: "index_matching_results_on_option_right_id"
    t.index ["question_id"], name: "index_matching_results_on_question_id"
  end

  create_table "participations", force: :cascade do |t|
    t.bigint "quiz_sessions_id", null: false
    t.string "participator_type"
    t.bigint "participator_id"
    t.integer "score", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participator_type", "participator_id"], name: "index_participations_on_participator"
    t.index ["quiz_sessions_id"], name: "index_participations_on_quiz_sessions_id"
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.text "content", null: false
    t.integer "question_type", null: false
    t.integer "score", default: 1
    t.integer "level"
    t.integer "position", null: false
    t.integer "time", default: 30
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_questions_on_quiz_id"
    t.check_constraint "\"position\" > 0", name: "index_greater_than_zero"
  end

  create_table "quiz_sessions", force: :cascade do |t|
    t.bigint "quiz_id", null: false
    t.boolean "is_ended", default: false, null: false
    t.integer "count_registered", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["quiz_id"], name: "index_quiz_sessions_on_quiz_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.bigint "owner_user_id", null: false
    t.text "code", null: false
    t.text "title", null: false
    t.text "description"
    t.boolean "is_private", default: false
    t.integer "max_participants"
    t.string "key"
    t.integer "topic", null: false
    t.boolean "hide", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "code_unique_index", unique: true
    t.index ["owner_user_id"], name: "index_quizzes_on_owner_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.text "full_name", null: false
    t.text "email", null: false
    t.text "avatar_url", default: "storage/default/__avatar.png"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "answers", "participations", column: "participations_id", on_delete: :cascade
  add_foreign_key "answers", "questions", on_delete: :cascade
  add_foreign_key "choice_answers", "answers", on_delete: :cascade
  add_foreign_key "choice_answers", "choice_options", on_delete: :cascade
  add_foreign_key "choice_answers", "questions", on_delete: :cascade
  add_foreign_key "choice_options", "questions", on_delete: :cascade
  add_foreign_key "fill_answers", "answers", on_delete: :cascade
  add_foreign_key "fill_answers", "questions", on_delete: :cascade
  add_foreign_key "fill_results", "questions", on_delete: :cascade
  add_foreign_key "jwt_tokens", "users", on_delete: :cascade
  add_foreign_key "matching_answers", "answers", on_delete: :cascade
  add_foreign_key "matching_answers", "matching_options", column: "option_left_id", on_delete: :cascade
  add_foreign_key "matching_answers", "matching_options", column: "option_right_id", on_delete: :cascade
  add_foreign_key "matching_answers", "questions", on_delete: :cascade
  add_foreign_key "matching_options", "questions", on_delete: :cascade
  add_foreign_key "matching_results", "matching_options", column: "option_left_id", on_delete: :cascade
  add_foreign_key "matching_results", "matching_options", column: "option_right_id", on_delete: :cascade
  add_foreign_key "matching_results", "questions"
  add_foreign_key "participations", "quiz_sessions", column: "quiz_sessions_id", on_delete: :cascade
  add_foreign_key "questions", "quizzes"
  add_foreign_key "quiz_sessions", "quizzes", on_delete: :cascade
  add_foreign_key "quizzes", "users", column: "owner_user_id", on_delete: :cascade
end
