class CreateWordCloudWords < ActiveRecord::Migration
  def change
    create_table :word_cloud_words do |t|
      t.string :word_text
      t.integer :count

      t.timestamps
    end
    add_index :word_cloud_words, :count
  end
end
