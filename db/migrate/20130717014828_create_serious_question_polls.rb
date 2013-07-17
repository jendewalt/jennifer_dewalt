class CreateSeriousQuestionPolls < ActiveRecord::Migration
  def change
    create_table :serious_question_polls do |t|
      t.integer :this_votes
      t.integer :that_votes
      t.integer :self_votes

      t.timestamps
    end
  end
end
