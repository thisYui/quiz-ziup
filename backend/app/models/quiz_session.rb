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
    QuizSession.where(quiz_id: quiz_id).each do |session| {
        id: session.id,
        created_at: session.created_at,
      }
    end
  end

  def is_full(quiz_id)
    quiz = Quiz.find_by(id: quiz_id)
    return false unless quiz

    count_registered.to_i >= quiz.max_participants.to_i
  end

  def check_close_register
    if self.is_full(quiz_id)
      self.is_ended = true
      save
    end
  end

  def join(id, full_name)
    quiz_session.join_user(id) if type
    quiz_session.join_client(full_name)
  end

  def join_user(user_id)
    user = User.find_by(id: user_id)
    return nil unless user

    Participation.create(
      participator: user,
      quiz_session_id: id  # ID của phiên quiz
    )

    increment!(:count_registered)
    check_close_register
    user_id
  end

  def join_client(full_name)
    client = Client.new(full_name: full_name)

    Participation.create(
      participator: client,
      quiz_session_id: id  # ID của phiên quiz
    )

    increment!(:count_registered)
    check_close_register
    client.id
  end

  def get_list_participants
    session_participants = Participation.where(quiz_session_id: id)

    user_ids   = session_participants
                   .select { |p| p.participator_type == 'User' }
                   .map(&:participator_id)
    client_ids = session_participants
                   .select { |p| p.participator_type == 'Client' }
                   .map(&:participator_id)

    users   = User.where(id: user_ids).index_by(&:id)
    clients = Client.where(id: client_ids).index_by(&:id)

    session_participants.map do |p|
      case p.participator_type
      when 'User'
        user = users[p.participator_id]
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar_url
        } if user
      when 'Client'
        client = clients[p.participator_id]
        {
          id: client.id,
          name: client.name,
          avatar: "../assets/images/default_avatar.png"
        } if client
      else
        Rails.logger.warn("Unknown participator type: #{p.participator_type}")
        nil
      end
    end.compact
  end
end
