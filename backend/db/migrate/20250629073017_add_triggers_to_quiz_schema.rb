class AddTriggersToQuizSchema < ActiveRecord::Migration[7.1]
    def up
        execute <<-SQL
            CREATE OR REPLACE FUNCTION notify_quiz_participation()
            RETURNS trigger AS $$
            DECLARE
              user_name TEXT;
              avatar TEXT;
              payload JSON;
            BEGIN
              -- Lấy thông tin người dùng
              SELECT full_name, avatar_url INTO user_name, avatar FROM users WHERE id = NEW.id;

              -- Tạo payload gửi đi
              payload := json_build_object(
                'quiz_id', NEW.quiz_id,
                'user_id', NEW.user_id,
                'name', user_name,
                'avatar', avatar
              );

              -- Gửi thông báo với tên kênh cố định
              PERFORM pg_notify('quiz_notifications', payload::text);

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
            DROP TRIGGER IF EXISTS trigger_notify_new_participant ON participations;
            DROP FUNCTION IF EXISTS notify_quiz_participation();
        SQL
    end
end
