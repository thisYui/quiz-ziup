class User < ApplicationRecord
  has_many :participation, as: :participator, dependent: :destroy
  has_many :quizzes, dependent: :destroy
  has_many :jwt_tokens, dependent: :destroy
  has_secure_password

  def self.get_quiz_information(user_id)
    participations = Participation.where(participator_id: user_id, participator_type: 'User')

    quiz_info = []
    participations.each do |participation|
      quiz_session = participation.quiz_session
      quiz = Quiz.find_by(id: quiz_session.quiz_id)
      next unless quiz

      quiz_info << {
        participator_id: participation.participator_id,
        quiz_id: quiz.id,
        quiz_session_id: quiz_session.id,
        quiz_code: quiz.code,
        quiz_title: quiz.title,
        quiz_description: quiz.description,
        score: participation.score,
        created_at: quiz_session.created_at
      }
    end

    quiz_info
  end
end
