class AddTriggersToQuizSchema < ActiveRecord::Migration[7.1]
  def up
    execute <<-SQL
      CREATE OR REPLACE FUNCTION notify_quiz_participation()
      RETURNS trigger AS $$
      DECLARE
        quiz_id INTEGER;
        user_name TEXT;
        avatar TEXT;
      BEGIN
        SELECT quiz_sessions.quiz_id INTO quiz_id
        FROM quiz_sessions
        WHERE quiz_sessions.id = NEW.quiz_session_id;
      
        IF NEW.participator_type = 'User' THEN
          SELECT full_name, avatar_url INTO user_name, avatar
          FROM users
          WHERE id = NEW.participator_id;
      
        ELSIF NEW.participator_type = 'Client' THEN
          SELECT full_name, 'default/avatar.png' INTO user_name, avatar
          FROM clients
          WHERE id = NEW.participator_id;
        END IF;
      
        PERFORM pg_notify(
          'quiz_' || quiz_id,
          json_build_object(
            'quiz_id', quiz_id,
            'quiz_session_id', NEW.quiz_session_id,
            'participator_id', NEW.participator_id,
            'name', user_name,
            'avatar', avatar
          )::text
        );
      
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_notify_new_participation
      AFTER INSERT ON participations
      FOR EACH ROW
      EXECUTE FUNCTION notify_quiz_participation();
    SQL
  end

  def down
    execute <<-SQL
      DROP TRIGGER IF EXISTS trigger_notify_new_participation ON participations;
      DROP FUNCTION IF EXISTS notify_quiz_participation();
    SQL
  end
end
