class CreateCodedMessages < ActiveRecord::Migration
  def change
    create_table :coded_messages do |t|
      t.string :slug
      t.string :message

      t.timestamps
    end

    add_index :coded_messages, :slug
  end
end
