# This initializer sets up a background thread to listen for PostgreSQL notifications
# about new quiz participants and broadcasts them to the appropriate ActionCable channels

require 'pg'

module QuizListener
  class << self
    # Store active quizzes and their participants
    attr_accessor :active_quizzes

    def start
      return if @thread && @thread.alive?

      @active_quizzes = {}
      @mutex = Mutex.new
      @shutdown = false

      # Start the listener thread
      @thread = Thread.new do
        establish_connection
        listen_for_notifications
      end

      # Set thread as abort_on_exception to help with debugging
      @thread.abort_on_exception = true
    end

    def shutdown
      @shutdown = true
      @thread&.terminate
      @conn&.close
      Rails.logger.info "QuizListener: Shutting down"
    end

    def establish_connection
      config = ActiveRecord::Base.connection_db_config.configuration_hash
      @conn = PG.connect(
        host: config[:host],
        port: config[:port],
        dbname: config[:database],
        user: config[:username],
        password: config[:password]
      )
      # Listen to the channel used in the trigger function
      # The trigger uses 'quiz_' || NEW.quiz_id::text as the channel name
      # We need to listen to each quiz channel individually when a quiz is added
      # For now, we'll listen to a general channel for all quiz notifications
      @conn.exec("LISTEN quiz_notifications")
      Rails.logger.info "QuizListener: Connected to PostgreSQL and listening for notifications"
    rescue => e
      Rails.logger.error "QuizListener: Failed to connect to PostgreSQL: #{e.message}"
      sleep 5
      retry
    end

    def listen_for_notifications
      until @shutdown
        # Use a timeout to allow checking the shutdown flag periodically
        @conn.wait_for_notify(1) do |channel, pid, payload|
          process_notification(channel, payload)
        end
      end
    rescue => e
      Rails.logger.error "QuizListener: Error in notification loop: #{e.message}"
      sleep 5
      establish_connection
      retry unless @shutdown
    end

    def process_notification(channel, payload)
      # Verify that we're processing the correct channel
      return unless channel == 'quiz_notifications'

      data = JSON.parse(payload)
      quiz_id = data['quiz_id']

      @mutex.synchronize do
        # Add quiz to active quizzes if not already present
        @active_quizzes[quiz_id] ||= []

        # Add user to quiz participants if not already present
        unless @active_quizzes[quiz_id].include?(data['user_id'])
          @active_quizzes[quiz_id] << data['user_id']
        end
      end

      # Broadcast to ActionCable
      ActionCable.server.broadcast("quiz_#{quiz_id}", {
        event: 'new_participant',
        participant: {
          user_id: data['user_id'],
          name: data['name'],
          avatar: data['avatar']
        },
        participant_count: @active_quizzes[quiz_id].size
      })

      Rails.logger.info "QuizListener: Broadcasted new participant for quiz #{quiz_id}"
    rescue => e
      Rails.logger.error "QuizListener: Error processing notification: #{e.message}"
    end

    def add_quiz(quiz_id, owner_id)
      @mutex.synchronize do
        @active_quizzes[quiz_id] = [owner_id]
      end

      # Broadcast initial state to the quiz channel
      ActionCable.server.broadcast("quiz_#{quiz_id}", {
        event: 'quiz_opened',
        owner_id: owner_id,
        participant_count: 1
      })

      Rails.logger.info "QuizListener: Added quiz #{quiz_id} with owner #{owner_id}"
    end

    def remove_quiz(quiz_id)
      @mutex.synchronize do
        @active_quizzes.delete(quiz_id)
      end

      # Broadcast quiz completion to the quiz channel
      ActionCable.server.broadcast("quiz_#{quiz_id}", {
        event: 'quiz_completed'
      })

      Rails.logger.info "QuizListener: Removed quiz #{quiz_id}"
    end

    def add_participant(quiz_id, user_id)
      added = false

      @mutex.synchronize do
        @active_quizzes[quiz_id] ||= []
        unless @active_quizzes[quiz_id].include?(user_id)
          @active_quizzes[quiz_id] << user_id
          added = true
        end
      end

      if added
        # Get user information
        user = User.find_by(id: user_id)

        if user
          # Broadcast participant addition to the quiz channel
          ActionCable.server.broadcast("quiz_#{quiz_id}", {
            event: 'participant_joined',
            participant: {
              user_id: user_id,
              name: user.full_name,
              avatar: user.avatar_url
            },
            participant_count: @active_quizzes[quiz_id].size
          })

          Rails.logger.info "QuizListener: Added participant #{user_id} to quiz #{quiz_id}"
        end
      end
    end

    def remove_participant(quiz_id, user_id)
      removed = false

      @mutex.synchronize do
        if @active_quizzes[quiz_id]
          removed = @active_quizzes[quiz_id].delete(user_id)
        end
      end

      if removed
        # Broadcast participant removal to the quiz channel
        ActionCable.server.broadcast("quiz_#{quiz_id}", {
          event: 'participant_left',
          user_id: user_id,
          participant_count: @active_quizzes[quiz_id]&.size || 0
        })

        Rails.logger.info "QuizListener: Removed participant #{user_id} from quiz #{quiz_id}"
      end
    end

    def get_participants(quiz_id)
      participants = []

      @mutex.synchronize do
        if @active_quizzes[quiz_id]
          user_ids = @active_quizzes[quiz_id]
          participants = User.where(id: user_ids).select(:id, :full_name, :avatar_url).map do |user|
            {
              user_id: user.id,
              name: user.full_name,
              avatar: user.avatar_url
            }
          end
        end
      end

      participants
    end

    def get_participant_count(quiz_id)
      @mutex.synchronize do
        @active_quizzes[quiz_id]&.size || 0
      end
    end
  end
end

# Start the listener when Rails initializes
Rails.application.config.after_initialize do
  QuizListener.start
end

# Register shutdown handler
at_exit do
  QuizListener.shutdown
end

# Also register for Rails shutdown event
Rails.application.config.to_prepare do
  ActiveSupport.on_load(:active_record) do
    ActiveSupport::Reloader.to_complete do
      QuizListener.shutdown
    end
  end
end
