# created
# Define variables for instantiating models
user = User.new
quiz = Quiz.new
quiz_session = QuizSession.new
question = Question.new
participation = Participation.new
answer = Answer.new

# Question type constants
CHOICE_TYPE = 0
MATCHING_TYPE = 2
FILL_TYPE = 3

# Clear existing data to avoid duplicates when re-seeding
puts "Clearing existing data..."
Answer.delete_all
Participation.delete_all
ChoiceOption.delete_all
MatchingOption.delete_all
MatchingResult.delete_all
FillResult.delete_all
Question.delete_all
QuizSession.delete_all
Quiz.delete_all
User.delete_all

users_id = []
puts "Creating users..."
(0..10).each { |i|
  user = User.new(
    full_name: "user_#{i}",
    email: "user_#{i}@gmail.com",
    password: "123"
  )

  user.save
  users_id << user.id
}

quizs_id = []
puts "Creating quizzes..."
(0..10).each do |i|
  quiz = Quiz.new
  quiz[:title] = "title_#{i}"
  quiz[:description] = "description_#{i}"
  quiz[:code] = "code_#{i}"
  quiz[:is_private] = rand(2) == 0 ? true : false
  quiz[:max_participants] = 100
  quiz[:topic] = rand(13)
  quiz[:key] = quiz[:is_private] ? "key_#{i}" : nil
  quiz[:owner_user_id] = users_id[rand(10)]
  quiz.save
  quizs_id << quiz.id
end

quiz_sessions_id = []
puts "Creating quiz sessions..."
(0..10).each do |i|
  quiz_session = QuizSession.new
  quiz_session[:quiz_id] = quizs_id[i]
  quiz_session[:is_ended] = rand(2) == 0 ? true : false
  quiz_session.save
  quiz_sessions_id << quiz_session.id
end

puts "Creating questions, options, and results for each quiz..."
quizs_id.each do |quiz_id|
  # Create 3 choice questions for each quiz
  3.times do |i|
    question = Question.new
    question[:quiz_id] = quiz_id
    question[:content] = "Multiple choice question #{i+1} for quiz #{quiz_id}"
    question[:question_type] = CHOICE_TYPE
    question[:score] = rand(1..5)
    question[:level] = rand(0..2)
    question[:position] = i
    question[:time] = 30 + rand(30) # 30-60 seconds
    question.save

    # Create 4 options for each choice question (1 correct, 3 incorrect)
    correct_position = rand(4)
    4.times do |j|
      option = ChoiceOption.new
      option[:question_id] = question.id
      option[:content] = "Option #{j+1} for question #{question.id}"
      option[:is_correct] = (j == correct_position)
      option[:position] = j
      option.save
    end
  end

  # Create 2 matching questions for each quiz
  2.times do |i|
    question = Question.new
    question[:quiz_id] = quiz_id
    question[:content] = "Matching question #{i+1} for quiz #{quiz_id}"
    question[:question_type] = MATCHING_TYPE
    question[:score] = rand(2..6)
    question[:level] = rand(0..2)
    question[:position] = i + 3
    question[:time] = 45 + rand(45) # 45-90 seconds
    question.save

    # Create 4 left options and 4 right options
    left_options = []
    right_options = []

    4.times do |j|
      # Left options
      left_option = MatchingOption.new
      left_option[:question_id] = question.id
      left_option[:content] = "Left option #{j+1} for question #{question.id}"
      left_option[:side] = 0 # left side
      left_option[:position] = j
      left_option.save
      left_options << left_option

      # Right options
      right_option = MatchingOption.new
      right_option[:question_id] = question.id
      right_option[:content] = "Right option #{j+1} for question #{question.id}"
      right_option[:side] = 1 # right side
      right_option[:position] = j
      right_option.save
      right_options << right_option
    end

    # Create matching results (correct pairs)
    shuffled_rights = right_options.shuffle
    left_options.each_with_index do |left, index|
      matching_result = MatchingResult.new
      matching_result[:question_id] = question.id
      matching_result[:option_left_id] = left.id
      matching_result[:option_right_id] = shuffled_rights[index].id
      matching_result.save
    end
  end

  # Create 2 fill-in questions for each quiz
  2.times do |i|
    question = Question.new
    question[:quiz_id] = quiz_id
    question[:content] = "Fill-in question #{i+1} for quiz #{quiz_id}"
    question[:question_type] = FILL_TYPE
    question[:score] = rand(1..3)
    question[:level] = rand(0..2)
    question[:position] = i + 5
    question[:time] = 20 + rand(40) # 20-60 seconds
    question.save

    # Create the correct answer for fill-in question
    fill_result = FillResult.new
    fill_result[:question_id] = question.id
    fill_result[:content] = "Correct answer for question #{question.id}"
    fill_result.save
  end
