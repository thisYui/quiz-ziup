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
    art: 8,
    technology: 9,
    health: 10,
    society: 11,
    other: 12
  }

  extend FriendlyId
  friendly_id :title, use: [:slugged, :history] # lưu lịch sử slug cũ để redirect nếu cần

  validates :title, presence: true
  validates :slug, uniqueness: true

  def should_generate_new_friendly_id?
    will_save_change_to_title?  # rails 6+ dùng cái này thay cho title_changed?
  end

  KEY = {
    NOT: 0,
    INVALID: 1
  }

  def self.find_quiz_by_code_and_key(code, key = nil)
    quiz = Quiz.find_by(code: code)
    return nil unless quiz

    return KEY[:NOT] if quiz.is_private && key.nil?
    return KEY[:INVALID] if quiz.is_private && quiz.key != key

    quiz
  end

  def self.quiz_open
    Quiz.where(id: QuizSession.where(is_ended: false)
                              .select(:quiz_id))
        .pluck(:id)
  end

  def is_closed?
    QuizSession.exists?(quiz_id: id, is_ended: true)
  end

  def self.get_quiz_info(quiz_session_id, participator_id)
    Answer.where(quiz_session_id: quiz_session_id, participator_id: participator_id)
          .map { |answer| QuestionUtils.get_content__answer__result(answer) }
  end

  def questions_with_content
    Question.where(quiz_id: id)
            .map{ |question| QuestionUtils.get_content__question(question) }
  end

end
