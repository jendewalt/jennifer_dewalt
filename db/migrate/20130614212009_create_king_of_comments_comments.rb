class CreateKingOfCommentsComments < ActiveRecord::Migration
  def change
    create_table :king_of_comments_comments do |t|
      t.string :name
      t.text :content
      t.integer :votes

      t.timestamps
    end
  end
end