end

puts "Creating participations and answers..."
# Create participations for each quiz session
quiz_sessions_id.each do |session_id|
  # Get 3-7 random users to participate in each session
  participants_count = rand(3..7)
  session = QuizSession.find(session_id)
  quiz = Quiz.find(session.quiz_id)
  questions = Question.where(quiz_id: quiz.id)

  User.order("RANDOM()").limit(participants_count).each do |user|
    # Create participation
    participation = Participation.new
    participation.quiz_session_id = session_id
    participation.participator_type = "User"
    participation.participator_id = user.id
    participation.score = 0
    participation.save!

    # Add answers for each question
    questions.each do |question|
      # Create base answer
      answer = Answer.new(
        participations_id: participation.id,
        question_id: question.id,
        magic_points: rand(0..2).to_i,
        answerable_type: question.question_type
      )
      answer.save

      case question.question_type
      when CHOICE_TYPE
        # For choice questions, select a random option as the answer
        options = ChoiceOption.where(question_id: question.id)
        selected_option = options.sample

        choice_answer = ChoiceAnswer.new
        choice_answer[:question_id] = question.id
        choice_answer[:choice_option_id] = selected_option.id
        choice_answer[:answer_id] = answer.id
        choice_answer.save

        # Update score if the answer is correct
        if selected_option.is_correct
          participation.score += question.score
        end

      when MATCHING_TYPE
        # For matching questions, create some correct and some incorrect matches
        left_options = MatchingOption.where(question_id: question.id, side: 0)
        right_options = MatchingOption.where(question_id: question.id, side: 1)
        correct_results = MatchingResult.where(question_id: question.id)

        # Get a mapping of correct matches
        correct_matches = {}
        correct_results.each do |result|
          correct_matches[result.option_left_id] = result.option_right_id
        end

        # Create answers with a mix of correct and incorrect matches
        left_options.each do |left|
          # 70% chance of correct answer, 30% chance of incorrect
          use_correct = rand < 0.7

          if use_correct
            right_id = correct_matches[left.id]
          else
            # Pick a random wrong option
            wrong_options = right_options.reject { |r| r.id == correct_matches[left.id] }
            right_id = wrong_options.sample.id
          end

          matching_answer = MatchingAnswer.new
          matching_answer[:question_id] = question.id
          matching_answer[:option_left_id] = left.id
          matching_answer[:option_right_id] = right_id
          matching_answer[:answer_id] = answer.id
          matching_answer.save

          # Update score if the answer is correct
          if use_correct
            participation.score += question.score / left_options.length
          end
        end

      when FILL_TYPE
        # For fill-in questions, create an answer that might be correct or incorrect
        correct_result = FillResult.find_by(question_id: question.id)

        # 50% chance of correct answer, 50% chance of incorrect
        is_correct = rand < 0.5

        fill_answer = FillAnswer.new
        fill_answer[:question_id] = question.id
        fill_answer[:answer_id] = answer.id

        if is_correct
          fill_answer[:content] = correct_result.content
          participation.score += question.score
        else
          fill_answer[:content] = "Incorrect answer for question #{question.id}"
        end

        fill_answer.save
      end
    end

    # Save the updated participation score
    participation.save
  end
end

puts "Seeding completed successfully!"
