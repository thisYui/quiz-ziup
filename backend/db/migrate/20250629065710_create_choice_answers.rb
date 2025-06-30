class CreateChoiceAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :choice_answers do |t|
      t.references :option, null: false, foreign_key: { to_table: :choice_options, on_delete: :cascade }
      t.references :answerable, polymorphic: true, null: false

      # Cả single choice và multiple choice đều sử dụng table này
      # Single choice chỉ có 1 answer duy nhất tức 1 dòng
      # Multiple choice có thể có nhiều answers, mỗi answer là 1 dòng tất cả phải đều đúng thì mưới tính là đúng

      t.timestamps
    end
  end
end
