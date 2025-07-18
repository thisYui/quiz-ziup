class Quiz < ApplicationRecord
  belongs_to :owner_user, class_name: 'User', dependent: :destroy
  has_many :quiz_sessions, dependent: :destroy
  has_many :questions, dependent: :destroy
  enum topic: {
    math: 0,
    physics: 1,
    chemistry: 2,
    biology: 3,
    literature: 4,
    history: 5,
    geography: 6,
    music: 7,
    art: 7,
    technology: 8,
    health: 9,
    society: 10,
    other: 11
  }

  def self.find_quiz_by_code_and_key(code, key = nil)
    quiz = Quiz.find_by(code: code)
    return nil unless quiz

    if quiz.is_private
      if key.nil?
        return "no-key"
      end

      if quiz.key != key
        return "invalid-key"
      end
    end

    quiz
  end

  def self.quiz_open
    quiz_ids = QuizSession.where(is_ended: false).pluck(:quiz_id)
    Quiz.where(id: quiz_ids).pluck(:id)
  end
end
