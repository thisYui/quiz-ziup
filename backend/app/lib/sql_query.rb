class SqlQuery
  def self.get_top_quiz_topic(limit = 10)
    # Lấy danh sách các quiz nổi bật theo topic
    # Lấy top 10 quiz có số lượng người tham gia nhiều nhất
    find_by_sql(<<-SQL, limit: limit)
      SELECT q.id, q.code, q.name, q.description, q.topic, r.participant_count
      FROM (
        SELECT q.id, q.topic, COUNT(*) AS participant_count,
               ROW_NUMBER() OVER (PARTITION BY q.topic ORDER BY COUNT(*) DESC) AS rn
        FROM quizzes q
        JOIN quiz_sessions qs ON q.id = qs.quiz_id
        JOIN participants p ON qs.id = p.quiz_session_id
        GROUP BY q.id, q.topic
      ) r
      JOIN quizzes q ON r.id = q.id
      WHERE r.rn <= #{limit}
    SQL
  end

  def self.get_information_quiz_session(quiz_session_id)
    # Lấy danh sách người tham gia của một quiz session
    find_by_sql(<<-SQL, quiz_session_id: quiz_session_id)
      SELECT
        p.participator_id AS participator_id,
        p.score AS score,
        COALESCE(u.full_name, c.full_name) AS full_name,
        COALESCE(u.avatar_url, 'default/avatar.png') AS avatar_url
      FROM participants p
      LEFT JOIN users u ON p.participator_type = 'User' AND p.participator_id = u.id
      LEFT JOIN clients c ON p.participator_type = 'Client' AND p.participator_id = c.id
      WHERE p.quiz_session_id = :quiz_session_id
      ORDER BY p.score DESC
    SQL
  end
end