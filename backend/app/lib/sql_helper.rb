class SqlHelper
  def self.get_top_quiz_topic(limit = 10)
    # Lấy danh sách các quiz nổi bật theo topic
    # Lấy top 10 quiz có số lượng người tham gia nhiều nhất
    find_by_sql(<<-SQL)
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
end