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

    execute <<-SQL
    -- INSERT: quiz bắt đầu
      CREATE OR REPLACE FUNCTION notify_quiz_session_created()
      RETURNS trigger AS $$
      BEGIN
        PERFORM pg_notify('quiz_session_created', NEW.quiz_id::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
         
      CREATE TRIGGER trigger_quiz_session_created
      AFTER INSERT ON quiz_sessions
      FOR EACH ROW
      EXECUTE FUNCTION notify_quiz_session_created();
    SQL

    execute <<-SQL
      CREATE OR REPLACE FUNCTION notify_quiz_session_ended()
      RETURNS trigger AS $$
      BEGIN
        IF NEW.is_ended IS TRUE AND OLD.is_ended IS DISTINCT FROM NEW.is_ended THEN
          PERFORM pg_notify('quiz_session_ended', NEW.quiz_id::text);
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
         
      CREATE TRIGGER trigger_quiz_session_ended
      AFTER UPDATE ON quiz_sessions
      FOR EACH ROW
      WHEN (OLD.is_ended IS DISTINCT FROM NEW.is_ended)
      EXECUTE FUNCTION notify_quiz_session_ended();
    SQL
  end

  def down
    execute <<-SQL
      DROP TRIGGER IF EXISTS trigger_notify_new_participation ON participations;
      DROP FUNCTION IF EXISTS notify_quiz_participation();
    SQL

    execute <<-SQL
      DROP TRIGGER IF EXISTS trigger_quiz_session_created ON quiz_sessions;
      DROP FUNCTION IF EXISTS notify_quiz_session_created();
    SQL

    execute <<-SQL
      DROP TRIGGER IF EXISTS trigger_quiz_session_ended ON quiz_sessions;
      DROP FUNCTION IF EXISTS notify_quiz_session_ended();
    SQL
  end
end
