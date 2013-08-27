class CreatePollsieAnswers < ActiveRecord::Migration
  def change
    create_table :pollsie_answers do |t|
      t.integer :votes
      t.integer :poll_id
      t.string :text

      t.timestamps
    end
    add_index :pollsie_answers, :votes
    add_index :pollsie_answers, :poll_id
  end
end
