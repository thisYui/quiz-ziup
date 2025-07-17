class AddTriggersToQuizSchema < ActiveRecord::Migration[7.1]
  def up
    execute <<-SQL
      CREATE OR REPLACE FUNCTION notify_quiz_participation()
      RETURNS trigger AS $$
      DECLARE
        user_name TEXT;
        avatar TEXT;
      BEGIN
        -- Lấy thông tin người dùng tùy theo loại participator
        IF NEW.participator_type = 'User' THEN
          SELECT full_name, avatar_url INTO user_name, avatar FROM users WHERE id = NEW.participator_id;

        ELSIF NEW.participator_type = 'Client' THEN
          SELECT full_name, 'default/avatar.png' INTO user_name, avatar FROM clients WHERE id = NEW.participator_id;
        END IF;

        -- Tạo payload gửi đi
        PERFORM pg_notify(
          'quiz_session_notifications',
          json_build_object(
            'quiz_id', NEW.quiz_id,
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
