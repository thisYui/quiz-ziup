class AddConstraintsToQuizSchema < ActiveRecord::Migration[7.1]
  def change
    # Contraints nullability and uniqueness for various tables in the quiz schema
    # Users
    change_column_null :users, :full_name, false
    change_column_null :users, :email, false
    add_index :users, :email, unique: true, name: "index_users_on_email", if_not_exists: true

    # Clients
    change_column_null :clients, :full_name, false
    add_index :clients, :full_name, unique: true

    # Quizzes
    change_column_null :quizzes, :owner_user_id, false
    change_column_null :quizzes, :code, false
    change_column_null :quizzes, :title, false
    change_column_null :quizzes, :topic, false
    add_index :quizzes, :code, unique: true, name: "code_unique_index", if_not_exists: true

    # Questions
    change_column_null :questions, :quiz_id, false
    change_column_null :questions, :content, false
    change_column_null :questions, :question_type, false
    change_column_null :questions, :position, false
    add_check_constraint :questions, "position > 0", name: "index_greater_than_zero"

    # Choice Options
    change_column_null :choice_options, :question_id, false
    change_column_null :choice_options, :content, false
    change_column_null :choice_options, :is_correct, false
    change_column_null :choice_options, :position, false
    add_check_constraint :choice_options, "position > 0", name: "index_greater_than_zero"

    # Matching Options
    change_column_null :matching_options, :question_id, false
    change_column_null :matching_options, :content, false
    change_column_null :matching_options, :side, false
    add_check_constraint :matching_options, "position > 0", name: "index_greater_than_zero"

    # Matching Answers (2 bên đều là option)
    change_column_null :matching_results, :option_left_id, false
    change_column_null :matching_results, :option_right_id, false

    # Fill Answers
    change_column_null :fill_results, :question_id, false
    change_column_null :fill_results, :content, false

    # Participation (polymorphic: participator)
    change_column_null :participations, :quiz_session_id, false
    change_column_null :participations, :participator_id, true
    change_column_null :participations, :participator_type, true

    # Answer (polymorphic: answerable)
    change_column_null :answers, :participations_id, false
    change_column_null :answers, :question_id, false

  end
end
