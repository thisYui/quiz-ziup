require 'pg'
require 'set'

Thread.new do
  begin
    conn = PG.connect(
      dbname: ENV.fetch('PG_DATABASE', 'quiz_backend_development'),
      user: ENV.fetch('PG_USER', 'postgres'),
      password: ENV.fetch('PG_PASSWORD', ENV['LOCAL_POSTGRES_PASSWORD']),
      host: ENV.fetch('PG_HOST', 'localhost'),
      port: ENV.fetch('PG_PORT', 5432)
    )

    Rails.logger.info "Quiz Listener started..."

    listened_quiz_ids = Set.new

    # listen các trigger cơ bản
    conn.exec("LISTEN quiz_session_created")
    conn.exec("LISTEN quiz_session_ended")

    loop do
      conn.wait_for_notify(10) do |channel, _pid, payload|
        case channel
        when 'quiz_session_created'
          quiz_id = payload.to_i
          unless listened_quiz_ids.include?(quiz_id)
            conn.exec("LISTEN quiz_#{quiz_id}")
            listened_quiz_ids << quiz_id
            Rails.logger.info "Started listening to quiz_#{quiz_id}"
          end

        when 'quiz_session_ended'
          quiz_id = payload.to_i
          if listened_quiz_ids.include?(quiz_id)
            conn.exec("UNLISTEN quiz_#{quiz_id}")
            listened_quiz_ids.delete(quiz_id)
            Rails.logger.info "Stopped listening to quiz_#{quiz_id}"
          end

        else
          # các notify dạng quiz_{id}
          Rails.logger.info "Received notify on #{channel}: #{payload}"
          SocketNotifier.one_player_joined(payload)
        end
      end
    end

  rescue => e
    Rails.logger.error "Quiz Listener crashed: #{e.message}"
    retry
  end
end
