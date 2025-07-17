class QuizSession < ApplicationRecord
  belongs_to :quiz
  has_many :participations, dependent: :destroy
  def get_information_quiz_session(quiz_session_id)
    SqlQuery.get_information_quiz_session(quiz_session_id)
  end

  def self.get_instance_session(quiz_id)
    QuizSession.where(quiz_id: quiz_id).order(updated_at: :desc).first
  end

  def self.get_all_quiz_sessions(quiz_id)
    QuizSession.where(quiz_id: quiz_id).each do |session|
      {
        id: session.id,
        created_at: session.created_at,
      }
    end
  end

  def is_full(quiz_id)
    quiz = Quiz.find_by(id: quiz_id)

    if quiz.nil?
      return false
    end

    count_registered.to_i > quiz.max_participants.to_i
  end

  def check_close_register
    if self.is_full(quiz_id)
      self.is_ended = true
      save
    end
  end

  def join(id, type)
    if "User" == type
      quiz_session.join_user(id)
    elsif "Client" == type
      quiz_session.join_client(id)
    else
      render json: { error: I18n.t('quiz.join.invalid') }, status: :unprocessable_entity
    end
  end

  def join_user(user_id)
    Participation.create(
      participator_id: user_id,
      participator_type: 'User',
      quiz_session_id: id  # ID của phiên quiz
    )

    increment!(:count_registered)
    check_close_register
  end

  def join_client(client_id)
    Participation.create(
      participator_id: client_id,
      participator_type: 'Client',
      quiz_session_id: id  # ID của phiên quiz
    )

    increment!(:count_registered)
    check_close_register
  end

  def get_list_participants
    participants = []

    # Tìm tất cả dòng tham gia quiz trong lần mở hiện tại
    session_participants = Participation.where(quiz_sessions_id: id)  # ID của phiên quiz

    session_participants.each do |p|
      # Kiểm tra type của participator
      if p.participator_type == 'User'
        user = User.find_by(id: p.participator_id)

        if user
          participants << {
            id: user.id,
            name: user.name,
            avatar: user.avatar_url
          }
        end
      elsif p.participator_type == 'Client'
        client = Client.find_by(id: p.participator_id)

        if client
          participants << {
            id: client.id,
            name: client.name,
            avatar: "../assets/images/default_avatar.png"
          }
        end
      else
        Rails.logger.warn("Unknown participator type: #{p.participator_type}")
      end
    end

    participants
  end
end
