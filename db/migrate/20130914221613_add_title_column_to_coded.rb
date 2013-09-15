class AddTitleColumnToCoded < ActiveRecord::Migration
  def change
    add_column :coded_messages, :title, :string
  end
end
