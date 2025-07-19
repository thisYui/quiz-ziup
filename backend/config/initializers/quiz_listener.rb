require 'pg'

Thread.new do
  begin
    conn = PG.connect(
      dbname: ENV.fetch('PG_DATABASE', 'quiz_backend_development'),
      user: ENV.fetch('PG_USER', 'postgres'),
      password: ENV.fetch('PG_PASSWORD', ENV["LOCAL_POSTGRES_PASSWORD"]),
      host: ENV.fetch('PG_HOST', 'localhost'),
      port: ENV.fetch('PG_PORT', 5432)
    )

    Rails.logger.info "Quiz Listener started..."

    # LISTEN các quiz đang mở khi boot
    quiz_ids = Quiz.quiz_open
    quiz_ids.each do |id|
      conn.exec("LISTEN quiz_#{id}")
      Rails.logger.info "Listening on quiz_#{id}"
    end

    loop do
      conn.wait_for_notify do |channel, _pid, payload|
        Rails.logger.info "Received notify on #{channel}: #{payload}"
        SocketNotifier.one_player_joined(payload)
      end
    end
  rescue => e
    Rails.logger.error "Quiz Listener crashed: #{e.message}"
  end
end
